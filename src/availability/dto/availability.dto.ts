import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { EmployeeAvailabilityStatus } from '../../generated/prisma/client';

export class CreateAvailabilityDto {
  @ApiProperty({
    description:
      'Date of the availability slot (date part is used with employeeId uniqueness)',
    example: '2026-01-07T00:00:00.000Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Start time of the availability (ISO 8601 date-time)',
    example: '2026-01-07T09:00:00.000Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the availability (ISO 8601 date-time)',
    example: '2026-01-07T10:00:00.000Z',
  })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    description: 'Status of the availability slot',
    enum: EmployeeAvailabilityStatus,
    enumName: 'EmployeeAvailabilityStatus',
    default: EmployeeAvailabilityStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(EmployeeAvailabilityStatus)
  status: EmployeeAvailabilityStatus = EmployeeAvailabilityStatus.OPEN;

  @ApiProperty({
    description:
      'ID of the employee (User.id) for whom this availability is defined',
    example: 'c6c3c5a4-8f57-4b52-9c9d-2b9df5b3f123',
  })
  @IsString()
  employeeId: string;
}

export class UpdateAvailabilityDto {
  @ApiPropertyOptional({
    description:
      'Date of the availability slot (date part is used with employeeId uniqueness)',
    example: '2026-01-07T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Start time of the availability (ISO 8601 date-time)',
    example: '2026-01-07T09:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time of the availability (ISO 8601 date-time)',
    example: '2026-01-07T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Status of the availability slot',
    enum: EmployeeAvailabilityStatus,
    enumName: 'EmployeeAvailabilityStatus',
  })
  @IsOptional()
  @IsEnum(EmployeeAvailabilityStatus)
  status?: EmployeeAvailabilityStatus;

  @ApiPropertyOptional({
    description:
      'ID of the employee (User.id) for whom this availability is defined',
    example: 'c6c3c5a4-8f57-4b52-9c9d-2b9df5b3f123',
  })
  @IsOptional()
  @IsString()
  employeeId?: string;
}
