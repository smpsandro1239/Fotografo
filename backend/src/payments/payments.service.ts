import { Injectable, NotFoundException, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService, PaymentIntentResult } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentType } from './enums/payment-type.enum';
import { PaymentStatus } from './enums/payment-type.enum';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createPaymentIntent(userId: string, dto: CreatePaymentIntentDto): Promise<PaymentIntentResult & { paymentId: string }> {
    // Validate reservation or order ownership
    if (dto.type === PaymentType.RESERVATION) {
      if (!dto.reservationId) {
        throw new BadRequestException('reservationId is required for reservation payments');
      }
      const reservation = await this.prisma.reservation.findUnique({
        where: { id: dto.reservationId },
        include: { event: { include: { photographer: true } } },
      });
      if (!reservation) throw new NotFoundException('Reservation not found');
      if (reservation.userId !== userId) throw new ForbiddenException('Not your reservation');
      if (reservation.status === 'CANCELLED') throw new BadRequestException('Reservation is cancelled');
    }

    if (dto.type === PaymentType.ORDER) {
      if (!dto.orderId) {
        throw new BadRequestException('orderId is required for order payments');
      }
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
      });
      if (!order) throw new NotFoundException('Order not found');
      if (order.userId !== userId) throw new ForbiddenException('Not your order');
      if (order.status === 'CANCELLED') throw new BadRequestException('Order is cancelled');
    }

    // Create Stripe PaymentIntent
    const result = await this.stripeService.createPaymentIntent(dto);

    // Create Payment record in DB
    const payment = await this.prisma.payment.create({
      data: {
        stripeId: result.paymentIntentId,
        amount: result.amount,
        status: this.mapStripeStatusToPaymentStatus(result.status),
        reservationId: dto.reservationId,
        orderId: dto.orderId,
      },
    });

    return { ...result, paymentId: payment.id };
  }

  async confirmPayment(userId: string, paymentIntentId: string, paymentMethodId?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId: paymentIntentId },
      include: {
        reservation: { include: { event: { include: { photographer: true } } } },
        order: true,
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    // Verify ownership
    const isOwner = 
      (payment.reservation && payment.reservation.userId === userId) ||
      (payment.order && payment.order.userId === userId);

    if (!isOwner) throw new ForbiddenException('Not your payment');

    const confirmedIntent = await this.stripeService.confirmPaymentIntent(paymentIntentId, paymentMethodId);

    // Update payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: this.mapStripeStatusToPaymentStatus(confirmedIntent.status) },
    });

    // If succeeded, update reservation/order
    if (confirmedIntent.status === 'succeeded') {
      await this.handleSuccessfulPayment(payment);
    }

    return confirmedIntent;
  }

  async handleWebhookEvent(event: { type: string; data: { object: any } }) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await this.handleRefunded(event.data.object);
        break;
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId: paymentIntent.id },
      include: { reservation: { include: { event: { include: { photographer: true } } } }, order: true },
    });

    if (!payment) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCEEDED },
    });

    await this.handleSuccessfulPayment(payment);
  }

  private async handleSuccessfulPayment(payment: any) {
    if (payment.reservation) {
      // Confirm reservation
      await this.prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { status: 'CONFIRMED' },
      });

      // Create notification for photographer
      await this.prisma.notification.create({
        data: {
          userId: payment.reservation.event.photographer.userId,
          title: 'Nova Reserva Confirmada',
          message: `A reserva para o evento "${payment.reservation.event.name}" foi confirmada e paga.`,
        },
      });

      // Create notification for client
      await this.prisma.notification.create({
        data: {
          userId: payment.reservation.userId,
          title: 'Reserva Confirmada',
          message: `A sua reserva para "${payment.reservation.event.name}" foi confirmada!`,
        },
      });
    }

    if (payment.order) {
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'COMPLETED' },
      });

      // Notify client
      await this.prisma.notification.create({
        data: {
          userId: payment.order.userId,
          title: 'Encomenda Confirmada',
          message: 'A sua encomenda foi paga e confirmada. Entraremos em contacto para detalhes de envio.',
        },
      });
    }
  }

  private async handlePaymentFailed(paymentIntent: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId: paymentIntent.id },
      include: { reservation: true, order: true },
    });

    if (!payment) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    // Notify user
    const userId = payment.reservation?.userId || payment.order?.userId;
    if (userId) {
      await this.prisma.notification.create({
        data: {
          userId,
          title: 'Pagamento Falhou',
          message: `O pagamento ${paymentIntent.last_payment_error?.message || 'falhou'}. Por favor, tente novamente.`,
        },
      });
    }
  }

  private async handleRefunded(charge: any) {
    const paymentIntentId = charge.payment_intent;
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId: paymentIntentId },
    });

    if (!payment) return;

    const refundAmount = charge.amount_refunded || charge.amount;
    const isFullRefund = refundAmount === charge.amount;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED },
    });
  }

  async createRefund(userId: string, paymentId: string, amount?: number, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { reservation: true, order: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    // Verify ownership
    const isOwner = 
      (payment.reservation && payment.reservation.userId === userId) ||
      (payment.order && payment.order.userId === userId);

    if (!isOwner) throw new ForbiddenException('Not your payment');

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    const refund = await this.stripeService.createRefund({
      paymentIntentId: payment.stripeId,
      amount,
      reason: reason as any,
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: refund.amount === payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED },
    });

    return refund;
  }

  async getPaymentById(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { reservation: { include: { event: true } }, order: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    const isOwner = 
      (payment.reservation && payment.reservation.userId === userId) ||
      (payment.order && payment.order.userId === userId);

    if (!isOwner) throw new ForbiddenException('Not your payment');

    return payment;
  }

  async getPaymentsByUser(userId: string) {
    return this.prisma.payment.findMany({
      where: {
        OR: [
          { reservation: { userId } },
          { order: { userId } },
        ],
      },
      include: { reservation: { include: { event: true } }, order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private mapStripeStatusToPaymentStatus(stripeStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      succeeded: PaymentStatus.SUCCEEDED,
      processing: PaymentStatus.PENDING,
      requires_payment_method: PaymentStatus.PENDING,
      requires_confirmation: PaymentStatus.PENDING,
      requires_action: PaymentStatus.PENDING,
      canceled: PaymentStatus.FAILED,
    };
    return statusMap[stripeStatus] || PaymentStatus.PENDING;
  }
}