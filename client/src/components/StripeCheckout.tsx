"use client"

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

export default function StripeCheckout() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        fetch(`${baseUrl}/stripe/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: [
                    { productId: 'prod_1', quantity: 2 },
                    { productId: 'prod_2', quantity: 1 },
                ],
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                stripe?.redirectToCheckout({ sessionId: data.sessionId });
            });
    };
    return <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={handleCheckout}
        disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Checkout'}
    </button>;
}

