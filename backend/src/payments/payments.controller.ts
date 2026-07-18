import { Controller, Post, Body, Headers, RawBodyRequest, Req, UseGuards, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private stripeService: StripeService,
  ) {}

  @Post('reservation/:reservationId/intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create PaymentIntent for a reservation' })
  @ApiResponse({ status: 201, description: 'PaymentIntent created successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createReservationPaymentIntent(
    @CurrentUser() user: User,
    @Param('reservationId') reservationId: string,
    @Body() body: { amount: number },
  ) {
    return this.paymentsService.createPaymentIntentForReservation(user.id, reservationId, body.amount);
  }

  @Post('order/:orderId/intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create PaymentIntent for an order' })
  @ApiResponse({ status: 201, description: 'PaymentIntent created successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async createOrderPaymentIntent(
    @CurrentUser() user: User,
    @Param('orderId') orderId: string,
    @Body() body: { amount: number },
  ) {
    return this.paymentsService.createPaymentIntentForOrder(user.id, orderId, body.amount);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiHeader({ name: 'stripe-signature', required: true, description: 'Stripe signature header' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  @ApiResponse({ status: 400, description: 'Invalid signature' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    const event = this.stripeService.constructWebhookEvent(req.rawBody, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.paymentsService.handleSuccessfulPayment(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        await this.paymentsService.handleFailedPayment(event.data.object.id);
        break;
      case 'charge.refunded':
        // Handle refund if needed
        break;
    }

    return { received: true };
  }

  @Get('reservation/:reservationId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment for a reservation' })
  async getReservationPayment(
    @CurrentUser() user: User,
    @Param('reservationId') reservationId: string,
  ) {
    const payment = await this.paymentsService.getPaymentByReservation(reservationId);
    if (!payment) return null;

    // Check ownership
    const reservation = await this.paymentsService['prisma'].reservation.findUnique({
      where: { id: reservationId },
    });
    if (reservation?.userId !== user.id) {
      throw new Error('Forbidden');
    }

    return payment;
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment for an order' })
  async getOrderPayment(
    @CurrentUser() user: User,
    @Param('orderId') orderId: string,
  ) {
    const payment = await this.paymentsService.getPaymentByOrder(orderId);
    if (!payment) return null;

    const order = await this.paymentsService['prisma'].order.findUnique({
      where: { id: orderId },
    });
    if (order?.userId !== user.id) {
      throw new Error('Forbidden');
    }

    return payment;
  }

  @Post(':paymentId/refund')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refund a payment' })
  async refundPayment(
    @CurrentUser() user: User,
    @Param('paymentId') paymentId: string,
    @Body() body: { amount?: number },
  ) {
    return this.paymentsService.refundPayment(paymentId, user.id, body.amount);
  }
}