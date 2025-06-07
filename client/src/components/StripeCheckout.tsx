"use client"

import { httpClient } from '@/lib/http/http-client';
import { loadStripe } from '@stripe/stripe-js';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

interface CheckoutItem {
    productId: string;
    quantity: number;
}

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckout({ items }: { items: CheckoutItem[] }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        const res = await httpClient.post<AxiosResponse>(`/stripe/checkout`, { items })
        return stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
    };

    return <button
        className="ml-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={handleCheckout}
        disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Checkout'}
    </button>;
}

