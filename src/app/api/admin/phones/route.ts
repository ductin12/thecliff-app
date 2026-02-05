import { NextRequest, NextResponse } from 'next/server';
import { getAllPhoneNumbers, createPhoneNumber, getPhoneNumberById, updatePhoneNumber, deletePhoneNumber } from '@/lib/database';
import { AdminPhoneNumber } from '@/types/admin';

// GET - List all phone numbers
export async function GET() {
    try {
        const phones = await getAllPhoneNumbers();
        return NextResponse.json({
            success: true,
            data: phones,
        });
    } catch (error) {
        console.error('Error fetching phone numbers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch phone numbers' },
            { status: 500 }
        );
    }
}

// POST - Create new phone number
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, label, number, type, displayInFooter, order, enabled } = body as Partial<AdminPhoneNumber>;

        if (!id || !label || !number || !type || order === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: id, label, number, type, order' },
                { status: 400 }
            );
        }

        const newPhone = await createPhoneNumber({
            id,
            label,
            number,
            type,
            displayInFooter: displayInFooter !== false,
            order,
            enabled: enabled !== false,
        });

        return NextResponse.json({
            success: true,
            data: newPhone,
            message: 'Phone number created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating phone number:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create phone number' },
            { status: 500 }
        );
    }
}

// PUT - Update phone number
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Phone ID is required' },
                { status: 400 }
            );
        }

        const existingPhone = await getPhoneNumberById(id);
        if (!existingPhone) {
            return NextResponse.json(
                { success: false, error: 'Phone number not found' },
                { status: 404 }
            );
        }

        const updatedPhone = await updatePhoneNumber(id, updates);

        return NextResponse.json({
            success: true,
            data: updatedPhone,
            message: 'Phone number updated successfully',
        });
    } catch (error) {
        console.error('Error updating phone number:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update phone number' },
            { status: 500 }
        );
    }
}

// DELETE - Delete phone number
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Phone ID is required' },
                { status: 400 }
            );
        }

        const deleted = await deletePhoneNumber(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Phone number not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Phone number deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting phone number:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete phone number' },
            { status: 500 }
        );
    }
}
