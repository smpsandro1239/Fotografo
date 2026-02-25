import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  private async checkAlbumOwnership(albumId: string, userId: string) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: {
        event: {
          include: {
            photographer: true,
          },
        },
      },
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

    if (album.event.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to manage photos in this album');
    }

    return album;
  }

  async create(userId: string, createPhotoDto: CreatePhotoDto) {
    await this.checkAlbumOwnership(createPhotoDto.albumId, userId);

    return this.prisma.photo.create({
      data: createPhotoDto,
    });
  }

  async findAllByAlbum(albumId: string) {
    return this.prisma.photo.findMany({
      where: { albumId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async remove(id: string, userId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        album: {
          include: {
            event: {
              include: {
                photographer: true,
              },
            },
          },
        },
      },
    });

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    if (photo.album.event.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this photo');
    }

    return this.prisma.photo.delete({
      where: { id },
    });
  }
}
