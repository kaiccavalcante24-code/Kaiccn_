'use client';

import { addDocumentNonBlocking } from "@/firebase";
import { collection, getFirestore } from "firebase/firestore";

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
        const firestore = getFirestore();
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
