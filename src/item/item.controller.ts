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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto/item-input.dto';
import {
  ItemResponseDto,
  PaginatedItemResponseDto,
} from './dto/item-response.dto';
import { Public } from 'src/common/decorators';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number to retrieve (default = 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
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
    example: 'b123fabc-5678-4bde-9a11-9876543210ab',
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
    example: 'a456fdef-7890-4c32-abc1-543210fedcba',
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
    example: 'c654fdef-1234-4e98-bc12-111111111111',
  })
  @ApiCreatedResponse({
    type: ItemResponseDto,
    description: 'Item deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async deleteItem(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.itemService.deleteItem(id);
  }
}
