import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '../../generated/prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Title of the appointment',
    example: 'Title of the appointment',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Optional description of the appointment',
    example: 'Optional description of the appointment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Appointment date and time in ISO format',
    example: '2025-12-10T14:30:00Z',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    enumName: 'AppointmentStatus',
    default: AppointmentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  // Relations
  @ApiProperty({
    description: 'UUID of the customer user',
    example: 'b3d9a994-64c2-4a2e-8bf7-abc123def456',
  })
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({
    description: 'UUID of the employee user (optional)',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  employeeId?: string;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    description: 'Title of the appointment',
    example: 'Title of the appointment',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Optional description of the appointment',
    example: 'Optional description of the appointment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Appointment date and time in ISO format',
    example: '2025-12-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    enumName: 'AppointmentStatus',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'UUID of the customer user',
    example: 'b3d9a994-64c2-4a2e-8bf7-abc123def456',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'UUID of the employee user',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
