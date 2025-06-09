'use client';

import { JSX } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetch } from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { httpClient } from '@/lib/http/http-client';
import { useState } from 'react';

interface StripePayment {
    id: string;
    created_at: string;
    method: string;
    status: 'paid' | 'pending' | 'failed';
    amount_total: number;
    payment_intent: string;
    checkout_id: string;
    user_id: string;
}

const getPaymentStatusColor = (status: StripePayment['status']) => {
    switch (status) {
        case 'paid':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'failed':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
};

export default function PurchasePage(): JSX.Element {
    const { data: payments, isLoading, error, refetch } = useFetch<StripePayment[]>('/stripe');
    const [refundingId, setRefundingId] = useState<string | null>(null);

    const handleRefund = async (paymentId: string): Promise<void> => {
        try {
            setRefundingId(paymentId);
            const payment = payments?.find((p) => p.id === paymentId);
            if (!payment) {
                toast.error('Payment not found');
                return;
            }
            if (payment.status !== 'paid') {
                toast.error('Only paid payments can be refunded');
                return;
            }
            await httpClient.post(`/stripe/refund`, { paymentIntentId: payment.payment_intent });
            toast.success('Payment refunded successfully');
            refetch();
        } catch (err) {
            toast.error('Failed to refund payment');
        } finally {
            setRefundingId(null);
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Payment History</h1>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Payment History</h1>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No payments found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Payment History</h1>
            <div className="space-y-4">
                {payments.map((payment) => (
                    <Card key={payment.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Payment #{payment.id}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getPaymentStatusColor(payment.status)}>
                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {format(new Date(payment.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>Payment Intent</span>
                                        <span>{payment.payment_intent}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>Checkout ID</span>
                                        <span>{payment.checkout_id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>Payment Method</span>
                                        <span className="capitalize">{payment.method}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold">
                                        <span>Total Amount</span>
                                        <span className="ml-2">${formatAmount(payment.amount_total)}</span>
                                    </div>
                                    {payment.status === 'paid' && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRefund(payment.id)}
                                            disabled={refundingId === payment.id}
                                        >
                                            {refundingId === payment.id ? 'Refunding...' : 'Refund'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
