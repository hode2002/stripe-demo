'use client'

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';

export default function AuthSuccess() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    throw error;
                }

                if (user) {
                    router.push('/');
                } else {
                    router.push('/signin');
                }
            } catch (error) {
                console.error('Auth error:', error);
                router.push('/signin');
            }
        };

        handleAuth();
    }, [router, supabase.auth]);

    return (
        <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
            <Card className="w-[350px] mx-auto">
                <CardContent className="flex flex-col items-center justify-center p-6">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-center text-muted-foreground">
                        Authenticating...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
