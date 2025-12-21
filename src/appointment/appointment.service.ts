import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserRole } from '../generated/prisma/client';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointment-input.dto';
import {
  AppointmentResponseDto,
  PaginatedAppointmentResponseDto,
} from './dto/appointment-response.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getAllAppointments(
    page: number,
    limit: number,
  ): Promise<PaginatedAppointmentResponseDto> {
    const skip = (page - 1) * limit;

    const total = await this.prisma.appointment.count();

    const appointments = await this.prisma.appointment.findMany({
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      appointments,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async getAppointmentById(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment)
      throw new NotFoundException(`Appointment with ID ${id} not found`);

    return appointment;
  }

  async getAppointmentsByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedAppointmentResponseDto> {
    const skip = (page - 1) * limit;

    const total = await this.prisma.appointment.count({
      where: {
        OR: [{ customerId: userId }, { employeeId: userId }],
      },
    });

    const appointments = await this.prisma.appointment.findMany({
      skip,
      take: limit,
      where: {
        OR: [{ customerId: userId }, { employeeId: userId }],
      },
      orderBy: { date: 'desc' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      appointments,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async createAppointment(
    data: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    // check if customer exists
    const customer = await this.userService.getUserById(data.customerId);

    if (customer.role != UserRole.CUSTOMER)
      throw new NotFoundException('Customer not found');

    // check if employee exists
    if (data.employeeId) {
      const employee = await this.userService.getUserById(data.employeeId);

      if (employee.role != UserRole.EMPLOYEE)
        throw new NotFoundException('Employee not found');
    }

    const newAppointment = await this.prisma.appointment.create({
      data,
    });
    return newAppointment;
  }

  async updateAppointment(
    id: string,
    data: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    // Will throw NotFoundException if appointment does not exist
    await this.getAppointmentById(id);

    // check if customer exists
    if (data.customerId) {
      const customer = await this.userService.getUserById(data.customerId);

      if (customer.role != UserRole.CUSTOMER)
        throw new NotFoundException('Customer not found');
    }

    // check if employee exists
    if (data.employeeId) {
      const employee = await this.userService.getUserById(data.employeeId);

      if (employee.role != UserRole.EMPLOYEE)
        throw new NotFoundException('Employee not found');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data,
    });

    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<AppointmentResponseDto> {
    // Will throw NotFoundException if appointment does not exist
    await this.getAppointmentById(id);

    const deletedAppointment = await this.prisma.appointment.delete({
      where: { id },
    });

    return deletedAppointment;
  }
}
