import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { StatsService } from '../../src/stats/stats.service';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = {
  event: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  photo: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  stat: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  reservation: {
    count: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn(),
  },
  payment: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
  },
  photographer: {
    findUnique: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
};

describe('StatsService', () => {
  let service: StatsService;
  let prismaService: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    prismaService = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('getPhotographerStats', () => {
    const photographerId = 'photographer-1';

    it('should return comprehensive photographer stats', async () => {
      prismaService.event.count.mockResolvedValue(10);
      prismaService.photo.count.mockResolvedValue(500);
      prismaService.stat.count.mockResolvedValueOnce(10000).mockResolvedValueOnce(500); // views, favorites
      prismaService.reservation.count.mockResolvedValueOnce(20).mockResolvedValueOnce(15); // total, confirmed
      prismaService.payment.aggregate.mockResolvedValue({ _sum: { amount: 150000 } });
      prismaService.event.findMany.mockResolvedValue([{ id: 'e1', name: 'Wedding', _count: { albums: 5, reservations: 3 } }]);
      prismaService.photo.findMany.mockResolvedValue([
        { id: 'p1', url: 'url1', thumbnail: 'thumb1', album: { event: { name: 'Wedding' } }, _count: { stats: 100 }, stats: [{ type: 'view' }, { type: 'favorite' }] },
      ]);

      const result = await service.getPhotographerStats(photographerId, 'month');

      expect(result.period).toBe('month');
      expect(result.summary.totalEvents).toBe(10);
      expect(result.summary.totalPhotos).toBe(500);
      expect(result.summary.totalViews).toBe(10000);
      expect(result.summary.totalFavorites).toBe(500);
      expect(result.summary.totalReservations).toBe(20);
      expect(result.summary.confirmedReservations).toBe(15);
      expect(result.summary.conversionRate).toBe('75.0');
      expect(result.summary.totalRevenue).toBe(150000);
      expect(result.recentEvents).toHaveLength(1);
      expect(result.topPhotos).toHaveLength(1);
    });

    it('should calculate different periods correctly', async () => {
      prismaService.event.count.mockResolvedValue(5);
      prismaService.photo.count.mockResolvedValue(100);
      prismaService.stat.count.mockResolvedValue(1000).mockResolvedValue(100);
      prismaService.reservation.count.mockResolvedValue(5).mockResolvedValue(3);
      prismaService.payment.aggregate.mockResolvedValue({ _sum: { amount: 50000 } });
      prismaService.event.findMany.mockResolvedValue([]);
      prismaService.photo.findMany.mockResolvedValue([]);

      const weekResult = await service.getPhotographerStats(photographerId, 'week');
      expect(weekResult.period).toBe('week');

      const yearResult = await service.getPhotographerStats(photographerId, 'year');
      expect(yearResult.period).toBe('year');
    });
  });

  describe('getEventStats', () => {
    const eventId = 'event-123';

    it('should return event statistics', async () => {
      prismaService.event.findUnique.mockResolvedValue({
        id: eventId,
        name: 'Wedding',
        date: new Date(),
        isPublic: true,
        albums: [{ id: 'a1', _count: { photos: 50 } }],
        reservations: [{ id: 'r1', user: { name: 'John', email: 'john@test.com' } }],
      });
      prismaService.photo.count.mockResolvedValue(100);
      prismaService.stat.count.mockResolvedValueOnce(2000).mockResolvedValueOnce(150);
      prismaService.reservation.groupBy.mockResolvedValue([
        { status: 'CONFIRMED', _count: { status: 10 } },
        { status: 'PENDING', _count: { status: 5 } },
      ]);

      const result = await service.getEventStats(eventId);

      expect(result.event.id).toBe(eventId);
      expect(result.stats.totalPhotos).toBe(100);
      expect(result.stats.totalViews).toBe(2000);
      expect(result.stats.totalFavorites).toBe(150);
      expect(result.stats.reservations).toEqual({ CONFIRMED: 10, PENDING: 5 });
      expect(result.albums).toHaveLength(1);
      expect(result.reservations).toHaveLength(1);
    });

    it('should return null if event not found', async () => {
      prismaService.event.findUnique.mockResolvedValue(null);

      const result = await service.getEventStats(eventId);

      expect(result).toBeNull();
    });
  });

  describe('getPhotoStats', () => {
    const photoId = 'photo-123';

    it('should return photo statistics', async () => {
      prismaService.photo.findUnique.mockResolvedValue({
        id: photoId,
        url: 'url1',
        thumbnail: 'thumb1',
        createdAt: new Date(),
        _count: { stats: 150 },
      });
      prismaService.stat.count.mockResolvedValueOnce(100).mockResolvedValueOnce(30).mockResolvedValueOnce(20);

      const result = await service.getPhotoStats(photoId);

      expect(result.photo.id).toBe(photoId);
      expect(result.stats.views).toBe(100);
      expect(result.stats.favorites).toBe(30);
      expect(result.stats.downloads).toBe(20);
      expect(result.stats.totalInteractions).toBe(150);
    });
  });

  describe('recordStat', () => {
    it('should record a stat event', async () => {
      prismaService.stat.create.mockResolvedValue({ id: 'stat-1', photoId: 'photo-1', type: 'view', createdAt: new Date() });

      const result = await service.recordStat('photo-1', 'view');

      expect(prismaService.stat.create).toHaveBeenCalledWith({ data: { photoId: 'photo-1', type: 'view' } });
      expect(result).toBeDefined();
    });
  });

  describe('getClientStats', () => {
    const userId = 'user-123';

    it('should return client statistics', async () => {
      prismaService.reservation.count.mockResolvedValue(5);
      prismaService.order.count.mockResolvedValue(3);
      prismaService.stat.count.mockResolvedValue(25);
      prismaService.payment.aggregate.mockResolvedValue({ _sum: { amount: 75000 } });

      const result = await service.getClientStats(userId);

      expect(result.totalReservations).toBe(5);
      expect(result.totalOrders).toBe(3);
      expect(result.totalFavorites).toBe(25);
      expect(result.totalSpent).toBe(75000);
    });
  });
});