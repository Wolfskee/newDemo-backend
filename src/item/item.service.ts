import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async getAllItems(page: number, limit: number) {
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

  async getItemById(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    return item;
  }

  async createItem(data: CreateItemDto) {
    const newItem = await this.prisma.item.create({
      data,
    });

    return newItem;
  }

  async updateItem(id: string, data: UpdateItemDto) {
    // Will throw NotFoundException if item does not exist
    await this.getItemById(id);

    const updatedItem = await this.prisma.item.update({
      where: { id },
      data,
    });

    return updatedItem;
  }

  async deleteItem(id: string) {
    // Will throw NotFoundException if item does not exist
    await this.getItemById(id);

    const deletedItem = this.prisma.item.delete({
      where: { id },
    });

    return deletedItem;
  }
}
