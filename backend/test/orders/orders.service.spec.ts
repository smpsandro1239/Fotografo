import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { OrdersService } from '../../src/orders/orders.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PaymentsService } from '../../src/payments/payments.service';
import { CreateOrderDto, CreateOrderItemDto } from '../../src/orders/dto/create-order.dto';
import { OrderStatus, OrderItemType } from '../../src/orders/enums/order.enums';

const mockPrismaService = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  photo: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  album: {
    findUnique: jest.fn(),
  },
  pack: {
    findUnique: jest.fn(),
  },
  photographer: {
    findUnique: jest.fn(),
  },
  orderItem: {
    findMany: jest.fn(),
  },
  payment: {
    findUnique: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
};

const mockPaymentsService = {
  createPaymentIntentForOrder: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: typeof mockPrismaService;
  let paymentsService: typeof mockPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaymentsService, useValue: mockPaymentsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get(PrismaService);
    paymentsService = module.get(PaymentsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const dto: CreateOrderDto = {
      items: [
        { type: OrderItemType.PHOTO, referenceId: 'photo-1', quantity: 2, unitPrice: 1000 },
        { type: OrderItemType.ALBUM, referenceId: 'album-1', quantity: 1, unitPrice: 5000 },
      ],
    };

    it('should create order with valid items and calculate total', async () => {
      prismaService.photo.findUnique.mockResolvedValue({ id: 'photo-1' });
      prismaService.album.findUnique.mockResolvedValue({ id: 'album-1' });
      prismaService.pack.findUnique.mockResolvedValue(null);

      const expectedOrder = {
        id: 'order-123',
        userId,
        total: 7000,
        status: OrderStatus.PENDING,
        items: [
          { id: 'item-1', type: OrderItemType.PHOTO, referenceId: 'photo-1', quantity: 2, unitPrice: 1000 },
          { id: 'item-2', type: OrderItemType.ALBUM, referenceId: 'album-1', quantity: 1, unitPrice: 5000 },
        ],
      };

      prismaService.order.create.mockResolvedValue(expectedOrder);

      const result = await service.create(userId, dto);

      expect(prismaService.photo.findUnique).toHaveBeenCalledWith({ where: { id: 'photo-1' } });
      expect(prismaService.album.findUnique).toHaveBeenCalledWith({ where: { id: 'album-1' } });
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId,
          total: 7000,
          status: OrderStatus.PENDING,
          items: {
            create: [
              { type: OrderItemType.PHOTO, referenceId: 'photo-1', quantity: 2, unitPrice: 1000, options: undefined },
              { type: OrderItemType.ALBUM, referenceId: 'album-1', quantity: 1, unitPrice: 5000, options: undefined },
            ],
          },
        },
        include: { items: true },
      });
      expect(result).toEqual(expectedOrder);
    });

    it('should throw NotFoundException if photo not found', async () => {
      prismaService.photo.findUnique.mockResolvedValue(null);
      prismaService.album.findUnique.mockResolvedValue({ id: 'album-1' });

      await expect(service.create(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if album not found', async () => {
      prismaService.photo.findUnique.mockResolvedValue({ id: 'photo-1' });
      prismaService.album.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if pack not found', async () => {
      const dtoWithPack: CreateOrderDto = {
        items: [{ type: OrderItemType.PACK, referenceId: 'pack-1', quantity: 1, unitPrice: 5000 }],
      };
      prismaService.pack.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, dtoWithPack)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const userId = 'user-123';

    it('should return user orders for CLIENT role', async () => {
      const orders = [{ id: 'order-1', userId, items: [] }];
      prismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll(userId, 'CLIENT');

      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(orders);
    });

    it('should return photographer orders for PHOTOGRAPHER role', async () => {
      const photographerId = 'photographer-1';
      const orders = [{ id: 'order-1', userId: 'client-1', items: [] }];
      prismaService.photographer.findUnique.mockResolvedValue({ id: photographerId, userId });
      prismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll(userId, 'PHOTOGRAPHER');

      expect(prismaService.photographer.findUnique).toHaveBeenCalledWith({ where: { userId } });
      expect(prismaService.order.findMany).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should throw ForbiddenException if photographer not found', async () => {
      prismaService.photographer.findUnique.mockResolvedValue(null);

      await expect(service.findAll(userId, 'PHOTOGRAPHER')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    const userId = 'user-123';
    const orderId = 'order-123';

    const mockOrder = {
      id: orderId,
      userId,
      items: [{ photo: { album: { event: { photographer: { userId: 'photographer-1' } } } } }],
      payment: null,
    };

    it('should return order for owner', async () => {
      prismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId, userId, 'CLIENT');

      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: { items: true, user: { select: { name: true, email: true } }, payment: true },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should return order for photographer of the event', async () => {
      const photographerOrder = {
        ...mockOrder,
        userId: 'client-1',
        items: [{ photo: { album: { event: { photographer: { userId } } } } }],
      };
      prismaService.order.findUnique.mockResolvedValue(photographerOrder);

      const result = await service.findOne(orderId, userId, 'PHOTOGRAPHER');

      expect(result).toEqual(photographerOrder);
    });

    it('should throw ForbiddenException if user is not owner or photographer', async () => {
      prismaService.order.findUnique.mockResolvedValue(mockOrder);

      await expect(service.findOne(orderId, 'other-user', 'CLIENT')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if order not found', async () => {
      prismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(orderId, userId, 'CLIENT')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const userId = 'photographer-1';
    const orderId = 'order-123';

    const mockOrder = {
      id: orderId,
      userId: 'client-1',
      status: OrderStatus.PENDING,
      items: [{ photo: { album: { event: { photographer: { userId } } } } }],
    };

    it('should update status for valid transition', async () => {
      prismaService.order.findUnique.mockResolvedValue(mockOrder);
      prismaService.order.update.mockResolvedValue({ ...mockOrder, status: OrderStatus.PROCESSING });

      const result = await service.updateStatus(orderId, userId, OrderStatus.PROCESSING);

      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
        include: { items: true },
      });
      expect(result.status).toBe(OrderStatus.PROCESSING);
    });

    it('should throw BadRequestException for invalid transition', async () => {
      const completedOrder = { ...mockOrder, status: OrderStatus.COMPLETED };
      prismaService.order.findUnique.mockResolvedValue(completedOrder);

      await expect(service.updateStatus(orderId, userId, OrderStatus.PROCESSING)).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if not photographer of event', async () => {
      prismaService.order.findUnique.mockResolvedValue({
        ...mockOrder,
        items: [{ photo: { album: { event: { photographer: { userId: 'other-photographer' } } } } }],
      });

      await expect(service.updateStatus(orderId, userId, OrderStatus.PROCESSING)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancel', () => {
    const userId = 'user-123';
    const orderId = 'order-123';

    it('should cancel pending order for owner', async () => {
      prismaService.order.findUnique.mockResolvedValue({ id: orderId, userId, status: OrderStatus.PENDING, payment: null });
      prismaService.order.update.mockResolvedValue({ id: orderId, status: OrderStatus.CANCELLED });

      const result = await service.cancel(userId, orderId);

      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

    it('should throw BadRequestException if order not pending', async () => {
      prismaService.order.findUnique.mockResolvedValue({ id: orderId, userId, status: OrderStatus.COMPLETED });

      await expect(service.cancel(userId, orderId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if payment succeeded', async () => {
      prismaService.order.findUnique.mockResolvedValue({
        id: orderId,
        userId,
        status: OrderStatus.PENDING,
        payment: { status: 'SUCCEEDED' },
      });

      await expect(service.cancel(userId, orderId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createPaymentIntent', () => {
    const userId = 'user-123';
    const orderId = 'order-123';

    it('should create payment intent for pending order', async () => {
      const mockOrder = { id: orderId, userId, total: 5000, status: OrderStatus.PENDING, payment: null };
      prismaService.order.findUnique.mockResolvedValue(mockOrder);
      paymentsService.createPaymentIntentForOrder.mockResolvedValue({ clientSecret: 'pi_secret', paymentIntentId: 'pi_123' });

      const result = await service.createPaymentIntent(userId, orderId);

      expect(paymentsService.createPaymentIntentForOrder).toHaveBeenCalledWith(userId, orderId, 5000);
      expect(result).toEqual({ clientSecret: 'pi_secret', paymentIntentId: 'pi_123' });
    });

    it('should throw BadRequestException if order not pending', async () => {
      prismaService.order.findUnique.mockResolvedValue({ id: orderId, userId, status: OrderStatus.COMPLETED });

      await expect(service.createPaymentIntent(userId, orderId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if payment already exists', async () => {
      prismaService.order.findUnique.mockResolvedValue({ id: orderId, userId, status: OrderStatus.PENDING, payment: { id: 'payment-1' } });

      await expect(service.createPaymentIntent(userId, orderId)).rejects.toThrow(BadRequestException);
    });
  });
});