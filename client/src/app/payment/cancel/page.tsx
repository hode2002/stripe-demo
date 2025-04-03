'use client';

import React from 'react';
import Link from 'next/link';

const Cancel = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Thanh toán đã bị hủy</h1>
            <p className="text-lg">Bạn đã hủy thanh toán. <Link href="/">Quay lại trang chính</Link>.</p>
        </div>
    );
};

export default Cancel;