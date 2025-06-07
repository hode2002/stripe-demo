'use client';

import { JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/components/cart-item';

export interface CartItemType {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    };
}

interface CartTableProps {
    items: CartItemType[];
    isLoading: boolean;
    onUpdate: () => void;
}

export function CartTable({ items, isLoading, onUpdate }: CartTableProps): JSX.Element {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Your cart is empty</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CartItem
                    key={item.id}
                    {...item}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
} 