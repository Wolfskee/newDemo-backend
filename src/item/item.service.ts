import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto/item-input.dto';
import {
  ItemResponseDto,
  PaginatedItemResponseDto,
} from './dto/item-response.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ItemService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly endpoint: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
  }

  async getAllItems(
    page: number,
    limit: number,
  ): Promise<PaginatedItemResponseDto> {
    const skip = (page - 1) * limit;

    const total = await this.prisma.item.count();

    const items = await this.prisma.item.findMany({
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async getItemById(id: string): Promise<ItemResponseDto> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    return item;
  }

  async createItem(data: CreateItemDto): Promise<ItemResponseDto> {
    const newItem = await this.prisma.item.create({
      data,
    });

    return newItem;
  }

  async updateItem(id: string, data: UpdateItemDto): Promise<ItemResponseDto> {
    // Will throw NotFoundException if item does not exist
    await this.getItemById(id);

    const updatedItem = await this.prisma.item.update({
      where: { id },
      data,
    });

    return updatedItem;
  }

  async deleteItem(id: string): Promise<ItemResponseDto> {
    // Will throw NotFoundException if item does not exist
    const item = await this.getItemById(id);

    if (item.imageUrl) {
      await this.deleteItemImage(item.imageUrl);
    }

    const deletedItem = this.prisma.item.delete({
      where: { id },
    });

    return deletedItem;
  }

  async uploadItemImage(
    itemId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const item = await this.getItemById(itemId);

    if (!image || !image.buffer)
      throw new BadRequestException('Invalid image file');

    if (item.imageUrl) {
      await this.deleteItemImage(item.id);
    }

    const timestamp = Date.now();
    const ext = image.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `img-${timestamp}.${ext}`;
    const key = `items/${item.id}/${filename}`;

    const params: PutObjectCommand['input'] = {
      Bucket: this.bucket,
      Key: key,
      Body: image.buffer,
      ContentType: image.mimetype,
      ACL: 'public-read',
    };

    await this.s3Service.putObject(params);

    let imageUrl: string;

    if (this.endpoint) {
      imageUrl = `${this.endpoint}/${this.bucket}/${key}`;
    } else {
      imageUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }

    await this.prisma.item.update({
      where: { id: item.id },
      data: { imageUrl },
    });

    return imageUrl;
  }

  async deleteItemImage(itemId: string): Promise<void> {
    const item = await this.getItemById(itemId);

    if (!item.imageUrl) return;

    const url = new URL(item.imageUrl);
    let key: string;

    if (this.endpoint) {
      key = url.pathname.replace(new RegExp(`^/${this.bucket}/`), '');
    } else {
      key = url.pathname.substring(1);
    }

    const params: DeleteObjectCommand['input'] = {
      Bucket: this.bucket,
      Key: key,
    };

    await this.s3Service.deleteObject(params);

    await this.prisma.item.update({
      where: { id: item.id },
      data: { imageUrl: null },
    });
  }
}
