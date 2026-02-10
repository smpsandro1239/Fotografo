import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  private async checkEventOwnership(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { photographer: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    if (event.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to manage albums for this event');
    }

    return event;
  }

  async create(userId: string, createAlbumDto: CreateAlbumDto) {
    await this.checkEventOwnership(createAlbumDto.eventId, userId);

    return this.prisma.album.create({
      data: createAlbumDto,
    });
  }

  async findAllByEvent(eventId: string, userId: string) {
    // For now, let's allow the owner to see all, but later we might allow clients too
    // For CRUD purposes, we check ownership if it's a private context
    // Actually, clients should be able to see albums if they have access to the event.
    // But this service is currently focused on the photographer's CRUD.

    await this.checkEventOwnership(eventId, userId);

    return this.prisma.album.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: { event: { include: { photographer: true } } },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    if (album.event.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have access to this album');
    }

    return album;
  }

  async update(id: string, userId: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id, userId);

    return this.prisma.album.update({
      where: { id: album.id },
      data: updateAlbumDto,
    });
  }

  async remove(id: string, userId: string) {
    const album = await this.findOne(id, userId);

    return this.prisma.album.delete({
      where: { id: album.id },
    });
  }
}
