'use client';

import { useState, useEffect } from 'react';
import { AdminPhoneNumber, LocalizedString, PhoneType } from '@/types/admin';

export default function PhonesManagementPage() {
    const [phones, setPhones] = useState<AdminPhoneNumber[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPhone, setEditingPhone] = useState<AdminPhoneNumber | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPhones();
    }, []);

    const fetchPhones = async () => {
        try {
            const response = await fetch('/api/admin/phones');
            const data = await response.json();
            if (data.success) {
                setPhones(data.data);
            }
        } catch (error) {
            console.error('Error fetching phones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (phone: Partial<AdminPhoneNumber>) => {
        setSaving(true);
        try {
            const isNew = !editingPhone?.createdAt;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch('/api/admin/phones', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(phone),
            });

            const data = await response.json();
            if (data.success) {
                fetchPhones();
                setIsModalOpen(false);
                setEditingPhone(null);
            } else {
                alert(data.error || 'Failed to save phone');
            }
        } catch (error) {
            console.error('Error saving phone:', error);
            alert('Failed to save phone');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this phone number?')) return;

        try {
            const response = await fetch(`/api/admin/phones?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchPhones();
            } else {
                alert(data.error || 'Failed to delete phone');
            }
        } catch (error) {
            console.error('Error deleting phone:', error);
            alert('Failed to delete phone');
        }
    };

    const handleToggle = async (phone: AdminPhoneNumber) => {
        try {
            const response = await fetch('/api/admin/phones', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: phone.id, enabled: !phone.enabled }),
            });
            const data = await response.json();
            if (data.success) {
                fetchPhones();
            }
        } catch (error) {
            console.error('Error toggling phone:', error);
        }
    };

    const openNewModal = () => {
        setEditingPhone({
            id: '',
            label: { en: '', vi: '' },
            number: '',
            type: 'custom',
            displayInFooter: true,
            order: phones.length + 1,
            enabled: true,
        });
        setIsModalOpen(true);
    };

    const getLabel = (label: LocalizedString): string => {
        return label.en || label.vi || 'Unnamed';
    };

    const getTypeColor = (type: string): string => {
        switch (type) {
            case 'hotline': return 'bg-red-100 text-red-700';
            case 'frontdesk': return 'bg-blue-100 text-blue-700';
            case 'housekeeping': return 'bg-purple-100 text-purple-700';
            case 'security': return 'bg-orange-100 text-orange-700';
            case 'emergency': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
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
                <h1 className="text-2xl font-bold text-gray-800">Phone Numbers</h1>
                <button
                    onClick={openNewModal}
                    className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors flex items-center gap-2"
                >
                    <span>➕</span>
                    Add Phone
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {phones.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        No phone numbers yet. Add one to get started.
                    </div>
                ) : (
                    <div className="divide-y">
                        {phones.map((phone) => (
                            <div
                                key={phone.id}
                                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {getLabel(phone.label)}
                                        </h3>
                                        <p className="text-sm text-gray-500">{phone.number}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(phone.type)}`}>
                                        {phone.type}
                                    </span>

                                    {phone.displayInFooter && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                                            Footer
                                        </span>
                                    )}

                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${phone.enabled
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {phone.enabled ? 'Active' : 'Disabled'}
                                    </span>

                                    <button
                                        onClick={() => handleToggle(phone)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        {phone.enabled ? '👁️' : '👁️‍🗨️'}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingPhone(phone);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        onClick={() => handleDelete(phone.id)}
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingPhone && (
                <PhoneEditModal
                    phone={editingPhone}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingPhone(null);
                    }}
                    saving={saving}
                />
            )}
        </div>
    );
}

interface PhoneEditModalProps {
    phone: AdminPhoneNumber;
    onSave: (phone: Partial<AdminPhoneNumber>) => void;
    onClose: () => void;
    saving: boolean;
}

function PhoneEditModal({ phone, onSave, onClose, saving }: PhoneEditModalProps) {
    const [formData, setFormData] = useState({
        id: phone.id,
        labelEn: phone.label?.en || '',
        labelVi: phone.label?.vi || '',
        number: phone.number || '',
        type: phone.type || 'custom',
        displayInFooter: phone.displayInFooter !== false,
        order: phone.order || 1,
        enabled: phone.enabled !== false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id || !formData.labelEn || !formData.number) {
            alert('ID, English label, and number are required');
            return;
        }

        onSave({
            id: formData.id,
            label: { en: formData.labelEn, vi: formData.labelVi },
            number: formData.number,
            type: formData.type as AdminPhoneNumber['type'],
            displayInFooter: formData.displayInFooter,
            order: formData.order,
            enabled: formData.enabled,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {phone.createdAt ? 'Edit Phone Number' : 'Add Phone Number'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
                        <input
                            type="text"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            disabled={!!phone.createdAt}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Label (EN) *</label>
                            <input
                                type="text"
                                value={formData.labelEn}
                                onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Label (VI)</label>
                            <input
                                type="text"
                                value={formData.labelVi}
                                onChange={(e) => setFormData({ ...formData, labelVi: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                            type="tel"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            placeholder="+84..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as PhoneType })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                        >
                            <option value="hotline">Hotline</option>
                            <option value="frontdesk">Front Desk</option>
                            <option value="housekeeping">Housekeeping</option>
                            <option value="security">Security</option>
                            <option value="emergency">Emergency</option>
                            <option value="medical">Medical</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.displayInFooter}
                                onChange={(e) => setFormData({ ...formData, displayInFooter: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-[#1A4D2E] focus:ring-[#1A4D2E]"
                            />
                            <span className="text-sm text-gray-700">Show in Footer</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.enabled}
                                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-[#1A4D2E] focus:ring-[#1A4D2E]"
                            />
                            <span className="text-sm text-gray-700">Enabled</span>
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
