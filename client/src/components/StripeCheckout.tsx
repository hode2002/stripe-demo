"use client"

import { httpClient } from '@/lib/http/http-client';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CheckoutItem {
    productId: string;
    quantity: number;
}

export default function StripeCheckout({ items }: { items: CheckoutItem[] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [stripe, setStripe] = useState<Stripe | null>(null);

    useEffect(() => {
        const initializeStripe = async () => {
            const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            setStripe(stripeInstance);
        };
        initializeStripe();
    }, []);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const { sessionId } = await httpClient.post<{ sessionId: string }>(`/stripe/checkout`, { items })
            return stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.error('Failed to process checkout');
        } finally {
            setIsLoading(false);
        }
    };

    return <button
        className="ml-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={handleCheckout}
        disabled={isLoading || !stripe}>
        {isLoading ? 'Loading...' : 'Checkout'}
    </button>;
}

