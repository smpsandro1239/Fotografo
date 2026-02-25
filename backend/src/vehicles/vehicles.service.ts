import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  private async checkPackOwnership(packId: string, userId: string) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
      include: { photographer: true },
    });

    if (!pack) {
      throw new NotFoundException(\`Pack with ID \${packId} not found\`);
    }

    if (pack.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to manage vehicles for this pack');
    }

    return pack;
  }

  async create(userId: string, createVehicleDto: CreateVehicleDto) {
    await this.checkPackOwnership(createVehicleDto.packId, userId);

    return this.prisma.vehicle.create({
      data: createVehicleDto,
    });
  }

  async findAllByPack(packId: string) {
    return this.prisma.vehicle.findMany({
      where: { packId },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(\`Vehicle with ID \${id} not found\`);
    }

    return vehicle;
  }

  async update(id: string, userId: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { pack: { include: { photographer: true } } },
    });

    if (!vehicle) {
      throw new NotFoundException(\`Vehicle with ID \${id} not found\`);
    }

    if (vehicle.pack.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this vehicle');
    }

    // If changing packId, check ownership of the new pack
    if (updateVehicleDto.packId && updateVehicleDto.packId !== vehicle.packId) {
      await this.checkPackOwnership(updateVehicleDto.packId, userId);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  async remove(id: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { pack: { include: { photographer: true } } },
    });

    if (!vehicle) {
      throw new NotFoundException(\`Vehicle with ID \${id} not found\`);
    }

    if (vehicle.pack.photographer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this vehicle');
    }

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
