import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentType } from './enums/payment-type.enum';
import { PaymentStatus } from './enums/payment-type.enum';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Stripe.PaymentIntent | Stripe.Refund | Stripe.Charge;
  };
  created: number;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!secretKey) {
      throw new InternalServerErrorException('STRIPE_SECRET_KEY not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    });
  }

  async createPaymentIntent(dto: CreatePaymentIntentDto): Promise<PaymentIntentResult> {
    const { amount, currency = 'eur', type, reservationId, orderId, description, metadata = {} } = dto;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      description: description || `Payment for ${type}`,
      metadata: {
        type,
        reservationId: reservationId || '',
        orderId: orderId || '',
        ...metadata,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<Stripe.PaymentIntent> {
    try {
      const params: Stripe.PaymentIntentConfirmParams = {};
      if (paymentMethodId) {
        params.payment_method = paymentMethodId;
      }
      return await this.stripe.paymentIntents.confirm(paymentIntentId, params);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeCardError) {
        throw new BadRequestException(`Payment failed: ${error.message}`);
      }
      throw new InternalServerErrorException('Failed to confirm payment');
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeResourceNotFoundError) {
        throw new NotFoundException(`Payment intent ${paymentIntentId} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve payment intent');
    }
  }

  async createRefund(dto: { paymentIntentId: string; amount?: number; reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' }): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.create({
        payment_intent: dto.paymentIntentId,
        amount: dto.amount,
        reason: dto.reason,
      });
    } catch (error) {
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw new BadRequestException(`Refund failed: ${error.message}`);
      }
      throw new InternalServerErrorException('Failed to create refund');
    }
  }

  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    return this.stripe.customers.create({ email, name, metadata });
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return this.stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  constructWebhookEvent(payload: Buffer | string, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (error) {
      throw new BadRequestException(`Webhook signature verification failed: ${error.message}`);
    }
  }

  async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // This will be handled by the webhook handler in the payments service
    console.log(`Payment succeeded: ${paymentIntent.id}`, {
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  }

  async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.error(`Payment failed: ${paymentIntent.id}`, {
      error: paymentIntent.last_payment_error?.message,
      metadata: paymentIntent.metadata,
    });
  }

  getStripeInstance(): Stripe {
    return this.stripe;
  }
}