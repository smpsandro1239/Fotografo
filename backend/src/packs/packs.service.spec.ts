import { Test, TestingModule } from '@nestjs/testing';
import { PacksService } from './packs.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('PacksService', () => {
  let service: PacksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacksService,
        {
          provide: PrismaService,
          useValue: {
            photographer: {
              findUnique: jest.fn(),
            },
            pack: {
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

    service = module.get<PacksService>(PacksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ForbiddenException if user is not a photographer', async () => {
      (prisma.photographer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create('user1', { name: 'Pack 1', price: 100 }))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
