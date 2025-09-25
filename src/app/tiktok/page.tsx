'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function TiktokPage() {
    const router = useRouter();

    useEffect(() => {
        trackClick('TikTok Source', '/tiktok', 'tiktok').then(() => {
            router.push('/');
        });
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
