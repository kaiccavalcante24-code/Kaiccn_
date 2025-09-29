'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function WppPage() {
    const router = useRouter();

    useEffect(() => {
        const url = 'https://chat.whatsapp.com/GznPLfRztSvGBBDcZgH08A';
        trackClick('WhatsApp Source', url, 'whatsapp').then(() => {
            window.location.href = url;
        });
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
