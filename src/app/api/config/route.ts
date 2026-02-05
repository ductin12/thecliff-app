import { NextResponse } from 'next/server';
import { getButtons, getPhoneNumbers, getSocialLinks, getSettings } from '@/lib/database';

// GET - Public config API for guest app
export async function GET() {
    try {
        const [buttons, phoneNumbers, socialLinks, settings] = await Promise.all([
            getButtons(),
            getPhoneNumbers(),
            getSocialLinks(),
            getSettings(),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                buttons,
                phoneNumbers,
                socialLinks,
                settings: {
                    wifiSsid: settings.wifiSsid,
                    wifiPassword: settings.wifiPassword,
                    wifiSecurityType: settings.wifiSecurityType,
                    defaultLocale: settings.defaultLocale,
                    supportedLocales: settings.supportedLocales,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching config:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch config' },
            { status: 500 }
        );
    }
}
