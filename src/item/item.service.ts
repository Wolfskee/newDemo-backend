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

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
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

    const itemsWithUrls = await Promise.all(
      items.map(async (item) => {
        const { imageKey, ...rest } = item;
        if (imageKey) {
          rest['imageUrl'] = await this.s3Service.getPresignedGetUrl({
            Bucket: this.bucket,
            Key: imageKey,
          });
        }
        return rest;
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items: itemsWithUrls,
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

    const { imageKey, ...itemWithoutImageKey } = item;

    if (imageKey) {
      const imageUrl = await this.s3Service.getPresignedGetUrl({
        Bucket: this.bucket,
        Key: imageKey,
      });
      itemWithoutImageKey['imageUrl'] = imageUrl;
    }

    return itemWithoutImageKey;
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
    const item = await this.getItemByIdWithImageKey(id);

    if (item.imageKey) {
      await this.deleteItemImage(item.id);
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
    const item = await this.getItemByIdWithImageKey(itemId);

    if (!image || !image.buffer)
      throw new BadRequestException('Invalid image file');

    // delete old image if exists
    if (item.imageKey) {
      await this.deleteItemImage(item.id);
    }

    const timestamp = Date.now();
    const ext = image.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `img-${timestamp}.${ext}`;
    const key = `items/${item.id}/${filename}`;

    // upload file to S3
    await this.s3Service.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: image.buffer,
      ContentType: image.mimetype,
    });

    // store only the key in DB
    await this.prisma.item.update({
      where: { id: item.id },
      data: { imageKey: key },
    });

    // generate presigned GET URL for frontend to use
    const imageUrl = await this.s3Service.getPresignedGetUrl({
      Bucket: this.bucket,
      Key: key,
    });

    return imageUrl;
  }

  async deleteItemImage(itemId: string): Promise<void> {
    const item = await this.getItemByIdWithImageKey(itemId);

    if (!item.imageKey) return;

    await this.s3Service.deleteObject({
      Bucket: this.bucket,
      Key: item.imageKey,
    });

    await this.prisma.item.update({
      where: { id: item.id },
      data: { imageKey: null },
    });
  }

  async getItemByIdWithImageKey(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    return item;
  }
}
