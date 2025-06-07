import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SupabaseModule } from 'src/supabse/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule { }
