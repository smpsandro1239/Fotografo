import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';

@Injectable()
export class PhotographersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPhotographerDto: CreatePhotographerDto) {
    const existing = await this.prisma.photographer.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('User is already a photographer');
    }

    // Also update user role to PHOTOGRAPHER
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'PHOTOGRAPHER' },
    });

    return this.prisma.photographer.create({
      data: {
        ...createPhotographerDto,
        userId,
      },
    });
  }

  async findMe(userId: string) {
    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!photographer) {
      throw new NotFoundException('Photographer profile not found');
    }

    return photographer;
  }

  async findOne(id: string) {
    const photographer = await this.prisma.photographer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!photographer) {
      throw new NotFoundException('Photographer not found');
    }

    return photographer;
  }

  async update(userId: string, updatePhotographerDto: UpdatePhotographerDto) {
    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
    });

    if (!photographer) {
      throw new NotFoundException('Photographer profile not found');
    }

    return this.prisma.photographer.update({
      where: { userId },
      data: updatePhotographerDto,
    });
  }
}
