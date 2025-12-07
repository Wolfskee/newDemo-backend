import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  async getAllItems(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.itemService.getAllItems(Number(page), Number(limit));
  }

  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }

  @Post()
  async createItem(@Body() data: CreateItemDto) {
    return this.itemService.createItem(data);
  }

  @Put(':id')
  async updateItem(@Param('id') id: string, @Body() data: UpdateItemDto) {
    return this.itemService.updateItem(id, data);
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    return this.itemService.deleteItem(id);
  }
}
