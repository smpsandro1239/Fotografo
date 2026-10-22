import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentStatus, ReservationStatus } from '@prisma/client';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: jest.Mocked<Pick<PrismaService, never>> & Record<string, any>;
  let notifications: { bulkCreate: jest.Mock; createForUser: jest.Mock };
  let stripeMock: any;

  beforeEach(async () => {
    prisma = {
      payment: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      reservation: { findUnique: jest.fn(), update: jest.fn() },
      order: { findUnique: jest.fn(), update: jest.fn() },
      pack: { findFirst: jest.fn() },
    };
    notifications = {
      bulkCreate: jest.fn().mockResolvedValue({ count: 0 }),
      createForUser: jest.fn(),
    };
    stripeMock = {
      paymentIntents: {
        create: jest
          .fn()
          .mockResolvedValue({ id: 'pi_123', client_secret: 'pi_123_secret' }),
      },
      refunds: { create: jest.fn().mockResolvedValue({ id: 're_123' }) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsService, useValue: notifications },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(undefined) },
        },
      ],
    }).compile();

    service = module.get(PaymentsService);
    service.setStripe(stripeMock as unknown as Stripe);
  });

  it('cria PaymentIntent para encomenda com total correcto', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'o1',
      userId: 'u1',
      total: 45,
    });
    prisma.payment.create.mockResolvedValue({});
    const res = await service.createPaymentIntent('u1', 'order', 'o1');
    expect(res.amountEur).toBe(45);
    expect(stripeMock.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 4500, currency: 'eur' }),
    );
    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          stripeId: 'pi_123',
          status: PaymentStatus.PENDING,
        }),
      }),
    );
  });

  it('recusa pagar encomenda de outro utilizador', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'o1',
      userId: 'outro',
      total: 45,
    });
    await expect(
      service.createPaymentIntent('u1', 'order', 'o1'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('webhook payment_intent.succeeded confirma reserva e notifica (idempotente)', async () => {
    const payment = {
      id: 'p1',
      stripeId: 'pi_123',
      status: PaymentStatus.PENDING,
      reservationId: 'r1',
      orderId: null,
      reservation: {
        id: 'r1',
        userId: 'u1',
        event: { name: 'Casamento', photographer: { userId: 'ph1' } },
      },
      order: null,
    };
    prisma.payment.findUnique.mockResolvedValue(payment);
    prisma.reservation.update.mockResolvedValue({});
    prisma.payment.update.mockResolvedValue({});

    const event = {
      id: 'evt_1',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_123' } },
    } as unknown as Stripe.Event;
    await service.handleWebhookEvent(event);
    expect(prisma.reservation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'r1' },
        data: { status: ReservationStatus.CONFIRMED },
      }),
    );
    expect(notifications.bulkCreate).toHaveBeenCalledTimes(1);

    // segunda entrega do mesmo evento -> não repete efeitos
    prisma.payment.findUnique.mockResolvedValue({
      ...payment,
      status: PaymentStatus.SUCCEEDED,
    });
    await service.handleWebhookEvent(event);
    expect(prisma.reservation.update).toHaveBeenCalledTimes(1);
  });

  it('webhook desconhecido devolve handled:false', async () => {
    const res = await service.handleWebhookEvent({
      id: 'e',
      type: 'customer.created',
      data: { object: {} },
    } as unknown as Stripe.Event);
    expect(res).toEqual({ handled: false });
  });

  it('refund exige ADMIN e pagamento SUCCEEDED', async () => {
    await expect(service.refund('p1', undefined, 'CLIENT')).rejects.toThrow(
      ForbiddenException,
    );
    prisma.payment.findUnique.mockResolvedValue({
      id: 'p1',
      stripeId: 'pi_1',
      status: PaymentStatus.FAILED,
    });
    await expect(service.refund('p1', undefined, 'ADMIN')).rejects.toThrow(
      BadRequestException,
    );
    prisma.payment.findUnique.mockResolvedValue({
      id: 'p1',
      stripeId: 'pi_1',
      status: PaymentStatus.SUCCEEDED,
    });
    await service.refund('p1', 10, 'ADMIN');
    expect(stripeMock.refunds.create).toHaveBeenCalledWith({
      payment_intent: 'pi_1',
      amount: 1000,
    });
  });
});
