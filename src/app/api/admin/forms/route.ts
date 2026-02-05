import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmissions, updateFormSubmissionStatus, addFormSubmission, generateId, getTimestamp } from '@/lib/database';
import { HousekeepingSubmission, FoodOrderSubmission, SurveySubmission } from '@/types/admin';

// GET - Get form submissions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as 'housekeeping' | 'orderfood' | 'survey' | null;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
        const status = searchParams.get('status') || undefined;

        if (!type || !['housekeeping', 'orderfood', 'survey'].includes(type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing type. Must be: housekeeping, orderfood, or survey' },
                { status: 400 }
            );
        }

        const result = await getFormSubmissions(type, { page, pageSize, status });

        return NextResponse.json({
            success: true,
            data: result.data,
            total: result.total,
            page,
            pageSize,
            totalPages: Math.ceil(result.total / pageSize),
        });
    } catch (error) {
        console.error('Error fetching form submissions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch form submissions' },
            { status: 500 }
        );
    }
}

// POST - Create form submission (from guest app)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type } = body;

        if (!type || !['housekeeping', 'orderfood', 'survey'].includes(type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing type' },
                { status: 400 }
            );
        }

        const baseSubmission = {
            id: generateId(),
            status: 'pending' as const,
            createdAt: getTimestamp(),
            roomNumber: body.roomNumber,
            guestName: body.guestName,
            notes: body.notes,
        };

        let submission: HousekeepingSubmission | FoodOrderSubmission | SurveySubmission;

        if (type === 'housekeeping') {
            submission = {
                ...baseSubmission,
                type: 'housekeeping',
                requestType: body.requestType || 'cleaning',
                preferredTime: body.preferredTime,
            };
        } else if (type === 'orderfood') {
            submission = {
                ...baseSubmission,
                type: 'orderfood',
                items: body.items || [],
                deliveryTime: body.deliveryTime,
            };
        } else {
            submission = {
                ...baseSubmission,
                type: 'survey',
                phone: body.phone,
                email: body.email,
                checkIn: body.checkIn,
                checkOut: body.checkOut,
                rating: body.rating || 5,
                criteriaRatings: body.criteriaRatings,
                feedback: body.feedback || '',
            };
        }

        await addFormSubmission(type, submission);

        return NextResponse.json({
            success: true,
            data: submission,
            message: 'Form submitted successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating form submission:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create form submission' },
            { status: 500 }
        );
    }
}

// PATCH - Update form submission status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, id, status } = body;

        if (!type || !id || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: type, id, status' },
                { status: 400 }
            );
        }

        if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status' },
                { status: 400 }
            );
        }

        const updated = await updateFormSubmissionStatus(type, id, status);

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Submission not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Submission status updated successfully',
        });
    } catch (error) {
        console.error('Error updating submission status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update submission status' },
            { status: 500 }
        );
    }
}
