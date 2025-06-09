'use client';

import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import AccountDropdown from './account-dropdown';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { ClipboardList, ShoppingCart } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
];

export default function Header(): JSX.Element {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        fetchUser();
    }, []);

    const handleSignOut = async () => {
        setUser(null);
        router.push('/signin');
        await supabase.auth.signOut();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">Stripe Supabase</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'transition-colors hover:text-foreground/80',
                                    pathname === item.href
                                        ? 'text-foreground'
                                        : 'text-foreground/60'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {user
                        ? <>
                            <Link href="/purchase">
                                <ClipboardList />
                            </Link>
                            <Link href="/cart">
                                <ShoppingCart />
                            </Link>
                            <AccountDropdown user={user} onSignOut={handleSignOut} />
                        </>
                        : <Link href="/signin">Sign In</Link>}
                </div>
            </div>
        </header>
    );
} 