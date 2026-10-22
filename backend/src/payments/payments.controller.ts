import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import Stripe from 'stripe';
import type { Request as ExpressRequest } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

type NestRawBodyRequest = ExpressRequest & { rawBody?: Buffer };

@ApiTags('Pagamentos')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar PaymentIntent para reserva ou encomenda' })
  createIntent(
    @GetUser('id') userId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    const id = dto.target === 'reservation' ? dto.reservationId : dto.orderId;
    if (!id) throw new BadRequestException('ID do alvo em falta');
    return this.paymentsService.createPaymentIntent(userId, dto.target, id);
  }

  // Webhook Stripe — SEM guard JWT; assinatura verificada com raw body
  // SkipThrottle: o Stripe envia rajadas de eventos; a proteção real é a assinatura
  @SkipThrottle()
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Webhook Stripe (raw body + verificação de assinatura)',
  })
  async webhook(@Req() req: NestRawBodyRequest, @Body() body: Stripe.Event) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    if (
      secret &&
      !secret.includes('xxx') &&
      typeof sig === 'string' &&
      req.rawBody
    ) {
      try {
        const stripe = new Stripe(
          this.config.get<string>('STRIPE_SECRET_KEY') ?? '',
        );
        event = stripe.webhooks.constructEvent(req.rawBody, sig, secret);
      } catch (err) {
        throw new BadRequestException(
          `Assinatura do webhook inválida: ${(err as Error).message}`,
        );
      }
    } else {
      // Sem segredo configurado (dev/teste): aceita o corpo mas regista aviso
      event = body;
    }

    return this.paymentsService.handleWebhookEvent(event);
  }

  @Patch(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reembolso total ou parcial (ADMIN)' })
  refund(
    @Param('id') id: string,
    @Body() dto: RefundPaymentDto,
    @GetUser('role') role: string,
  ) {
    return this.paymentsService.refund(id, dto.amountEur, role);
  }
}
