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
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Get availability by date range' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
    example: '2026-01-12',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
    example: '2026-01-20',
  })
  async getAvailability(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : undefined;
    return this.availabilityService.getAvailabilityByDateRange(start, end);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get availability by employee and date range' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the availability to assign',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
    example: '2026-01-12',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
    example: '2026-01-20',
  })
  async getAvailabilityByEmployee(
    @Param('id') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : undefined;
    return this.availabilityService.getAvailabilityByEmployee(
      employeeId,
      start,
      end,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create new availability' })
  async createAvailability(@Body() data: CreateAvailabilityDto) {
    return this.availabilityService.createAvailability(data);
  }

  @Put('assign/:id')
  @ApiParam({
    name: 'id',
    description: 'UUID of the availability to assign',
  })
  @ApiOperation({ summary: 'Assign availability by ID' })
  async assignAvailability(@Param('id') id: string) {
    return this.availabilityService.assignAvailability(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete availability by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the availability to delete',
  })
  async deleteAvailability(@Param('id') id: string) {
    return this.availabilityService.deleteAvailability(id);
  }
}
