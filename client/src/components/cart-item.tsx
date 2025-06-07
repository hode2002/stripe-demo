'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { httpClient } from '@/lib/http/http-client';

interface CartItemProps {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    onUpdate: () => void;
}

export function CartItem({ id, product, quantity, onUpdate }: CartItemProps): JSX.Element {

    const handleRemove = async (): Promise<void> => {
        try {
            await httpClient.delete(`/cart/${id}`);
            toast.success('Item removed from cart');
            onUpdate();
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={handleRemove}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 