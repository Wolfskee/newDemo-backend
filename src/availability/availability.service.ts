import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/availability.dto';
import { EmployeeAvailabilityStatus } from 'src/generated/prisma/enums';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailabilityByDateRange(startDate: Date, endDate?: Date) {
    const whereClause: any = {
      date: {
        gte: startDate,
      },
    };

    if (endDate) {
      whereClause.date.lte = endDate;
    }

    return this.prisma.employeeAvailability.findMany({
      where: whereClause,
    });
  }

  async getAvailabilityByEmployee(
    employeeId: string,
    startDate: Date,
    endDate?: Date,
  ) {
    const whereClause: any = {
      employeeId,
      date: {
        gte: startDate,
      },
    };

    if (endDate) {
      whereClause.date.lte = endDate;
    }

    return this.prisma.employeeAvailability.findMany({
      where: whereClause,
    });
  }

  async createAvailability(data: CreateAvailabilityDto) {
    const employee = await this.prisma.user.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee || employee.role !== 'EMPLOYEE') {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.employeeAvailability.create({
      data,
    });
  }

  async assignAvailability(id: string) {
    const availability = await this.prisma.employeeAvailability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Employee Availability not found');
    }

    return this.prisma.employeeAvailability.update({
      where: { id },
      data: {
        status: EmployeeAvailabilityStatus.ASSIGNED,
      },
    });
  }

  async deleteAvailability(id: string) {
    const availability = await this.prisma.employeeAvailability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Employee Availability not found');
    }

    return this.prisma.employeeAvailability.delete({
      where: { id },
    });
  }
}
