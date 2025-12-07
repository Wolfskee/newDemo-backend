import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user-input.dto';
import {
  UserResponseDto,
  PaginatedUserResponseDto,
} from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<PaginatedUserResponseDto> {
    const skip = (page - 1) * limit;

    const total = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      omit: { password: true },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
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
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async findUserForAuth(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
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

    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
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

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    // Will throw NotFoundException if user does not exist
    await this.getUserById(id);

    const deletedUser = await this.prisma.user.delete({
      where: { id },
      omit: { password: true },
    });

    return deletedUser;
  }
}
