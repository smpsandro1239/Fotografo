import { Test, TestingModule } from '@nestjs/testing';
import { PhotographersController } from './photographers.controller';
import { PhotographersService } from './photographers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PhotographersController', () => {
  let controller: PhotographersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotographersController],
      providers: [
        {
          provide: PhotographersService,
          useValue: {
            create: jest.fn(),
            findMe: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PhotographersController>(PhotographersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
