import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  // Publica um evento na galeria pública.
  // Regra de negócio: só pode ser publicado se tiver pelo menos 1 álbum.
  async publish(id: string, userId: string) {
    const event = await this.findOne(id, userId);

    const albumCount = await this.prisma.album.count({
      where: { eventId: event.id },
    });

    if (albumCount === 0) {
      throw new BadRequestException(
        'O evento não pode ser publicado sem pelo menos um álbum',
      );
    }

    // Transição de estado: publicar um evento já publicado é erro.
    if (event.isPublic) {
      throw new BadRequestException('O evento já está publicado');
    }

    return this.prisma.event.update({
      where: { id: event.id },
      data: { isPublic: true },
    });
  }

  // Remove a publicação do evento da galeria pública.
  async unpublish(id: string, userId: string) {
    const event = await this.findOne(id, userId);

    // Transição de estado: despublicar um evento não publicado é erro.
    if (!event.isPublic) {
      throw new BadRequestException('O evento já está não-publicado');
    }

    return this.prisma.event.update({
      where: { id: event.id },
      data: { isPublic: false },
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
