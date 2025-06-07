import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get('user')
  findByUserId(@CurrentUser() user: any) {
    return this.cartService.findByUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto): Promise<Cart> {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.cartService.remove(id);
  }
}
