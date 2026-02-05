import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/database';

// POST - Track an analytics event (public endpoint)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, target, metadata } = body;

        // Validate event type
        if (!type || !['page_view', 'button_click'].includes(type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid event type' },
                { status: 400 }
            );
        }

        // Get user agent and locale from headers
        const userAgent = request.headers.get('user-agent') || undefined;
        const acceptLanguage = request.headers.get('accept-language');
        const locale = acceptLanguage?.split(',')[0]?.split('-')[0] || undefined;

        // Track the event
        await trackEvent({
            type,
            target,
            metadata,
            userAgent,
            locale,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to track event' },
            { status: 500 }
        );
    }
}
