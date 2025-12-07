import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '../../generated/prisma/client';

export class CreateAppointmentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string; // ISO format

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  // Relations
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
