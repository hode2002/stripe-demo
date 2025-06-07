import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE')
    private readonly stripe: Stripe,
  ) {}

  async createCheckoutSession(
    items: { productId: string; quantity: number }[],
    successUrl: string,
    cancelUrl: string,
  ) {
    const products = [
      { id: 'prod_1', name: 'Sản phẩm 1', price: 100000 },
      { id: 'prod_2', name: 'Sản phẩm 2', price: 200000 },
      { id: 'prod_3', name: 'Sản phẩm 3', price: 150000 },
    ];

    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`);

      return {
        price_data: {
          currency: 'vnd',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { id: session.id };
  }

  handleWebhook(req: Request, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      console.error(`Webhook error: ${err.message}`);
      return { success: false };
    }

    this.handleEvent(event);

    return { success: true };
  }

  async refund(paymentIntentId: string) {
    const result = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    return result;
  }

  private handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'charge.refunded':
        this.chargeRefunded(event);
        break;

      case 'checkout.session.completed':
        this.checkoutSessionCompleted(event);
        break;

      case 'checkout.session.expired':
        this.checkoutSessionExpired(event);
        break;

      case 'payment_intent.succeeded':
        this.paymentIntentSucceeded(event);
        break;

      case 'payment_intent.payment_failed':
        this.paymentIntentFailed(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private chargeRefunded(event: Stripe.ChargeRefundedEvent) {
    console.log('Charge_refunded', event.data.object);
  }

  private checkoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    const session = event.data.object;
    const paymentIntent = session.payment_intent;
    console.log('paymentIntent***', paymentIntent);
    console.log('Checkout.session.completed', session);
  }

  private checkoutSessionExpired(event: Stripe.CheckoutSessionExpiredEvent) {
    const session = event.data.object;
    console.log('Checkout.session.expired', session);
  }

  private paymentIntentSucceeded(event: Stripe.PaymentIntentSucceededEvent) {
    console.log('Payment_intent.succeeded', event.data.object);
  }

  private paymentIntentFailed(event: Stripe.PaymentIntentPaymentFailedEvent) {
    console.log('Payment_intent.payment_failed', event.data.object);
  }
}
