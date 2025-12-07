import { ApiProperty } from '@nestjs/swagger';
import { ItemStatus } from '../../generated/prisma/client';

export class ItemResponseDto {
  @ApiProperty({
    description: 'UUID of the item',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the service/product/item',
    example: 'Haircut',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Standard 30-minute haircut with styling',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Price of the item in dollars',
    example: 45.99,
  })
  price: number;

  @ApiProperty({
    description: 'Duration of the service in minutes',
    example: 30,
    nullable: true,
  })
  duration?: number | null;

  @ApiProperty({
    description: 'Category of the item',
    example: 'Hair Services',
  })
  category: string;

  @ApiProperty({
    description: 'Status of the item',
    enum: ItemStatus,
    enumName: 'ItemStatus',
    example: ItemStatus.ACTIVE,
  })
  status: ItemStatus;

  @ApiProperty({
    description: 'URL of the item image',
    example: 'https://example.com/images/haircut.jpg',
    nullable: true,
  })
  imageUrl?: string | null;

  @ApiProperty({
    description: 'Timestamp when the item was created',
    example: '2025-12-07T16:45:23.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the item was last updated',
    example: '2025-12-07T16:45:23.000Z',
  })
  updatedAt: Date;
}

export class PaginatedItemResponseDto {
  @ApiProperty({
    description: 'List of items for the current page',
    type: [ItemResponseDto],
  })
  items: ItemResponseDto[];

  @ApiProperty({
    description: 'Total number of items available',
    example: 1,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 1,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: false,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;
}
