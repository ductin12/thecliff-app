'use client';

import { useEffect, useCallback, useRef } from 'react';

// Track analytics events
export function useAnalytics() {
    const hasTrackedPageView = useRef(false);

    // Track page view on mount (only once)
    useEffect(() => {
        if (hasTrackedPageView.current) return;
        hasTrackedPageView.current = true;

        trackEvent('page_view', 'home');
    }, []);

    // Track button click
    const trackButtonClick = useCallback((buttonId: string, buttonName?: string) => {
        trackEvent('button_click', buttonId, { name: buttonName });
    }, []);

    return { trackButtonClick };
}

// Helper function to send tracking event
async function trackEvent(
    type: 'page_view' | 'button_click',
    target?: string,
    metadata?: Record<string, string | number | undefined>
) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, target, metadata }),
        });
    } catch (error) {
        // Silently fail - analytics should not break the app
        console.debug('Analytics tracking failed:', error);
    }
}
