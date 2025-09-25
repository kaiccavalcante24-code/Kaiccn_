'use client';

import { addDocumentNonBlocking, initializeFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export type ClickEvent = {
    linkId: string;
    label: string;
    href: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    trafficSource?: string;
    locationData?: any;
};

export async function trackClick(label: string, href: string, trafficSource: string = 'direct') {
    try {
        // Obtenha a instância do Firestore a partir da função de inicialização do cliente.
        const { firestore } = initializeFirebase();
        const clickEventsCollection = collection(firestore, 'click_events');

        let locationData = {};
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                locationData = await response.json();
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }

        const clickEvent: Omit<ClickEvent, 'linkId' | 'timestamp'> & { timestamp: any, locationData: string } = {
            label,
            href,
            trafficSource,
            userAgent: navigator.userAgent,
            ipAddress: (locationData as any).ip,
            locationData: JSON.stringify(locationData),
            timestamp: new Date(),
        };

        addDocumentNonBlocking(clickEventsCollection, clickEvent);

    } catch (error) {
        console.error("Error tracking click:", error);
    }
}
