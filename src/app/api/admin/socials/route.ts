import { NextRequest, NextResponse } from 'next/server';
import { getAllSocialLinks, createSocialLink, getSocialLinkById, updateSocialLink, deleteSocialLink } from '@/lib/database';
import { AdminSocialLink } from '@/types/admin';

// GET - List all social links
export async function GET() {
    try {
        const socials = await getAllSocialLinks();
        return NextResponse.json({
            success: true,
            data: socials,
        });
    } catch (error) {
        console.error('Error fetching social links:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch social links' },
            { status: 500 }
        );
    }
}

// POST - Create new social link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, platform, url, displayInFooter, order, enabled, customIcon } = body as Partial<AdminSocialLink>;

        if (!id || !platform || !url || order === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: id, platform, url, order' },
                { status: 400 }
            );
        }

        const newSocial = await createSocialLink({
            id,
            platform,
            url,
            customIcon,
            displayInFooter: displayInFooter !== false,
            order,
            enabled: enabled !== false,
        });

        return NextResponse.json({
            success: true,
            data: newSocial,
            message: 'Social link created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating social link:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create social link' },
            { status: 500 }
        );
    }
}

// PUT - Update social link
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Social link ID is required' },
                { status: 400 }
            );
        }

        const existingSocial = await getSocialLinkById(id);
        if (!existingSocial) {
            return NextResponse.json(
                { success: false, error: 'Social link not found' },
                { status: 404 }
            );
        }

        const updatedSocial = await updateSocialLink(id, updates);

        return NextResponse.json({
            success: true,
            data: updatedSocial,
            message: 'Social link updated successfully',
        });
    } catch (error) {
        console.error('Error updating social link:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update social link' },
            { status: 500 }
        );
    }
}

// DELETE - Delete social link
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Social link ID is required' },
                { status: 400 }
            );
        }

        const deleted = await deleteSocialLink(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Social link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Social link deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting social link:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete social link' },
            { status: 500 }
        );
    }
}
