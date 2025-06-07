import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SupabaseClient } from '@supabase/supabase-js';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class ProductService {
  private readonly tableName = 'product';

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) { }

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new InternalServerErrorException(
        `Database error: ${error.message}`,
      );
    }
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(createProductDto)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(
          `Failed to create product: ${error.message}`,
        );
      }
      if (!data) {
        throw new InternalServerErrorException(
          'Failed to create product: No data returned',
        );
      }
      return data as Product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*');

      if (error) {
        throw new InternalServerErrorException(
          `Failed to fetch products: ${error.message}`,
        );
      }
      return (data || []) as Product[];
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new InternalServerErrorException(
          `Failed to fetch product: ${error.message}`,
        );
      }
      if (!data) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return data as Product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updateProductDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException(
          `Failed to update product: ${error.message}`,
        );
      }
      if (!data) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return data as Product;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to delete product: ${error.message}`,
        );
      }
      return { message: `Product with ID ${id} has been deleted` };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string): Promise<Product> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === '22P02') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }

    if (!data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return data;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .in('id', ids);

    if (error) {
      throw error;
    }

    return data || [];
  }
}
