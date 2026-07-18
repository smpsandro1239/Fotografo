import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PaymentsService } from '../../src/payments/payments.service';
import { StripeService } from '../../src/payments/stripe.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PaymentType, PaymentStatus } from '../../src/payments/enums/payment-type.enum';
import { CreatePaymentIntentDto } from '../../src/payments/dto/create-payment-intent.dto';

const mockPrismaService = {
  payment: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  reservation: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
};

const mockStripeService = {
  createPaymentIntent: jest.fn(),
  confirmPaymentIntent: jest.fn(),
  getPaymentIntent: jest.fn(),
  createRefund: jest.fn(),
  constructWebhookEvent: jest.fn(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: typeof mockPrismaService;
  let stripeService: typeof mockStripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: StripeService, useValue: mockStripeService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get(PrismaService);
    stripeService = module.get(StripeService);

    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    const userId = 'user-123';
    const dto: CreatePaymentIntentDto = {
      type: PaymentType.RESERVATION,
      amount: 15000,
      currency: 'eur',
      reservationId: 'reservation-1',
      metadata: { eventName: 'Wedding' },
    };

    it('should create payment intent for reservation', async () => {
      const mockReservation = {
        id: 'reservation-1',
        userId,
        status: 'PENDING',
        event: { id: 'event-1', name: 'Wedding', photographer: { userId: 'photographer-1' } },
        payment: null,
      };

      const mockPaymentIntent = {
        clientSecret: 'pi_secret_123',
        paymentIntentId: 'pi_123',
        amount: 15000,
        currency: 'eur',
        status: 'requires_payment_method',
      };

      const mockPayment = { id: 'payment-1', stripeId: 'pi_123', amount: 15000, status: 'PENDING' };

      prismaService.reservation.findUnique.mockResolvedValue(mockReservation);
      stripeService.createPaymentIntent.mockResolvedValue(mockPaymentIntent);
      prismaService.payment.create.mockResolvedValue(mockPayment);

      const result = await service.createPaymentIntent(userId, dto);

      expect(prismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 'reservation-1' },
        include: { event: { include: { photographer: true } } },
      });
      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(expect.objectContaining({
        type: PaymentType.RESERVATION,
        amount: 15000,
        reservationId: 'reservation-1',
      }));
      expect(prismaService.payment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ stripeId: 'pi_123', amount: 15000, status: 'PENDING' }),
      });
      expect(result).toEqual({ ...mockPaymentIntent, paymentId: 'payment-1' });
    });

    it('should throw BadRequestException if reservationId missing for reservation type', async () => {
      await expect(service.createPaymentIntent(userId, { ...dto, reservationId: undefined }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if reservation not found', async () => {
      prismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.createPaymentIntent(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if reservation belongs to another user', async () => {
      prismaService.reservation.findUnique.mockResolvedValue({ ...dto, userId: 'other-user', status: 'PENDING', event: {} });

      await expect(service.createPaymentIntent(userId, dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if reservation already cancelled', async () => {
      prismaService.reservation.findUnique.mockResolvedValue({ ...dto, userId, status: 'CANCELLED', event: {} });

      await expect(service.createPaymentIntent(userId, dto)).rejects.toThrow(BadRequestException);
    });

    it('should create payment intent for order', async () => {
      const orderDto: CreatePaymentIntentDto = { ...dto, type: PaymentType.ORDER, orderId: 'order-1', reservationId: undefined };
      const mockOrder = { id: 'order-1', userId, status: 'PENDING', payment: null };
      const mockPaymentIntent = { clientSecret: 'pi_secret', paymentIntentId: 'pi_123', amount: 15000, currency: 'eur', status: 'requires_payment_method' };
      const mockPayment = { id: 'payment-1', stripeId: 'pi_123', amount: 15000, status: 'PENDING' };

      prismaService.order.findUnique.mockResolvedValue(mockOrder);
      stripeService.createPaymentIntent.mockResolvedValue(mockPaymentIntent);
      prismaService.payment.create.mockResolvedValue(mockPayment);

      const result = await service.createPaymentIntent(userId, orderDto);

      expect(prismaService.order.findUnique).toHaveBeenCalledWith({ where: { id: 'order-1' } });
      expect(result.paymentId).toBe('payment-1');
    });
  });

  describe('confirmPayment', () => {
    const userId = 'user-123';
    const paymentIntentId = 'pi_123';

    it('should confirm payment and update status', async () => {
      const mockPayment = {
        id: 'payment-1',
        stripeId: paymentIntentId,
        reservation: { userId, event: { photographer: { userId: 'photographer-1' } } },
        order: null,
      };

      const mockConfirmedIntent = { status: 'succeeded' };
      prismaService.payment.findUnique.mockResolvedValue(mockPayment);
      stripeService.confirmPaymentIntent.mockResolvedValue(mockConfirmedIntent);
      prismaService.payment.update.mockResolvedValue({ ...mockPayment, status: 'SUCCEEDED' });

      const result = await service.confirmPayment(userId, paymentIntentId);

      expect(stripeService.confirmPaymentIntent).toHaveBeenCalledWith(paymentIntentId, undefined);
      expect(prismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { status: 'SUCCEEDED' },
      });
    });

    it('should throw NotFoundException if payment not found', async () => {
      prismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.confirmPayment(userId, paymentIntentId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if payment belongs to another user', async () => {
      prismaService.payment.findUnique.mockResolvedValue({
        id: 'payment-1',
        stripeId: paymentIntentId,
        reservation: { userId: 'other-user' },
        order: null,
      });

      await expect(service.confirmPayment(userId, paymentIntentId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('handleWebhookEvent', () => {
    it('should handle payment_intent.succeeded', async () => {
      const mockPaymentIntent = {
        id: 'pi_123',
        status: 'succeeded',
        metadata: { type: PaymentType.RESERVATION, reservationId: 'reservation-1' },
      };

      const mockPayment = {
        id: 'payment-1',
        stripeId: 'pi_123',
        reservation: { id: 'reservation-1', userId: 'user-1', event: { photographer: { userId: 'photographer-1' }, name: 'Wedding' } },
        order: null,
      };

      prismaService.payment.findUnique.mockResolvedValue(mockPayment);
      prismaService.payment.update.mockResolvedValue({ ...mockPayment, status: 'SUCCEEDED' });
      prismaService.reservation.update.mockResolvedValue({});
      prismaService.notification.create.mockResolvedValue({});

      await service.handleWebhookEvent({ type: 'payment_intent.succeeded', data: { object: mockPaymentIntent } });

      expect(prismaService.payment.update).toHaveBeenCalledWith({ where: { id: 'payment-1' }, data: { status: 'SUCCEEDED' } });
      expect(prismaService.reservation.update).toHaveBeenCalledWith({ where: { id: 'reservation-1' }, data: { status: 'CONFIRMED' } });
      expect(prismaService.notification.create).toHaveBeenCalledTimes(2); // photographer + client
    });

    it('should handle payment_intent.payment_failed', async () => {
      const mockPaymentIntent = { id: 'pi_123', last_payment_error: { message: 'Card declined' }, metadata: { reservationId: 'reservation-1' } };
      const mockPayment = { id: 'payment-1', stripeId: 'pi_123', reservation: { id: 'reservation-1', userId: 'user-1', event: { name: 'Wedding' } }, order: null };

      prismaService.payment.findUnique.mockResolvedValue(mockPayment);
      prismaService.payment.update.mockResolvedValue({});
      prismaService.reservation.update.mockResolvedValue({});
      prismaService.notification.create.mockResolvedValue({});

      await service.handleWebhookEvent({ type: 'payment_intent.payment_failed', data: { object: mockPaymentIntent } });

      expect(prismaService.payment.update).toHaveBeenCalledWith({ where: { id: 'payment-1' }, data: { status: 'FAILED' } });
      expect(prismaService.reservation.update).toHaveBeenCalledWith({ where: { id: 'reservation-1' }, data: { status: 'CANCELLED' } });
    });

    it('should handle charge.refunded', async () => {
      const mockCharge = { payment_intent: 'pi_123', amount_refunded: 15000, amount: 15000 };
      const mockPayment = { id: 'payment-1', stripeId: 'pi_123', amount: 15000 };

      prismaService.payment.findUnique.mockResolvedValue(mockPayment);
      prismaService.payment.update.mockResolvedValue({});

      await service.handleWebhookEvent({ type: 'charge.refunded', data: { object: mockCharge } });

      expect(prismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: { status: 'REFUNDED' },
      });
    });
  });

  describe('createRefund', () => {
    const userId = 'user-123';
    const paymentId = 'payment-1';

    it('should create refund for successful payment', async () => {
      const mockPayment = {
        id: paymentId,
        stripeId: 'pi_123',
        amount: 15000,
        status: 'SUCCEEDED',
        reservation: { userId },
        order: null,
      };

      const mockRefund = { id: 're_123', amount: 15000, status: 'succeeded' };
      prismaService.payment.findUnique.mockResolvedValue(mockPayment);
      stripeService.createRefund.mockResolvedValue(mockRefund);
      prismaService.payment.update.mockResolvedValue({ ...mockPayment, status: 'REFUNDED' });

      const result = await service.createRefund(userId, paymentId);

      expect(stripeService.createRefund).toHaveBeenCalledWith({ paymentIntentId: 'pi_123', amount: undefined });
      expect(prismaService.payment.update).toHaveBeenCalledWith({ where: { id: paymentId }, data: { status: 'REFUNDED' } });
      expect(result).toEqual(mockRefund);
    });

    it('should throw NotFoundException if payment not found', async () => {
      prismaService.payment.findUnique.mockResolvedValue(null);

      await expect(service.createRefund(userId, paymentId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if payment belongs to another user', async () => {
      prismaService.payment.findUnique.mockResolvedValue({
        id: paymentId,
        status: 'SUCCEEDED',
        reservation: { userId: 'other-user' },
        order: null,
      });

      await expect(service.createRefund(userId, paymentId)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if payment not succeeded', async () => {
      prismaService.payment.findUnique.mockResolvedValue({
        id: paymentId,
        status: 'PENDING',
        reservation: { userId },
        order: null,
      });

      await expect(service.createRefund(userId, paymentId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPaymentById', () => {
    it('should return payment for owner', async () => {
      const mockPayment = { id: 'payment-1', reservation: { userId: 'user-123' }, order: null };
      prismaService.payment.findUnique.mockResolvedValue(mockPayment);

      const result = await service.getPaymentById('user-123', 'payment-1');

      expect(result).toEqual(mockPayment);
    });

    it('should throw ForbiddenException if payment belongs to another user', async () => {
      prismaService.payment.findUnique.mockResolvedValue({ id: 'payment-1', reservation: { userId: 'other-user' }, order: null });

      await expect(service.getPaymentById('user-123', 'payment-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getPaymentsByUser', () => {
    it('should return payments for user', async () => {
      const mockPayments = [{ id: 'payment-1' }, { id: 'payment-2' }];
      prismaService.payment.findMany.mockResolvedValue(mockPayments);

      const result = await service.getPaymentsByUser('user-123');

      expect(prismaService.payment.findMany).toHaveBeenCalledWith({
        where: { OR: [{ reservation: { userId: 'user-123' } }, { order: { userId: 'user-123' } }] },
        include: { reservation: { include: { event: true } }, order: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockPayments);
    });
  });
});