import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { StripeController } from './stripe.controller';

@Module({
  imports: [ConfigModule],
  controllers: [StripeController],
  providers: [
    {
      provide: 'STRIPE',
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get<string>('STRIPE_SECRET_KEY')!, {
          apiVersion: configService.get<string>(
            'STRIPE_API_VERSION',
          ) as Stripe.LatestApiVersion,
        });
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  exports: ['STRIPE', StripeService],
})
export class StripeModule {}
