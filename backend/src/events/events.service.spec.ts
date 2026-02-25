import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: {
            photographer: {
              findUnique: jest.fn(),
            },
            event: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ForbiddenException if user is not a photographer', async () => {
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create('user1', { name: 'Event', date: '2024-01-01', isPublic: false }))
        .rejects.toThrow(ForbiddenException);
    });

    it('should create an event if user is a photographer', async () => {
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({ id: 'photo1' });
      (prisma.event.create as jest.Mock).mockResolvedValue({ id: 'event1', name: 'Event' });

      const result = await service.create('user1', { name: 'Event', date: '2024-01-01', isPublic: false });
      expect(result).toEqual({ id: 'event1', name: 'Event' });
      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          name: 'Event',
          date: '2024-01-01',
          isPublic: false,
          photographerId: 'photo1',
        },
      });
    });
  });
});
