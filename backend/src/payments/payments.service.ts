import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  NotificationType,
  OrderStatus,
  PaymentStatus,
  ReservationStatus,
  UserRole,
} from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private notifications: NotificationsService,
  ) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    if (key && !key.includes('xxx')) {
      this.stripe = new Stripe(key, {
        apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
      });
    } else {
      this.logger.warn(
        'STRIPE_SECRET_KEY em falta — pagamentos reais desactivados',
      );
    }
  }

  // Exposto para testes: permite injectar mock do Stripe
  setStripe(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createPaymentIntent(
    userId: string,
    target: 'reservation' | 'order',
    id: string,
  ) {
    if (!this.stripe) {
      throw new BadRequestException(
        'Pagamentos não configurados (STRIPE_SECRET_KEY em falta)',
      );
    }

    let amountEur = 0;
    const metadata: Record<string, string> = { target, refId: id, userId };

    if (target === 'reservation') {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id },
        include: { event: { include: { photographer: true } } },
      });
      if (!reservation) throw new NotFoundException('Reserva não encontrada');
      if (reservation.userId !== userId)
        throw new ForbiddenException(
          'Não podes pagar a reserva de outro utilizador',
        );
      if (reservation.status === ReservationStatus.CANCELLED)
        throw new BadRequestException('Reserva cancelada não pode ser paga');
      // valor por omissão da reserva: usar pack mais barato do fotógrafo ou 100€
      const pack = await this.prisma.pack.findFirst({
        where: { photographerId: reservation.event.photographerId },
        orderBy: { price: 'asc' },
      });
      amountEur = pack ? Number(pack.price) : 100;
    } else {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Encomenda não encontrada');
      if (order.userId !== userId)
        throw new ForbiddenException(
          'Não podes pagar a encomenda de outro utilizador',
        );
      amountEur = Number(order.total);
    }

    if (amountEur <= 0)
      throw new BadRequestException('Valor de pagamento inválido');

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(amountEur * 100),
      currency: 'eur',
      metadata,
    });

    await this.prisma.payment.create({
      data: {
        stripeId: intent.id,
        amount: amountEur,
        status: PaymentStatus.PENDING,
        ...(target === 'reservation' ? { reservationId: id } : { orderId: id }),
      },
    });

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amountEur,
    };
  }

  // Reentrável e idempotente — chave de idempotência é o event.id do Stripe
  async handleWebhookEvent(event: Stripe.Event): Promise<{ handled: boolean }> {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object;
        await this.onPaymentSucceeded(intent.id, event.id);
        return { handled: true };
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        await this.onPaymentFailed(intent.id, event.id);
        return { handled: true };
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const piId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (piId)
          await this.onPaymentRefunded(
            piId,
            event.id,
            charge.amount_refunded / 100,
            (charge.amount_captured ?? charge.amount) / 100,
          );
        return { handled: true };
      }
      default:
        return { handled: false };
    }
  }

  private async onPaymentSucceeded(stripeId: string, eventId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId },
      include: {
        reservation: {
          include: { event: { include: { photographer: true } } },
        },
        order: true,
      },
    });
    if (!payment) {
      this.logger.warn(
        `Webhook ${eventId}: pagamento local não encontrado para ${stripeId}`,
      );
      return;
    }
    // Idempotência: se já está SUCCEEDED, não repetir efeitos
    if (payment.status === PaymentStatus.SUCCEEDED) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCEEDED },
    });

    const notifications: Array<{
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
    }> = [];
    if (payment.reservationId && payment.reservation) {
      await this.prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { status: ReservationStatus.CONFIRMED },
      });
      notifications.push({
        userId: payment.reservation.userId,
        type: 'PAYMENT_SUCCEEDED' as const,
        title: 'Pagamento recebido',
        message: `Pagamento confirmado. Reserva marcada como CONFIRMADA.`,
      });
      notifications.push({
        userId: payment.reservation.event.photographer.userId,
        type: 'RESERVATION_CONFIRMED' as const,
        title: 'Nova reserva paga',
        message: `O evento "${payment.reservation.event.name}" tem uma reserva paga.`,
      });
    }
    if (payment.orderId && payment.order) {
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: OrderStatus.PROCESSING },
      });
      notifications.push({
        userId: payment.order.userId,
        type: 'PAYMENT_SUCCEEDED' as const,
        title: 'Pagamento recebido',
        message: 'A tua encomenda foi paga e está em processamento.',
      });
    }
    if (notifications.length)
      await this.notifications.bulkCreate(notifications);
  }

  private async onPaymentFailed(stripeId: string, eventId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId },
      include: { reservation: true },
    });
    if (!payment) {
      this.logger.warn(
        `Webhook ${eventId}: pagamento local não encontrado para ${stripeId}`,
      );
      return;
    }
    if (payment.status === PaymentStatus.FAILED) return;
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    if (payment.reservation) {
      await this.notifications.createForUser(
        payment.reservation.userId,
        'PAYMENT_FAILED',
        'Pagamento falhou',
        'O pagamento da reserva não foi concluído. Tenta novamente.',
      );
    }
  }

  private async onPaymentRefunded(
    stripeId: string,
    _eventId: string,
    refundedEur: number,
    totalEur: number,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripeId },
    });
    if (!payment) return;
    const status =
      refundedEur >= totalEur
        ? PaymentStatus.REFUNDED
        : PaymentStatus.PARTIALLY_REFUNDED;
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });
  }

  // Reembolso total ou parcial — apenas ADMIN
  async refund(paymentId: string, amountEur?: number, requesterRole?: string) {
    if (requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Apenas administradores podem reembolsar');
    }
    if (!this.stripe) throw new BadRequestException('Stripe não configurado');
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException(
        'Só pagamentos com sucesso podem ser reembolsados',
      );
    }
    await this.stripe.refunds.create({
      payment_intent: payment.stripeId,
      ...(amountEur ? { amount: Math.round(amountEur * 100) } : {}),
    });
    // O estado final é definido pelo webhook charge.refunded — não duplicar aqui
    return { message: 'Reembolso submetido junto do Stripe.' };
  }
}
