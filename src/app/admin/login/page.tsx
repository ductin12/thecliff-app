'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const redirectTo = searchParams.get('from') || '/admin';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            router.push(redirectTo);
        } catch {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="text-6xl mb-4">🏨</div>
                <h1 className="text-2xl font-bold text-gray-800">The Cliff Resort</h1>
                <p className="text-gray-500 mt-1">Admin Panel</p>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4D2E] focus:border-transparent outline-none transition-all"
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full bg-[#1A4D2E] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2d7a4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            {/* Back link */}
            <div className="mt-6 text-center">
                <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-[#1A4D2E] transition-colors"
                >
                    ← Back to App
                </Link>
            </div>
        </div>
    );
}

function LoginFormFallback() {
    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-8">
                <div className="text-6xl mb-4">🏨</div>
                <h1 className="text-2xl font-bold text-gray-800">The Cliff Resort</h1>
                <p className="text-gray-500 mt-1">Admin Panel</p>
            </div>
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A4D2E]"></div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A4D2E] to-[#2d7a4a] flex items-center justify-center p-4">
            <Suspense fallback={<LoginFormFallback />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
