'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Success = () => {
    const router = useRouter();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
            <p className="text-lg">Cảm ơn bạn đã mua hàng. Bạn sẽ được chuyển hướng về trang chính trong 5 giây...</p>
            <p>
                Nếu không tự động chuyển hướng,{' '}
                <Link href="/" className="text-blue-500 hover:text-blue-700">
                    nhấn vào đây
                </Link>.
            </p>
        </div>
    );
};

export default Success;