'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function TiktokPage() {
    const router = useRouter();

    useEffect(() => {
        const url = 'https://www.tiktok.com/@okaiccn_?is_from_webapp=1&sender_device=pc';
        trackClick('TikTok Source', url, 'tiktok').then(() => {
            window.location.href = url;
        });
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
