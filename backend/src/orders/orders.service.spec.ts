import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderItemType, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(OrdersService);
  });

  it('calcula total a partir dos items com quantidade', async () => {
    prisma.order.create.mockImplementation(({ data }: any) =>
      Promise.resolve({ id: 'o1', ...data }),
    );
    const res = await service.create('u1', {
      items: [
        { type: OrderItemType.PHOTO, name: 'Foto', price: 15, quantity: 2 },
        { type: OrderItemType.PRINT, name: 'Print', price: 30 },
      ],
    } as CreateOrderDto);
    expect(res.total).toBe(60);
  });

  it('bloqueia transição inválida PENDING->SHIPPED', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.PENDING,
    });
    await expect(
      service.updateStatus(
        'o1',
        { status: OrderStatus.SHIPPED },
        'ph1',
        'PHOTOGRAPHER',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('permite transição válida PENDING->PROCESSING', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.PENDING,
    });
    prisma.order.update.mockResolvedValue({
      id: 'o1',
      status: OrderStatus.PROCESSING,
    });
    const res = await service.updateStatus(
      'o1',
      { status: OrderStatus.PROCESSING },
      'ph1',
      'PHOTOGRAPHER',
    );
    expect(res.status).toBe(OrderStatus.PROCESSING);
  });

  it('CLIENT não altera estado', async () => {
    await expect(
      service.updateStatus(
        'o1',
        { status: OrderStatus.PROCESSING },
        'u1',
        'CLIENT',
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('findOne nega acesso a encomenda de outro user', async () => {
    prisma.order.findUnique.mockResolvedValue({ id: 'o1', userId: 'outro' });
    await expect(service.findOne('o1', 'u1', 'CLIENT')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
