'use client';

import { JSX } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CartItemType, CartTable } from '@/components/cart-table';
import { CartSummary } from '@/components/cart-summary';
import { useFetch } from '@/hooks/use-fetch';

export default function CartPage(): JSX.Element {
    const { data: cartItems, isLoading, error, refetch } = useFetch<CartItemType[]>('/cart/user');

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {cartItems && <CartTable
                        items={cartItems}
                        isLoading={isLoading}
                        onUpdate={refetch}
                    />}
                </div>
                <div>
                    {cartItems && <CartSummary
                        items={cartItems}
                    />}
                </div>
            </div>
        </div>
    );
} 