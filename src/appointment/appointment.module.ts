import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [AppointmentService, UserService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
