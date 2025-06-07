'use client'

import { JSX } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { httpClient } from '@/lib/http/http-client';

interface Product {
    id: string;
    name: string;
    price: number;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleAddToCart = async (): Promise<void> => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            toast.error('Please sign in to add items to cart');
            router.push('/signin');
            return;
        }

        try {
            const cartItem = {
                productId: product.id,
                userId: session.user.id,
                quantity: 1,
            }

            await httpClient.post('/cart', cartItem);
            toast.success('Product added to cart');
        } catch (err) {
            toast.error('Failed to add product to cart');
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
} 