import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment-input.dto';
import {
  AppointmentResponseDto,
  PaginatedAppointmentResponseDto,
} from './dto/appointment-response.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments with pagination' })
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
    description: 'Number of appointments per page (default = 10)',
  })
  @ApiOkResponse({
    type: PaginatedAppointmentResponseDto,
    description: 'List of appointments with pagination metadata.',
  })
  async getAllAppointments(
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 10,
  ): Promise<PaginatedAppointmentResponseDto> {
    return this.appointmentService.getAllAppointments(
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single appointment by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the appointment',
    example: 'b123fabc-5678-4bde-9a11-9876543210ab',
  })
  @ApiOkResponse({
    type: AppointmentResponseDto,
    description: 'Successfully retrieved appointment',
  })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  async getAppointmentById(
    @Param('id') id: string,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.getAppointmentById(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get appointments by user',
    description:
      'Get all appointments where the user is either the customer or the employee. Optionally filter by date.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user (customer or employee)',
    example: 'e9a3f4c1-5f72-4a5e-9c9b-123456789abc',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description:
      'Filter to get appointments on or after this date (YYYY-MM-DD)',
    example: '2025-12-20',
  })
  @ApiOkResponse({
    description: 'List of appointments (optionally filtered by date).',
    type: [AppointmentResponseDto],
  })
  async getAppointmentsByUser(
    @Param('userId') userId: string,
    @Query('date') date?: string,
  ): Promise<AppointmentResponseDto[]> {
    const parsedDate = date ? new Date(date) : undefined;
    return this.appointmentService.getAppointmentsByUser(userId, parsedDate);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiCreatedResponse({
    type: AppointmentResponseDto,
    description: 'Appointment successfully created',
  })
  async createAppointment(
    @Body() data: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.createAppointment(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing appointment' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the appointment to update',
    example: 'a456fdef-7890-4c32-abc1-543210fedcba',
  })
  @ApiCreatedResponse({
    type: AppointmentResponseDto,
    description: 'Appointment updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  async updateAppointment(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.updateAppointment(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the appointment to delete',
    example: 'c654fdef-1234-4e98-bc12-111111111111',
  })
  @ApiOkResponse({
    type: AppointmentResponseDto,
    description: 'Appointment deleted successfully',
  })
  async deleteAppointment(
    @Param('id') id: string,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.deleteAppointment(id);
  }
}
