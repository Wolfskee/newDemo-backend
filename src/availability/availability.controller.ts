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
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from './dto/availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Get availability by date' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'date (YYYY-MM-DD)',
  })
  async getAvailability(@Query('date') date: string) {
    return this.availabilityService.getAvailabilityByDate(new Date(date));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get availability by employee and date' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the availability to assign',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'date (YYYY-MM-DD)',
  })
  async getAvailabilityByEmployee(
    @Param('id') employeeId: string,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityByEmployee(
      employeeId,
      new Date(date),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create new availability' })
  async createAvailability(@Body() data: CreateAvailabilityDto) {
    return this.availabilityService.createAvailability(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing availability' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the availability to update',
  })
  async updateAvailability(
    @Param('id') id: string,
    @Body() data: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.updateAvailability(id, data);
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
