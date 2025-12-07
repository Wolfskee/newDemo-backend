import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsInt, IsEnum } from 'class-validator';
import { ItemStatus } from '../../generated/prisma/client';

export class CreateItemDto {
  @ApiProperty({
    description: 'Name of the service/product/item',
    example: 'Haircut',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the item',
    example: 'Standard 30-minute haircut with styling',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the item in dollars',
    example: 45.99,
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    description: 'Duration of the service in minutes',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({
    description: 'Category of the item',
    example: 'Hair Services',
  })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    description: 'Status of the item',
    enum: ItemStatus,
    enumName: 'ItemStatus',
    default: ItemStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus;

  @ApiPropertyOptional({
    description: 'URL of the item image',
    example: 'https://example.com/images/haircut.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateItemDto {
  @ApiPropertyOptional({
    description: 'Name of the service/product/item',
    example: 'Premium Haircut',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the item',
    example: 'Premium haircut with hot towel treatment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the item in dollars',
    example: 65.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Duration of service in minutes',
    example: 45,
  })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Category of the item',
    example: 'Premium Hair Services',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Status of the item',
    enum: ItemStatus,
    enumName: 'ItemStatus',
  })
  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus;

  @ApiPropertyOptional({
    description: 'URL of the item image',
    example: 'https://example.com/images/premium-haircut.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
