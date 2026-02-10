import { Test, TestingModule } from '@nestjs/testing';
import { PhotographersService } from './photographers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PhotographersService', () => {
  let service: PhotographersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotographersService,
        {
          provide: PrismaService,
          useValue: {
            photographer: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PhotographersService>(PhotographersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
