'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Buttons', path: '/admin/buttons', icon: '🔘' },
    { name: 'Phone Numbers', path: '/admin/phones', icon: '📞' },
    { name: 'Social Links', path: '/admin/socials', icon: '🌐' },
    { name: 'Form Submissions', path: '/admin/forms', icon: '📝' },
    { name: 'Webhooks', path: '/admin/webhooks', icon: '🔗' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth', { method: 'DELETE' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Don't show layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1A4D2E] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-center h-16 border-b border-white/20">
                    <h1 className="text-xl font-bold">🏨 The Cliff Admin</h1>
                </div>

                <nav className="mt-6 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path ||
                            (item.path !== '/admin' && pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                    >
                        <span className="text-xl">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 lg:flex-none" />

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm text-[#1A4D2E] hover:underline flex items-center gap-1"
                        >
                            <span>👁️</span>
                            <span>View App</span>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
