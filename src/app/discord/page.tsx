'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function DiscordPage() {
    const router = useRouter();

    useEffect(() => {
        trackClick('Discord Source', '/discord', 'discord').then(() => {
            router.push('/');
        });
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
