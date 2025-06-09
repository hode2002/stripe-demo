import { faker } from '@faker-js/faker';
import { Product } from '../product/entities/product.entity';

export function generateFakeProduct(): Product {
  return {
    name: faker.commerce.productName(),
    price: parseInt(faker.commerce.price({ min: 10000, max: 1000000 })),
  };
}

export function generateFakeProducts(count: number): Product[] {
  return Array.from({ length: count }, () => generateFakeProduct());
}
