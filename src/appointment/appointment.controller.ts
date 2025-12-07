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
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  async getAllAppointments(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.appointmentService.getAllAppointments(
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Post()
  async createAppointment(@Body() data: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(data);
  }

  @Put(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, data);
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: string) {
    return this.appointmentService.deleteAppointment(id);
  }
}
