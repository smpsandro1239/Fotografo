import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
    });

    if (!photographer) {
      throw new ForbiddenException('Only photographers can create events');
    }

    return this.prisma.event.create({
      data: {
        ...createEventDto,
        photographerId: photographer.id,
      },
    });
  }

  async findAll(userId: string) {
    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
    });

    if (!photographer) {
      throw new ForbiddenException('Only photographers can view their events');
    }

    return this.prisma.event.findMany({
      where: {
        photographerId: photographer.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
    });

    if (!photographer || event.photographerId !== photographer.id) {
      throw new ForbiddenException('You do not have access to this event');
    }

    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id, userId);

    return this.prisma.event.update({
      where: { id: event.id },
      data: updateEventDto,
    });
  }

  async remove(id: string, userId: string) {
    const event = await this.findOne(id, userId);

    return this.prisma.event.delete({
      where: { id: event.id },
    });
  }

  async findPublic() {
    return this.prisma.event.findMany({
      where: {
        isPublic: true,
      },
      include: {
        photographer: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
