import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from './albums.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AlbumsService', () => {
  let service: AlbumsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: PrismaService,
          useValue: {
            event: {
              findUnique: jest.fn(),
            },
            album: {
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

    service = module.get<AlbumsService>(AlbumsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ForbiddenException if user is not the photographer of the event', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographer: { userId: 'other-user' },
      });

      await expect(
        service.create('user1', { name: 'Album 1', eventId: 'event1' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create an album if user is the photographer', async () => {
      (prisma.event.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        photographer: { userId: 'user1' },
      });
      (prisma.album.create as jest.Mock).mockResolvedValue({ id: 'album1', name: 'Album 1' });

      const result = await service.create('user1', { name: 'Album 1', eventId: 'event1' });
      expect(result).toEqual({ id: 'album1', name: 'Album 1' });
    });
  });
});
