import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { ProductService } from '../product/product.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE')
    private readonly stripe: Stripe,
    private readonly productService: ProductService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  async createCheckoutSession(
    user: any,
    items: { productId: string; quantity: number }[],
    successUrl: string,
    cancelUrl: string,
  ) {
    const productIds = items.map(item => item.productId);

    const products = await this.productService.findByIds(productIds);

    const productMap = new Map(products.map(p => [p.id, p]));

    const lineItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

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

    const paymentId = uuidv4()
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        paymentId
      },
    });

    await this.supabase.from('payment').insert({
      id: paymentId,
      user_id: user.id,
      checkout_id: session.id,
      payment_intent: session.payment_intent,
      amount_total: session.amount_total,
      status: session.payment_status,
      method: session.payment_method_types[0],
    })

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
    if (!result) {
      throw new NotFoundException(`Payment intent with ID ${paymentIntentId} not found`);
    }
    await this.supabase.from('payment').update({
      status: 'refunded',
    }).eq('payment_intent', paymentIntentId);
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

  private async checkoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    const session = event.data.object;
    const paymentIntent = session.payment_intent;

    await Promise.all([
      this.supabase.from('payment').update({
        status: session.payment_status,
        payment_intent: session.payment_intent,
      }).eq('id', session.metadata?.paymentId),
      this.supabase.from('cart').delete().eq('user_id', session.metadata?.userId)
    ])

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
