'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function DiscordPage() {
    const router = useRouter();

    useEffect(() => {
        const url = 'https://discord.gg/yDXTRvJCuQ';
        trackClick('Discord Source', url, 'discord').then(() => {
            window.location.href = url;
        });
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
