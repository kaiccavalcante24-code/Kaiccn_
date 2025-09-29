'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/tracking';

export default function InstaPage() {
    const router = useRouter();

    useEffect(() => {
        const url = 'https://www.instagram.com/kaiccn_';
        trackClick('Instagram Source', url, 'instagram').then(() => {
            window.location.href = url;
        });
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <p>Redirecionando...</p>
        </div>
    );
}
