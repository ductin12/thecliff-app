import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple token-based auth for admin routes
const ADMIN_COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes (except login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);

        if (!sessionCookie?.value) {
            // Redirect to login page
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verify session (simple check)
        try {
            const session = JSON.parse(sessionCookie.value);
            if (!session.authenticated || new Date(session.expiresAt) < new Date()) {
                const loginUrl = new URL('/admin/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        } catch {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Protect admin API routes
    if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
        const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        try {
            const session = JSON.parse(sessionCookie.value);
            if (!session.authenticated || new Date(session.expiresAt) < new Date()) {
                return NextResponse.json(
                    { success: false, error: 'Session expired' },
                    { status: 401 }
                );
            }
        } catch {
            return NextResponse.json(
                { success: false, error: 'Invalid session' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
    ],
};
