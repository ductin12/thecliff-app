import { NextRequest, NextResponse } from 'next/server';
import { getButtonById, updateButton, deleteButton } from '@/lib/database';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single button
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const button = await getButtonById(id);

        if (!button) {
            return NextResponse.json(
                { success: false, error: 'Button not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: button,
        });
    } catch (error) {
        console.error('Error fetching button:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch button' },
            { status: 500 }
        );
    }
}

// PUT - Update button
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedButton = await updateButton(id, body);

        if (!updatedButton) {
            return NextResponse.json(
                { success: false, error: 'Button not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedButton,
            message: 'Button updated successfully',
        });
    } catch (error) {
        console.error('Error updating button:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update button' },
            { status: 500 }
        );
    }
}

// DELETE - Delete button
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const deleted = await deleteButton(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Button not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Button deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting button:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete button' },
            { status: 500 }
        );
    }
}
