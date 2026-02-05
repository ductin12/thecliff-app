'use client';

import { useState, useEffect, useCallback } from 'react';
import { HousekeepingSubmission, FoodOrderSubmission, SurveySubmission } from '@/types/admin';

type FormType = 'housekeeping' | 'orderfood' | 'survey';
type FormSubmission = HousekeepingSubmission | FoodOrderSubmission | SurveySubmission;

const FORM_TABS = [
    { id: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
    { id: 'orderfood', label: 'Food Orders', icon: '🍔' },
    { id: 'survey', label: 'Surveys', icon: '⭐' },
];

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function FormsManagementPage() {
    const [activeTab, setActiveTab] = useState<FormType>('housekeeping');
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/admin/forms?type=${activeTab}&page=${page}&pageSize=${pageSize}`
            );
            const data = await response.json();
            if (data.success) {
                setSubmissions(data.data);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const response = await fetch('/api/admin/forms', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: activeTab, id, status }),
            });
            const data = await response.json();
            if (data.success) {
                fetchSubmissions();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const exportToCSV = () => {
        if (submissions.length === 0) return;

        let headers: string[] = [];
        let rows: string[][] = [];

        if (activeTab === 'housekeeping') {
            headers = ['ID', 'Room', 'Guest Name', 'Request Type', 'Preferred Time', 'Notes', 'Status', 'Created At'];
            rows = (submissions as HousekeepingSubmission[]).map(s => [
                s.id,
                s.roomNumber || '',
                s.guestName || '',
                s.requestType,
                s.preferredTime || '',
                s.notes || '',
                s.status,
                s.createdAt,
            ]);
        } else if (activeTab === 'orderfood') {
            headers = ['ID', 'Room', 'Guest Name', 'Items', 'Delivery Time', 'Notes', 'Status', 'Created At'];
            rows = (submissions as FoodOrderSubmission[]).map(s => [
                s.id,
                s.roomNumber || '',
                s.guestName || '',
                s.items?.map(i => `${i.name}(${i.quantity})`).join(', ') || '',
                s.deliveryTime || '',
                s.notes || '',
                s.status,
                s.createdAt,
            ]);
        } else {
            headers = ['ID', 'Room', 'Guest Name', 'Rating', 'Feedback', 'Status', 'Created At'];
            rows = (submissions as SurveySubmission[]).map(s => [
                s.id,
                s.roomNumber || '',
                s.guestName || '',
                String(s.rating),
                s.feedback || '',
                s.status,
                s.createdAt,
            ]);
        }

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${activeTab}_submissions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Form Submissions</h1>
                <button
                    onClick={exportToCSV}
                    disabled={submissions.length === 0}
                    className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <span>📥</span>
                    Export CSV
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {FORM_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as FormType);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-[#1A4D2E] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A4D2E]"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        No submissions yet
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Room</th>
                                        <th className="px-4 py-3 text-left font-medium">Guest</th>
                                        {activeTab === 'housekeeping' && (
                                            <th className="px-4 py-3 text-left font-medium">Request Type</th>
                                        )}
                                        {activeTab === 'orderfood' && (
                                            <th className="px-4 py-3 text-left font-medium">Items</th>
                                        )}
                                        {activeTab === 'survey' && (
                                            <>
                                                <th className="px-4 py-3 text-left font-medium">Rating</th>
                                                <th className="px-4 py-3 text-left font-medium">Feedback</th>
                                            </>
                                        )}
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Date</th>
                                        <th className="px-4 py-3 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">{submission.roomNumber || '-'}</td>
                                            <td className="px-4 py-3">{submission.guestName || '-'}</td>

                                            {activeTab === 'housekeeping' && (
                                                <td className="px-4 py-3 capitalize">
                                                    {(submission as HousekeepingSubmission).requestType}
                                                </td>
                                            )}

                                            {activeTab === 'orderfood' && (
                                                <td className="px-4 py-3">
                                                    {(submission as FoodOrderSubmission).items?.length || 0} items
                                                </td>
                                            )}

                                            {activeTab === 'survey' && (
                                                <>
                                                    <td className="px-4 py-3">
                                                        {'⭐'.repeat((submission as SurveySubmission).rating)}
                                                    </td>
                                                    <td className="px-4 py-3 max-w-xs truncate">
                                                        {(submission as SurveySubmission).feedback}
                                                    </td>
                                                </>
                                            )}

                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[submission.status]}`}>
                                                    {submission.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(submission.createdAt).toLocaleDateString('vi-VN')}
                                            </td>

                                            <td className="px-4 py-3">
                                                <select
                                                    value={submission.status}
                                                    onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                                                    className="text-xs px-2 py-1 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
