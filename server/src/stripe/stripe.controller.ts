import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async checkout(
    @Body()
    body: {
      items: { productId: string; quantity: number }[];
    },
  ) {
    const session = await this.stripeService.createCheckoutSession(
      body.items,
      'http://localhost:3000/payment/success',
      'http://localhost:3000/payment/cancel',
    );

    return { sessionId: session.id };
  }

  @Post('webhook')
  handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(req, signature);
  }

  @Post('refund')
  async refund(@Body() body: { paymentIntentId: string }) {
    return this.stripeService.refund(body.paymentIntentId);
  }
}
