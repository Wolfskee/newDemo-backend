import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from './dto/availability.dto';
import { EmployeeAvailabilityStatus } from 'src/generated/prisma/enums';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailabilityByDate(date: Date) {
    return this.prisma.employeeAvailability.findMany({
      where: {
        date,
      },
    });
  }

  async getAvailabilityByEmployee(employeeId: string, date: Date) {
    return this.prisma.employeeAvailability.findFirst({
      where: {
        employeeId,
        date,
      },
    });
  }

  async createAvailability(data: CreateAvailabilityDto) {
    const employee = await this.prisma.user.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee || employee.role !== 'EMPLOYEE') {
      throw new NotFoundException('Employee not found');
    }

    try {
      return await this.prisma.employeeAvailability.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Availability for this employee and date already exists',
        );
      }
      throw error;
    }
  }

  async updateAvailability(id: string, data: UpdateAvailabilityDto) {
    const availability = await this.prisma.employeeAvailability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Employee Availability not found');
    }

    try {
      const updatedAvailability = await this.prisma.employeeAvailability.update(
        {
          where: { id },
          data,
        },
      );

      return updatedAvailability;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Availability for this employee and date already exists',
        );
      }
      throw error;
    }
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
