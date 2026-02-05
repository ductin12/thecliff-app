import { NextRequest, NextResponse } from 'next/server';
import { getWebhooks, createWebhook, getWebhookById, updateWebhook, deleteWebhook } from '@/lib/database';
import { AdminWebhook } from '@/types/admin';

// GET - List all webhooks
export async function GET() {
    try {
        const webhooks = await getWebhooks();
        return NextResponse.json({
            success: true,
            data: webhooks,
        });
    } catch (error) {
        console.error('Error fetching webhooks:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch webhooks' },
            { status: 500 }
        );
    }
}

// POST - Create new webhook or test webhook
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Test webhook
        if (body.action === 'test' && body.webhookId) {
            const webhook = await getWebhookById(body.webhookId);
            if (!webhook) {
                return NextResponse.json(
                    { success: false, error: 'Webhook not found' },
                    { status: 404 }
                );
            }

            try {
                const testPayload = {
                    event: 'test',
                    data: { message: 'This is a test webhook from The Cliff Resort Admin' },
                    timestamp: new Date().toISOString(),
                };

                const response = await fetch(webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...webhook.headers,
                    },
                    body: JSON.stringify(testPayload),
                });

                return NextResponse.json({
                    success: true,
                    message: `Webhook test sent. Status: ${response.status}`,
                    status: response.status,
                });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    error: `Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                }, { status: 500 });
            }
        }

        // Create new webhook
        const { name, url, events, headers, enabled, retryPolicy } = body as Partial<AdminWebhook>;

        if (!name || !url || !events || events.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: name, url, events' },
                { status: 400 }
            );
        }

        const newWebhook = await createWebhook({
            name,
            url,
            events,
            headers,
            enabled: enabled !== false,
            retryPolicy,
        });

        return NextResponse.json({
            success: true,
            data: newWebhook,
            message: 'Webhook created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating webhook:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create webhook' },
            { status: 500 }
        );
    }
}

// PUT - Update webhook
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Webhook ID is required' },
                { status: 400 }
            );
        }

        const existingWebhook = await getWebhookById(id);
        if (!existingWebhook) {
            return NextResponse.json(
                { success: false, error: 'Webhook not found' },
                { status: 404 }
            );
        }

        const updatedWebhook = await updateWebhook(id, updates);

        return NextResponse.json({
            success: true,
            data: updatedWebhook,
            message: 'Webhook updated successfully',
        });
    } catch (error) {
        console.error('Error updating webhook:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update webhook' },
            { status: 500 }
        );
    }
}

// DELETE - Delete webhook
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Webhook ID is required' },
                { status: 400 }
            );
        }

        const deleted = await deleteWebhook(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Webhook not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Webhook deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting webhook:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete webhook' },
            { status: 500 }
        );
    }
}
