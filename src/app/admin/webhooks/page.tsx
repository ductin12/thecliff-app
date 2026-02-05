'use client';

import { useState, useEffect } from 'react';
import { AdminWebhook, WebhookEvent } from '@/types/admin';

const EVENT_OPTIONS: { value: WebhookEvent; label: string }[] = [
    { value: 'form_submit', label: 'Form Submissions' },
    { value: 'button_click', label: 'Button Clicks' },
    { value: 'page_view', label: 'Page Views' },
];

export default function WebhooksManagementPage() {
    const [webhooks, setWebhooks] = useState<AdminWebhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingWebhook, setEditingWebhook] = useState<AdminWebhook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState<string | null>(null);

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        try {
            const response = await fetch('/api/admin/webhooks');
            const data = await response.json();
            if (data.success) {
                setWebhooks(data.data);
            }
        } catch (error) {
            console.error('Error fetching webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (webhook: Partial<AdminWebhook>) => {
        setSaving(true);
        try {
            const isNew = !editingWebhook?.createdAt;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch('/api/admin/webhooks', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(webhook),
            });

            const data = await response.json();
            if (data.success) {
                fetchWebhooks();
                setIsModalOpen(false);
                setEditingWebhook(null);
            } else {
                alert(data.error || 'Failed to save webhook');
            }
        } catch (error) {
            console.error('Error saving webhook:', error);
            alert('Failed to save webhook');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return;

        try {
            const response = await fetch(`/api/admin/webhooks?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchWebhooks();
            } else {
                alert(data.error || 'Failed to delete webhook');
            }
        } catch (error) {
            console.error('Error deleting webhook:', error);
            alert('Failed to delete webhook');
        }
    };

    const handleToggle = async (webhook: AdminWebhook) => {
        try {
            const response = await fetch('/api/admin/webhooks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: webhook.id, enabled: !webhook.enabled }),
            });
            const data = await response.json();
            if (data.success) {
                fetchWebhooks();
            }
        } catch (error) {
            console.error('Error toggling webhook:', error);
        }
    };

    const handleTest = async (id: string) => {
        setTesting(id);
        try {
            const response = await fetch('/api/admin/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'test', webhookId: id }),
            });
            const data = await response.json();
            if (data.success) {
                alert(`Test webhook sent! Status: ${data.status}`);
            } else {
                alert(data.error || 'Test failed');
            }
        } catch (error) {
            console.error('Error testing webhook:', error);
            alert('Test failed');
        } finally {
            setTesting(null);
        }
    };

    const openNewModal = () => {
        setEditingWebhook({
            id: '',
            name: '',
            url: '',
            events: ['form_submit'],
            enabled: true,
        });
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A4D2E]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Webhooks</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Configure webhooks to push data to external services
                    </p>
                </div>
                <button
                    onClick={openNewModal}
                    className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors flex items-center gap-2"
                >
                    <span>➕</span>
                    Add Webhook
                </button>
            </div>

            {webhooks.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm px-6 py-12 text-center">
                    <span className="text-6xl block mb-4">🔗</span>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No webhooks configured</h3>
                    <p className="text-gray-500 mb-4">
                        Set up webhooks to receive real-time notifications when events occur
                    </p>
                    <button
                        onClick={openNewModal}
                        className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors"
                    >
                        Add First Webhook
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {webhooks.map((webhook) => (
                        <div
                            key={webhook.id}
                            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${webhook.enabled ? 'border-green-500' : 'border-gray-300'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">{webhook.name}</h3>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${webhook.enabled
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {webhook.enabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-3 font-mono break-all">{webhook.url}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {webhook.events.map((event) => (
                                            <span
                                                key={event}
                                                className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700"
                                            >
                                                {EVENT_OPTIONS.find(e => e.value === event)?.label || event}
                                            </span>
                                        ))}
                                    </div>

                                    {webhook.lastTriggered && (
                                        <p className="text-xs text-gray-400 mt-3">
                                            Last triggered: {new Date(webhook.lastTriggered).toLocaleString('vi-VN')}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleTest(webhook.id)}
                                        disabled={testing === webhook.id || !webhook.enabled}
                                        className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {testing === webhook.id ? '⏳' : '🧪'}
                                        Test
                                    </button>
                                    <button
                                        onClick={() => handleToggle(webhook)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={webhook.enabled ? 'Disable' : 'Enable'}
                                    >
                                        {webhook.enabled ? '⏸️' : '▶️'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingWebhook(webhook);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(webhook.id)}
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && editingWebhook && (
                <WebhookEditModal
                    webhook={editingWebhook}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingWebhook(null);
                    }}
                    saving={saving}
                />
            )}
        </div>
    );
}

interface WebhookEditModalProps {
    webhook: AdminWebhook;
    onSave: (webhook: Partial<AdminWebhook>) => void;
    onClose: () => void;
    saving: boolean;
}

function WebhookEditModal({ webhook, onSave, onClose, saving }: WebhookEditModalProps) {
    const [formData, setFormData] = useState({
        id: webhook.id,
        name: webhook.name || '',
        url: webhook.url || '',
        events: webhook.events || ['form_submit'],
        headers: webhook.headers || {},
        enabled: webhook.enabled !== false,
    });

    const [headerKey, setHeaderKey] = useState('');
    const [headerValue, setHeaderValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.url || formData.events.length === 0) {
            alert('Name, URL, and at least one event are required');
            return;
        }

        onSave({
            id: formData.id || undefined,
            name: formData.name,
            url: formData.url,
            events: formData.events as WebhookEvent[],
            headers: Object.keys(formData.headers).length > 0 ? formData.headers : undefined,
            enabled: formData.enabled,
        });
    };

    const toggleEvent = (event: WebhookEvent) => {
        if (formData.events.includes(event)) {
            setFormData({
                ...formData,
                events: formData.events.filter(e => e !== event),
            });
        } else {
            setFormData({
                ...formData,
                events: [...formData.events, event],
            });
        }
    };

    const addHeader = () => {
        if (!headerKey.trim()) return;
        setFormData({
            ...formData,
            headers: { ...formData.headers, [headerKey]: headerValue },
        });
        setHeaderKey('');
        setHeaderValue('');
    };

    const removeHeader = (key: string) => {
        const newHeaders = { ...formData.headers };
        delete newHeaders[key];
        setFormData({ ...formData, headers: newHeaders });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {webhook.createdAt ? 'Edit Webhook' : 'Add Webhook'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            placeholder="My Webhook"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none font-mono text-sm"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Events *</label>
                        <div className="space-y-2">
                            {EVENT_OPTIONS.map((event) => (
                                <label key={event.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.events.includes(event.value)}
                                        onChange={() => toggleEvent(event.value)}
                                        className="w-5 h-5 rounded border-gray-300 text-[#1A4D2E] focus:ring-[#1A4D2E]"
                                    />
                                    <span className="text-sm text-gray-700">{event.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Headers</label>
                        <div className="space-y-2">
                            {Object.entries(formData.headers).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                    <span className="font-mono text-sm flex-1">{key}: {value}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeHeader(key)}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={headerKey}
                                    onChange={(e) => setHeaderKey(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm"
                                    placeholder="Header name"
                                />
                                <input
                                    type="text"
                                    value={headerValue}
                                    onChange={(e) => setHeaderValue(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm"
                                    placeholder="Value"
                                />
                                <button
                                    type="button"
                                    onClick={addHeader}
                                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.enabled}
                                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-[#1A4D2E] focus:ring-[#1A4D2E]"
                            />
                            <span className="text-sm font-medium text-gray-700">Enabled</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
