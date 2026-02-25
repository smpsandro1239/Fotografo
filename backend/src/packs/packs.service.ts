import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';

@Injectable()
export class PacksService {
  constructor(private prisma: PrismaService) {}

  private async getPhotographer(userId: string) {
    const photographer = await this.prisma.photographer.findUnique({
      where: { userId },
    });
    if (!photographer) {
      throw new ForbiddenException('Only photographers can manage packs');
    }
    return photographer;
  }

  async create(userId: string, createPackDto: CreatePackDto) {
    const photographer = await this.getPhotographer(userId);

    return this.prisma.pack.create({
      data: {
        ...createPackDto,
        photographerId: photographer.id,
      },
    });
  }

  async findAll(photographerId?: string) {
    return this.prisma.pack.findMany({
      where: photographerId ? { photographerId } : {},
      include: { vehicles: true },
    });
  }

  async findOne(id: string) {
    const pack = await this.prisma.pack.findUnique({
      where: { id },
      include: { vehicles: true },
    });

    if (!pack) {
      throw new NotFoundException(\`Pack with ID \${id} not found\`);
    }

    return pack;
  }

  async update(id: string, userId: string, updatePackDto: UpdatePackDto) {
    const photographer = await this.getPhotographer(userId);
    const pack = await this.findOne(id);

    if (pack.photographerId !== photographer.id) {
      throw new ForbiddenException('You do not have permission to update this pack');
    }

    return this.prisma.pack.update({
      where: { id },
      data: updatePackDto,
    });
  }

  async remove(id: string, userId: string) {
    const photographer = await this.getPhotographer(userId);
    const pack = await this.findOne(id);

    if (pack.photographerId !== photographer.id) {
      throw new ForbiddenException('You do not have permission to delete this pack');
    }

    return this.prisma.pack.delete({
      where: { id },
    });
  }
}
