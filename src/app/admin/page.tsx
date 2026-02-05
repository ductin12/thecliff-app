'use client';

import { useState, useEffect } from 'react';

interface AnalyticsSummary {
    totalPageViews: number;
    totalButtonClicks: number;
    buttonClicksByTarget: Record<string, number>;
    dailyStats: { date: string; pageViews: number; buttonClicks: number }[];
}

interface FormCounts {
    housekeeping: number;
    orderfood: number;
    survey: number;
}

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
    const [formCounts, setFormCounts] = useState<FormCounts>({ housekeeping: 0, orderfood: 0, survey: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [analyticsRes, housekeepingRes, orderfoodRes, surveyRes] = await Promise.all([
                fetch('/api/admin/analytics'),
                fetch('/api/admin/forms?type=housekeeping&pageSize=1'),
                fetch('/api/admin/forms?type=orderfood&pageSize=1'),
                fetch('/api/admin/forms?type=survey&pageSize=1'),
            ]);

            const analyticsData = await analyticsRes.json();
            const housekeepingData = await housekeepingRes.json();
            const orderfoodData = await orderfoodRes.json();
            const surveyData = await surveyRes.json();

            if (analyticsData.success) {
                setAnalytics(analyticsData.data);
            }

            setFormCounts({
                housekeeping: housekeepingData.total || 0,
                orderfood: orderfoodData.total || 0,
                survey: surveyData.total || 0,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Page Views (7 days)', value: analytics?.totalPageViews || 0, icon: '👁️', color: 'bg-blue-500' },
        { title: 'Button Clicks (7 days)', value: analytics?.totalButtonClicks || 0, icon: '👆', color: 'bg-green-500' },
        { title: 'Housekeeping Requests', value: formCounts.housekeeping, icon: '🧹', color: 'bg-purple-500' },
        { title: 'Total Surveys', value: formCounts.survey, icon: '⭐', color: 'bg-yellow-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A4D2E]"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`${stat.color} text-white p-3 rounded-lg text-2xl`}>
                                {stat.icon}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Button Clicks Chart */}
            {analytics && analytics.buttonClicksByTarget && Object.keys(analytics.buttonClicksByTarget).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Button Clicks by Target</h2>
                    <div className="space-y-3">
                        {Object.entries(analytics.buttonClicksByTarget)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([target, count]) => {
                                const maxCount = Math.max(...Object.values(analytics.buttonClicksByTarget));
                                const percentage = (count / maxCount) * 100;
                                return (
                                    <div key={target}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{target}</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#1A4D2E] rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Daily Stats */}
            {analytics && analytics.dailyStats && analytics.dailyStats.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Activity (Last 7 Days)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium text-center">Page Views</th>
                                    <th className="pb-3 font-medium text-center">Button Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.dailyStats.map((day) => (
                                    <tr key={day.date} className="border-b last:border-0">
                                        <td className="py-3 text-gray-800">
                                            {new Date(day.date).toLocaleDateString('vi-VN', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                {day.pageViews}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                                {day.buttonClicks}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                    href="/admin/buttons"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🔘</span>
                        <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-[#1A4D2E]">Manage Buttons</h3>
                            <p className="text-sm text-gray-500">Add, edit, or remove service buttons</p>
                        </div>
                    </div>
                </a>
                <a
                    href="/admin/forms"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">📝</span>
                        <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-[#1A4D2E]">View Submissions</h3>
                            <p className="text-sm text-gray-500">Check housekeeping and survey forms</p>
                        </div>
                    </div>
                </a>
                <a
                    href="/admin/webhooks"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🔗</span>
                        <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-[#1A4D2E]">Configure Webhooks</h3>
                            <p className="text-sm text-gray-500">Set up data integrations</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}
