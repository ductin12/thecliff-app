import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/database';

// GET - Get analytics summary
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7', 10);

        const summary = await getAnalyticsSummary(days);

        return NextResponse.json({
            success: true,
            data: summary,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
