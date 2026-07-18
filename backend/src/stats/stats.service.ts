import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getPhotographerStats(photographerId: string, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    const [
      totalEvents,
      totalPhotos,
      totalViews,
      totalFavorites,
      totalReservations,
      confirmedReservations,
      totalRevenue,
      recentEvents,
      topPhotos,
    ] = await Promise.all([
      this.prisma.event.count({
        where: { photographerId, createdAt: { gte: startDate } },
      }),
      this.prisma.photo.count({
        where: { album: { event: { photographerId } }, createdAt: { gte: startDate } },
      }),
      this.prisma.stat.count({
        where: { photo: { album: { event: { photographerId } } }, type: 'view', createdAt: { gte: startDate } },
      }),
      this.prisma.stat.count({
        where: { photo: { album: { event: { photographerId } } }, type: 'favorite', createdAt: { gte: startDate } },
      }),
      this.prisma.reservation.count({
        where: { event: { photographerId }, createdAt: { gte: startDate } },
      }),
      this.prisma.reservation.count({
        where: { event: { photographerId }, status: 'CONFIRMED', createdAt: { gte: startDate } },
      }),
      this.prisma.payment.aggregate({
        where: { reservation: { event: { photographerId } }, status: 'SUCCEEDED', createdAt: { gte: startDate } },
        _sum: { amount: true },
      }),
      this.prisma.event.findMany({
        where: { photographerId, createdAt: { gte: startDate } },
        include: { _count: { select: { albums: true, reservations: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.getTopPhotos(photographerId, startDate),
    ]);

    return {
      period,
      summary: {
        totalEvents,
        totalPhotos,
        totalViews,
        totalFavorites,
        totalReservations,
        confirmedReservations,
        conversionRate: totalReservations > 0 ? (confirmedReservations / totalReservations * 100).toFixed(1) : 0,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentEvents,
      topPhotos,
    };
  }

  async getEventStats(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        albums: { include: { _count: { select: { photos: true } } } },
        reservations: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    if (!event) return null;

    const [totalPhotos, totalViews, totalFavorites, reservationsByStatus] = await Promise.all([
      this.prisma.photo.count({ where: { album: { eventId } } }),
      this.prisma.stat.count({ where: { photo: { album: { eventId } }, type: 'view' } }),
      this.prisma.stat.count({ where: { photo: { album: { eventId } }, type: 'favorite' } }),
      this.prisma.reservation.groupBy({
        by: ['status'],
        where: { eventId },
        _count: { status: true },
      }),
    ]);

    return {
      event: { id: event.id, name: event.name, date: event.date, isPublic: event.isPublic },
      stats: {
        totalPhotos,
        totalViews,
        totalFavorites,
        avgViewsPerPhoto: totalPhotos > 0 ? (totalViews / totalPhotos).toFixed(1) : 0,
        reservations: reservationsByStatus.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {}),
      },
      albums: event.albums,
      reservations: event.reservations,
    };
  }

  async getPhotoStats(photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
      include: { _count: { select: { stats: true } } },
    });

    if (!photo) return null;

    const [views, favorites, downloads] = await Promise.all([
      this.prisma.stat.count({ where: { photoId, type: 'view' } }),
      this.prisma.stat.count({ where: { photoId, type: 'favorite' } }),
      this.prisma.stat.count({ where: { photoId, type: 'download' } }),
    ]);

    return {
      photo: { id: photo.id, url: photo.url, createdAt: photo.createdAt },
      stats: { views, favorites, downloads, totalInteractions: views + favorites + downloads },
    };
  }

  async recordStat(photoId: string, type: 'view' | 'favorite' | 'download' | 'share') {
    return this.prisma.stat.create({
      data: { photoId, type },
    });
  }

  async getClientStats(userId: string) {
    const [reservations, orders, favorites, totalSpent] = await Promise.all([
      this.prisma.reservation.count({ where: { userId } }),
      this.prisma.order.count({ where: { userId } }),
      this.prisma.stat.count({ where: { photo: { album: { event: { reservations: { some: { userId } } } } }, type: 'favorite' } }),
      this.prisma.payment.aggregate({
        where: { OR: [{ reservation: { userId } }, { order: { userId } }], status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalReservations: reservations,
      totalOrders: orders,
      totalFavorites,
      totalSpent: totalSpent._sum.amount || 0,
    };
  }

  private async getTopPhotos(photographerId: string, startDate: Date, limit = 10) {
    return this.prisma.photo.findMany({
      where: { album: { event: { photographerId } }, createdAt: { gte: startDate } },
      include: {
        _count: { select: { stats: true } },
        album: { include: { event: { select: { name: true } } } },
        stats: { where: { type: { in: ['view', 'favorite'] } } },
      },
      orderBy: { stats: { _count: 'desc' } },
      take: limit,
    }).then(photos => photos.map(p => ({
      id: p.id,
      url: p.url,
      thumbnail: p.thumbnail,
      eventName: p.album.event.name,
      views: p.stats.filter(s => s.type === 'view').length,
      favorites: p.stats.filter(s => s.type === 'favorite').length,
      totalInteractions: p._count.stats,
    })));
  }
}