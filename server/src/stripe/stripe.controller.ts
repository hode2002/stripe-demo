import { Controller, Post, Body, Req, Headers, Get, Inject } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SupabaseClient } from '@supabase/supabase-js';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

@Controller('stripe')
export class StripeController {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
    private readonly stripeService: StripeService
  ) { }

  @Get()
  async getPayments(@CurrentUser() user: any): Promise<Payment[] | { message: string }> {
    const { data: payments, error } = await this.supabase
      .from('payment')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !payments) {
      return { message: 'No payments found for this user.' };
    }
    return payments as Payment[];
  }

  @Post('checkout')
  async checkout(
    @CurrentUser() user: any,
    @Body()
    body: {
      items: { productId: string; quantity: number }[];
    },
  ) {
    const session = await this.stripeService.createCheckoutSession(
      user,
      body.items,
      'http://localhost:3000/payment/success',
      'http://localhost:3000/payment/cancel',
    );

    return { sessionId: session.id };
  }

  @Public()
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
