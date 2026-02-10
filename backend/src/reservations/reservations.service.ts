import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: createReservationDto.eventId },
    });

    if (!event) {
      throw new NotFoundException(\`Event with ID \${createReservationDto.eventId} not found\`);
    }

    return this.prisma.reservation.create({
      data: {
        userId,
        eventId: createReservationDto.eventId,
        status: 'PENDING',
      },
    });
  }

  async findAll(userId: string, role: string) {
    if (role === 'PHOTOGRAPHER') {
      const photographer = await this.prisma.photographer.findUnique({
        where: { userId },
      });
      if (!photographer) throw new ForbiddenException();

      return this.prisma.reservation.findMany({
        where: {
          event: {
            photographerId: photographer.id,
          },
        },
        include: {
          user: { select: { name: true, email: true } },
          event: true,
        },
      });
    }

    return this.prisma.reservation.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            photographer: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        event: { include: { photographer: true } },
      },
    });

    if (!reservation) {
      throw new NotFoundException(\`Reservation with ID \${id} not found\`);
    }

    if (reservation.userId !== userId && reservation.event.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have access to this reservation');
    }

    return reservation;
  }

  async updateStatus(id: string, userId: string, updateDto: UpdateReservationStatusDto) {
    const reservation = await this.findOne(id, userId);

    // Only photographer can change status to CONFIRMED
    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
    });

    if (!photographer || reservation.event.photographerId !== photographer.id) {
      throw new ForbiddenException('Only the event photographer can update the reservation status');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: updateDto.status },
    });
  }

  async cancel(id: string, userId: string) {
    const reservation = await this.findOne(id, userId);

    if (reservation.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
