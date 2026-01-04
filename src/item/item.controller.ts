import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto/item-input.dto';
import {
  ItemResponseDto,
  PaginatedItemResponseDto,
} from './dto/item-response.dto';
import { Public } from 'src/common/decorators';
import { multerImageOptions } from 'src/common/config/multer-image.config';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number to retrieve (default = 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default = 10)',
  })
  @ApiOkResponse({
    type: PaginatedItemResponseDto,
    description: 'List of items with pagination metadata.',
  })
  async getAllItems(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedItemResponseDto> {
    return this.itemService.getAllItems(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single item by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the item',
  })
  @ApiOkResponse({
    type: ItemResponseDto,
    description: 'Successfully retrieved item',
  })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async getItemById(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.itemService.getItemById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiCreatedResponse({
    type: ItemResponseDto,
    description: 'Item successfully created',
  })
  async createItem(@Body() data: CreateItemDto): Promise<ItemResponseDto> {
    return this.itemService.createItem(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the item to update',
  })
  @ApiCreatedResponse({
    type: ItemResponseDto,
    description: 'Item updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async updateItem(
    @Param('id') id: string,
    @Body() data: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    return this.itemService.updateItem(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the item to delete',
  })
  @ApiCreatedResponse({
    type: ItemResponseDto,
    description: 'Item deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async deleteItem(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.itemService.deleteItem(id);
  }

  @Public()
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', multerImageOptions))
  @ApiOperation({ summary: 'Upload/replace image for specific item' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  async uploadItemImage(
    @Param('id') itemId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.itemService.uploadItemImage(itemId, image);
    return { url };
  }

  @Public()
  @Delete(':id/image')
  @ApiOperation({ summary: 'Delete image for specific item' })
  @ApiParam({ name: 'id', description: 'Item UUID' })
  async deleteItemImage(
    @Param('id') itemId: string,
  ): Promise<{ message: string }> {
    await this.itemService.deleteItemImage(itemId);
    return { message: 'Image deleted successfully' };
  }
}
