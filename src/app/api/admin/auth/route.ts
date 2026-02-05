import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// POST - Login
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Create session
        const session = {
            authenticated: true,
            expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString(),
        };

        // Set cookie
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
        });

        response.cookies.set(ADMIN_COOKIE_NAME, JSON.stringify(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_DURATION / 1000,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}

// DELETE - Logout
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(ADMIN_COOKIE_NAME);

        return NextResponse.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, error: 'Logout failed' },
            { status: 500 }
        );
    }
}

// GET - Check session
export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return NextResponse.json({
                success: true,
                authenticated: false,
            });
        }

        const session = JSON.parse(sessionCookie.value);
        const isValid = session.authenticated && new Date(session.expiresAt) > new Date();

        return NextResponse.json({
            success: true,
            authenticated: isValid,
            expiresAt: session.expiresAt,
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({
            success: true,
            authenticated: false,
        });
    }
}
