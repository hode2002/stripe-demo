import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class CartService {
  private readonly tableName = 'cart';

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: createCartDto.userId,
        product_id: createCartDto.productId,
        quantity: createCartDto.quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapCartFromDatabase(data);
  }

  async findAll(): Promise<Cart[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*');

    if (error) throw error;
    return data.map(this.mapCartFromDatabase);
  }

  async findOne(id: string): Promise<Cart> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException(`Cart with ID ${id} not found`);
    return this.mapCartFromDatabase(data);
  }

  async findByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
          id,
          quantity,
          product (
            id,
            name,
            price
          )
      `)
      .eq('user_id', userId)

    if (error) throw error;
    return data
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({
        quantity: updateCartDto.quantity,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException(`Cart with ID ${id} not found`);
    return this.mapCartFromDatabase(data);
  }

  async remove(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true
  }

  private mapCartFromDatabase(data: any): Cart {
    return {
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
    };
  }
}
