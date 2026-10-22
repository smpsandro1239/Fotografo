import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

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
            album: {
              count: jest.fn(),
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

      await expect(
        service.create('user1', {
          name: 'Event',
          date: '2024-01-01',
          isPublic: false,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create an event if user is a photographer', async () => {
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
      });
      (prisma.event.create as jest.Mock).mockResolvedValue({
        id: 'event1',
        name: 'Event',
      });

      const result = await service.create('user1', {
        name: 'Event',
        date: '2024-01-01',
        isPublic: false,
      });
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

  describe('publish', () => {
    it('deve publicar o evento quando o dono tem pelo menos um álbum', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographerId: 'photo1',
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });
      // Primeiro mock resolve o evento original (isPublic: false),
      // segundo mock resolve o resultado do update.
      (prisma.event.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'event1',
        photographerId: 'photo1',
        isPublic: false,
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });
      (prisma.album.count as jest.Mock).mockResolvedValue(1);
      (prisma.event.update as jest.Mock).mockResolvedValue({
        id: 'event1',
        isPublic: true,
      });

      const result = await service.publish('event1', 'user1');

      expect(result).toEqual({ id: 'event1', isPublic: true });
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: 'event1' },
        data: { isPublic: true },
      });
    });

    it('deve lançar ForbiddenException se o utilizador não for o dono', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographerId: 'photoOutro',
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });

      await expect(service.publish('event1', 'user1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve lançar BadRequestException se o evento não tiver álbuns', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographerId: 'photo1',
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });
      (prisma.album.count as jest.Mock).mockResolvedValue(0);

      await expect(service.publish('event1', 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se o evento já está publicado', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographerId: 'photo1',
        isPublic: true,
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });
      (prisma.album.count as jest.Mock).mockResolvedValue(1);

      await expect(service.publish('event1', 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('unpublish', () => {
    it('deve despublicar o evento do dono', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographerId: 'photo1',
        isPublic: true,
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });
      (prisma.event.update as jest.Mock).mockResolvedValue({
        id: 'event1',
        isPublic: false,
      });

      const result = await service.unpublish('event1', 'user1');

      expect(result).toEqual({ id: 'event1', isPublic: false });
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: 'event1' },
        data: { isPublic: false },
      });
    });

    it('deve lançar BadRequestException se o evento já está não-publicado', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographerId: 'photo1',
        isPublic: false,
      });
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue({
        id: 'photo1',
        userId: 'user1',
      });

      await expect(service.unpublish('event1', 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
