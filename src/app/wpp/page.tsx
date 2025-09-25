'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function WppPage() {
    const router = useRouter();

    useEffect(() => {
        trackClick('WhatsApp Source', '/wpp', 'whatsapp').then(() => {
            router.push('/');
        });
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
