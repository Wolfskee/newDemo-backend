import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user-input.dto';
import {
  UserResponseDto,
  PaginatedUserResponseDto,
} from './dto/user-response.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UserService {
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
  }

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<PaginatedUserResponseDto> {
    const skip = (page - 1) * limit;

    const total = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      omit: { password: true, refreshToken: true },
    });

    const usersWithProfileImageUrls = await Promise.all(
      users.map(async (user) => {
        const { profileImageKey, ...rest } = user;
        if (profileImageKey) {
          rest['profileImageUrl'] = await this.s3Service.getPresignedGetUrl({
            Bucket: this.bucket,
            Key: profileImageKey,
          });
        }
        return rest;
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      users: usersWithProfileImageUrls,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const { profileImageKey, ...rest } = user;
    if (profileImageKey) {
      rest['profileImageUrl'] = await this.s3Service.getPresignedGetUrl({
        Bucket: this.bucket,
        Key: profileImageKey,
      });
    }

    return rest;
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user)
      throw new ConflictException('User with this email already exists');

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: await hash(data.password, 10),
      },
    });

    const { password, refreshToken, ...response } = newUser;

    return response;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    // Will throw NotFoundException if user does not exist
    const user = await this.getUserById(id);

    // Check email uniqueness if email is being changed
    if (data.email && data.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists)
        throw new ConflictException('User with this email already exists');
    }

    const updatedData: UpdateUserDto = { ...data };

    if (updatedData.password) {
      updatedData.password = await hash(updatedData.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });

    const { password, refreshToken, ...response } = updatedUser;
    return response;
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    // Will throw NotFoundException if user does not exist
    await this.getUserById(id);

    const deletedUser = await this.prisma.user.delete({
      where: { id },
      omit: { password: true, refreshToken: true },
    });

    return deletedUser;
  }

  async findUserByEmailForAuth(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findUserByIdForAuth(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: await hash(refreshToken, 10),
      },
    });
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async uploadUserProfileImage(
    userId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const user = await this.getUserWithProfileImageKeyById(userId);

    if (!image || !image.buffer) {
      throw new NotFoundException('Invalid image file');
    }

    // delete old image if exists
    if (user.profileImageKey) {
      await this.deleteUserProfileImage(user.id);
    }

    const timestamp = Date.now();
    const ext = image.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `img-${timestamp}.${ext}`;
    const key = `users/${user.id}/profile/${filename}`;

    // upload file to S3
    await this.s3Service.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: image.buffer,
      ContentType: image.mimetype,
    });

    // store only the key in DB
    await this.prisma.user.update({
      where: { id: user.id },
      data: { profileImageKey: key },
    });

    // generate presigned GET URL for frontend to use
    const imageUrl = await this.s3Service.getPresignedGetUrl({
      Bucket: this.bucket,
      Key: key,
    });

    return imageUrl;
  }

  async deleteUserProfileImage(userId: string): Promise<void> {
    const user = await this.getUserWithProfileImageKeyById(userId);

    if (!user.profileImageKey) return;

    await this.s3Service.deleteObject({
      Bucket: this.bucket,
      Key: user.profileImageKey,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { profileImageKey: null },
    });
  }

  async getUserWithProfileImageKeyById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }
}
