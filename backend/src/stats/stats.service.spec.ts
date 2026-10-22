import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StatsService } from './stats.service';
import { PrismaService } from '../prisma/prisma.service';
import { StatType } from '@prisma/client';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      photo: { findUnique: jest.fn(), count: jest.fn() },
      stat: { create: jest.fn(), groupBy: jest.fn() },
      photographer: { findUnique: jest.fn() },
      event: { count: jest.fn() },
      reservation: { groupBy: jest.fn() },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(StatsService);
  });

  it('registra VIEW em foto existente', async () => {
    prisma.photo.findUnique.mockResolvedValue({ id: 'f1' });
    prisma.stat.create.mockResolvedValue({ id: 's1', type: 'VIEW' });
    const res = await service.recordStat('f1', StatType.VIEW);
    expect(res.type).toBe('VIEW');
  });

  it('lança NotFound para foto inexistente', async () => {
    prisma.photo.findUnique.mockResolvedValue(null);
    await expect(service.recordStat('x', StatType.VIEW)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('agregados de photographer filtram por fotógrafo', async () => {
    prisma.photographer.findUnique.mockResolvedValue({ id: 'ph1' });
    prisma.stat.groupBy.mockResolvedValue([
      { type: 'VIEW', _count: { id: 3 } },
    ]);
    prisma.photo.count.mockResolvedValue(10);
    prisma.event.count.mockResolvedValue(2);
    prisma.reservation.groupBy.mockResolvedValue([
      { status: 'CONFIRMED', _count: { id: 1 } },
    ]);
    const res = await service.getAggregates('u1', 'PHOTOGRAPHER');
    expect(res.statsByType).toEqual([{ type: 'VIEW', count: 3 }]);
    expect(res.totalPhotos).toBe(10);
  });
});
