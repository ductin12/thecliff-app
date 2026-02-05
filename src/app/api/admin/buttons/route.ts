import { NextRequest, NextResponse } from 'next/server';
import { getAllButtons, createButton, reorderButtons } from '@/lib/database';
import { AdminButton } from '@/types/admin';

// GET - List all buttons
export async function GET() {
    try {
        const buttons = await getAllButtons();
        return NextResponse.json({
            success: true,
            data: buttons,
        });
    } catch (error) {
        console.error('Error fetching buttons:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch buttons' },
            { status: 500 }
        );
    }
}

// POST - Create new button or reorder buttons
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check if this is a reorder request
        if (body.action === 'reorder' && Array.isArray(body.buttonIds)) {
            const buttons = await reorderButtons(body.buttonIds);
            return NextResponse.json({
                success: true,
                data: buttons,
                message: 'Buttons reordered successfully',
            });
        }

        // Validate required fields for new button
        const { id, name, icon, action, position, order, enabled } = body as Partial<AdminButton>;

        if (!id || !name || !icon || !action || !position || order === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: id, name, icon, action, position, order' },
                { status: 400 }
            );
        }

        const newButton = await createButton({
            id,
            name,
            icon,
            action,
            position,
            order,
            enabled: enabled !== false,
            url: body.url,
            phone: body.phone,
            email: body.email,
            modalType: body.modalType,
            customStyle: body.customStyle,
        });

        return NextResponse.json({
            success: true,
            data: newButton,
            message: 'Button created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating button:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create button' },
            { status: 500 }
        );
    }
}
