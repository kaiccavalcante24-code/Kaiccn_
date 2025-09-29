'use client';

import { addDoc, collection, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

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

// Initialize Firebase once and get the firestore instance
const { firestore } = initializeFirebase();
const clickEventsCollection = collection(firestore, 'click_events');

export async function trackClick(label: string, href: string, trafficSource: string = 'direct') {
    try {
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

        // Use addDoc for non-blocking write
        addDoc(clickEventsCollection, clickEvent).catch(error => {
            console.error("Error writing click event to Firestore:", error);
        });

    } catch (error) {
        console.error("Error tracking click:", error);
    }
}
