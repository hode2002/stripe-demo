'use client';

import { JSX, useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';

interface props {
    user: User | null;
    onSignOut: () => void;
}

export default function AccountDropdown({ user, onSignOut }: props): JSX.Element {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata.avatar_url} alt="User avatar" />
                    <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                        {user && (user?.user_metadata.full_name ?? user.email)}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user && user?.email}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="cursor-pointer"
                onClick={onSignOut}
            >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
} 