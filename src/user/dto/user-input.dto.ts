import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../generated/prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the user',
    example: 'john doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Unique email address for the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 6 characters)',
    minLength: 6,
    example: 'secret123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    enumName: 'UserRole',
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.CUSTOMER;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Username for the user',
    example: 'john doe',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Unique email address for the user',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User password (min 6 characters)',
    minLength: 6,
    example: 'secret123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+1-555-987-6543',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
