'use client';

import { JSX } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItemType } from '@/components/cart-table';
import StripeCheckout from '@/components/StripeCheckout';

interface CartSummaryProps {
    items: CartItemType[];
}

export function CartSummary({ items }: CartSummaryProps): JSX.Element {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
            </CardContent>
            <CardFooter>
                <StripeCheckout items={items.map(e => ({
                    productId: e.product.id,
                    quantity: e.quantity
                }))} />
            </CardFooter>
        </Card>
    );
} 