import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Username for the user',
    example: 'john doe',
  })
  username: string;

  @ApiProperty({
    description: 'Unique email address for the user',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1-555-123-4567',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2025-12-07T16:45:23.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2025-12-07T16:45:23.000Z',
  })
  updatedAt: Date;
}

export class PaginatedUserResponseDto {
  @ApiProperty({
    description: 'List of users for the current page',
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiProperty({ description: 'Total number of users', example: 1 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 1 })
  totalPages: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Whether there is a next page', example: false })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;
}
