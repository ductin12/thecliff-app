'use client';

import { useState, useEffect } from 'react';
import { AdminButton, LocalizedString, ButtonAction, ButtonPosition, AdminModalType } from '@/types/admin';

export default function ButtonsManagementPage() {
    const [buttons, setButtons] = useState<AdminButton[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingButton, setEditingButton] = useState<AdminButton | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchButtons();
    }, []);

    const fetchButtons = async () => {
        try {
            const response = await fetch('/api/admin/buttons');
            const data = await response.json();
            if (data.success) {
                setButtons(data.data);
            }
        } catch (error) {
            console.error('Error fetching buttons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (button: Partial<AdminButton>) => {
        setSaving(true);
        try {
            const isNew = !editingButton?.createdAt;
            const url = '/api/admin/buttons' + (isNew ? '' : `/${button.id}`);
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(button),
            });

            const data = await response.json();
            if (data.success) {
                fetchButtons();
                setIsModalOpen(false);
                setEditingButton(null);
            } else {
                alert(data.error || 'Failed to save button');
            }
        } catch (error) {
            console.error('Error saving button:', error);
            alert('Failed to save button');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this button?')) return;

        try {
            const response = await fetch(`/api/admin/buttons/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchButtons();
            } else {
                alert(data.error || 'Failed to delete button');
            }
        } catch (error) {
            console.error('Error deleting button:', error);
            alert('Failed to delete button');
        }
    };

    const handleToggle = async (button: AdminButton) => {
        try {
            const response = await fetch(`/api/admin/buttons/${button.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: !button.enabled }),
            });
            const data = await response.json();
            if (data.success) {
                fetchButtons();
            }
        } catch (error) {
            console.error('Error toggling button:', error);
        }
    };

    const openNewModal = () => {
        setEditingButton({
            id: '',
            name: { en: '', vi: '' },
            icon: '🔗',
            action: 'link',
            position: 'body',
            order: buttons.length + 1,
            enabled: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (button: AdminButton) => {
        setEditingButton(button);
        setIsModalOpen(true);
    };

    const getButtonName = (name: LocalizedString): string => {
        return name.en || name.vi || 'Unnamed';
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
                <h1 className="text-2xl font-bold text-gray-800">Buttons Management</h1>
                <button
                    onClick={openNewModal}
                    className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors flex items-center gap-2"
                >
                    <span>➕</span>
                    Add Button
                </button>
            </div>

            {/* Position Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {['body', 'header', 'footer'].map((position) => {
                    const positionButtons = buttons.filter((b) => b.position === position);
                    if (position !== 'body' && positionButtons.length === 0) return null;

                    return (
                        <div key={position} className="border-b last:border-0">
                            <div className="bg-gray-50 px-6 py-3 border-b">
                                <h2 className="font-semibold text-gray-700 capitalize">
                                    {position} ({positionButtons.length})
                                </h2>
                            </div>

                            {positionButtons.length === 0 ? (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    No buttons in this position
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {positionButtons.map((button) => (
                                        <div
                                            key={button.id}
                                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{button.icon}</span>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">
                                                        {getButtonName(button.name)}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {button.action === 'link' && button.url}
                                                        {button.action === 'phone' && button.phone}
                                                        {button.action === 'modal' && `Modal: ${button.modalType}`}
                                                        {button.action === 'zalo' && 'Zalo Chat'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${button.enabled
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                >
                                                    {button.enabled ? 'Active' : 'Disabled'}
                                                </span>

                                                <button
                                                    onClick={() => handleToggle(button)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title={button.enabled ? 'Disable' : 'Enable'}
                                                >
                                                    {button.enabled ? '👁️' : '👁️‍🗨️'}
                                                </button>

                                                <button
                                                    onClick={() => openEditModal(button)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(button.id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingButton && (
                <ButtonEditModal
                    button={editingButton}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingButton(null);
                    }}
                    saving={saving}
                />
            )}
        </div>
    );
}

// Button Edit Modal Component
interface ButtonEditModalProps {
    button: AdminButton;
    onSave: (button: Partial<AdminButton>) => void;
    onClose: () => void;
    saving: boolean;
}

function ButtonEditModal({ button, onSave, onClose, saving }: ButtonEditModalProps) {
    const [formData, setFormData] = useState<{
        id: string;
        nameEn: string;
        nameVi: string;
        icon: string;
        action: ButtonAction;
        url: string;
        phone: string;
        email: string;
        modalType: AdminModalType;
        position: ButtonPosition;
        order: number;
        enabled: boolean;
    }>({
        id: button.id,
        nameEn: button.name?.en || '',
        nameVi: button.name?.vi || '',
        icon: button.icon || '🔗',
        action: button.action || 'link',
        url: button.url || '',
        phone: button.phone || '',
        email: button.email || '',
        modalType: button.modalType || 'wifi',
        position: button.position || 'body',
        order: button.order || 1,
        enabled: button.enabled !== false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id || !formData.nameEn) {
            alert('ID and English name are required');
            return;
        }

        onSave({
            id: formData.id,
            name: { en: formData.nameEn, vi: formData.nameVi },
            icon: formData.icon,
            action: formData.action as AdminButton['action'],
            url: formData.action === 'link' ? formData.url : undefined,
            phone: formData.action === 'phone' ? formData.phone : undefined,
            email: formData.action === 'email' ? formData.email : undefined,
            modalType: formData.action === 'modal' ? (formData.modalType as AdminButton['modalType']) : undefined,
            position: formData.position as AdminButton['position'],
            order: formData.order,
            enabled: formData.enabled,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {button.createdAt ? 'Edit Button' : 'Add New Button'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                                placeholder="button-id"
                                disabled={!!button.createdAt}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-center text-2xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN) *</label>
                            <input
                                type="text"
                                value={formData.nameEn}
                                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name (VI)</label>
                            <input
                                type="text"
                                value={formData.nameVi}
                                onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                            <select
                                value={formData.action}
                                onChange={(e) => setFormData({ ...formData, action: e.target.value as ButtonAction })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            >
                                <option value="link">Link (URL)</option>
                                <option value="phone">Phone Call</option>
                                <option value="email">Email</option>
                                <option value="modal">Modal Popup</option>
                                <option value="zalo">Zalo Chat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value as ButtonPosition })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            >
                                <option value="header">Header</option>
                                <option value="body">Body</option>
                                <option value="footer">Footer</option>
                            </select>
                        </div>
                    </div>

                    {formData.action === 'link' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    {formData.action === 'phone' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                                placeholder="+84..."
                            />
                        </div>
                    )}

                    {formData.action === 'email' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            />
                        </div>
                    )}

                    {formData.action === 'modal' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Type</label>
                            <select
                                value={formData.modalType}
                                onChange={(e) => setFormData({ ...formData, modalType: e.target.value as AdminModalType })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            >
                                <option value="wifi">WiFi Connect</option>
                                <option value="housekeeping">Housekeeping Request</option>
                                <option value="orderfood">Order Food</option>
                                <option value="survey">Survey</option>
                                <option value="social">Social Media</option>
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                                min="1"
                            />
                        </div>
                        <div className="flex items-center pt-6">
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
                            {saving ? 'Saving...' : 'Save Button'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
