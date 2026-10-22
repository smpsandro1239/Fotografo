import { Injectable, NotFoundException } from '@nestjs/common';
import { StatType, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // Regista um evento de estatística numa foto (VIEW/FAVORITE/DOWNLOAD/SHARE)
  async recordStat(photoId: string, type: StatType) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });
    if (!photo) {
      throw new NotFoundException(`Foto com ID ${photoId} não encontrada`);
    }
    return this.prisma.stat.create({ data: { photoId, type } });
  }

  // Estatísticas agregadas — PHOTOGRAPHER vê as suas, ADMIN vê tudo
  async getAggregates(userId: string, role: string) {
    const photographer =
      role === UserRole.PHOTOGRAPHER || role === UserRole.ADMIN
        ? await this.prisma.photographer.findUnique({ where: { userId } })
        : null;

    const photoWhere =
      role === UserRole.ADMIN
        ? {}
        : photographer
          ? { album: { event: { photographerId: photographer.id } } }
          : { id: '__none__' };

    const [byType, totalPhotos, eventsCount, reservationsByStatus] =
      await Promise.all([
        this.prisma.stat.groupBy({
          by: ['type'],
          _count: { id: true },
          where: { photo: photoWhere },
        }),
        this.prisma.photo.count({ where: photoWhere }),
        this.prisma.event.count({
          where:
            role === UserRole.ADMIN
              ? {}
              : photographer
                ? { photographerId: photographer.id }
                : { id: '__none__' },
        }),
        this.prisma.reservation.groupBy({
          by: ['status'],
          _count: { id: true },
          where:
            role === UserRole.ADMIN
              ? {}
              : photographer
                ? { event: { photographerId: photographer.id } }
                : { userId },
        }),
      ]);

    return {
      statsByType: byType.map((b) => ({ type: b.type, count: b._count.id })),
      totalPhotos,
      eventsCount,
      reservationsByStatus: reservationsByStatus.map((r) => ({
        status: r.status,
        count: r._count.id,
      })),
    };
  }

  // Estatísticas de uma foto específica
  async getPhotoStats(photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });
    if (!photo) {
      throw new NotFoundException(`Foto com ID ${photoId} não encontrada`);
    }
    const grouped = await this.prisma.stat.groupBy({
      by: ['type'],
      _count: { id: true },
      where: { photoId },
    });
    return {
      photoId,
      stats: grouped.map((g) => ({ type: g.type, count: g._count.id })),
    };
  }
}
