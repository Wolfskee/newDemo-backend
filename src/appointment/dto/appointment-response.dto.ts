import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../generated/prisma/client';

export class AppointmentResponseDto {
  @ApiProperty({
    description: 'UUID of the appointment',
    example: '8f14e45f-ea5e-4c2a-b1c1-9d7a3e7c88f2',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the appointment',
    example: 'Title of the appointment',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the appointment',
    example: 'Optional description of the appointment',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Appointment date and time in ISO format',
    example: '2025-12-10T14:30:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ApiProperty({
    description: 'UUID of the customer user',
    example: 'b3d9a994-64c2-4a2e-8bf7-abc123def456',
  })
  customerId: string;

  @ApiProperty({
    description: 'UUID of the employee user',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-123456789abc',
    nullable: true,
  })
  employeeId: string | null;

  @ApiProperty({
    description: 'Timestamp when the appointment was created',
    example: '2025-12-07T16:45:23.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the appointment was last updated',
    example: '2025-12-07T16:45:23.000Z',
  })
  updatedAt: Date;
}

export class PaginatedAppointmentResponseDto {
  @ApiProperty({
    description: 'List of appointments for the current page',
    type: [AppointmentResponseDto],
  })
  appointments: AppointmentResponseDto[];

  @ApiProperty({ description: 'Total number of appointments', example: 1 })
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
