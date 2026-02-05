'use client';

import { useState, useEffect } from 'react';
import { AdminSocialLink, SocialPlatform } from '@/types/admin';

const PLATFORM_ICONS: Record<string, string> = {
    facebook: '📘',
    instagram: '📸',
    youtube: '📺',
    zalo: '💬',
    tiktok: '🎵',
    twitter: '🐦',
    custom: '🔗',
};

const PLATFORM_COLORS: Record<string, string> = {
    facebook: 'bg-blue-100 text-blue-700 border-blue-200',
    instagram: 'bg-pink-100 text-pink-700 border-pink-200',
    youtube: 'bg-red-100 text-red-700 border-red-200',
    zalo: 'bg-blue-100 text-blue-700 border-blue-200',
    tiktok: 'bg-gray-100 text-gray-700 border-gray-200',
    twitter: 'bg-sky-100 text-sky-700 border-sky-200',
    custom: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function SocialsManagementPage() {
    const [socials, setSocials] = useState<AdminSocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSocial, setEditingSocial] = useState<AdminSocialLink | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const response = await fetch('/api/admin/socials');
            const data = await response.json();
            if (data.success) {
                setSocials(data.data);
            }
        } catch (error) {
            console.error('Error fetching socials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (social: Partial<AdminSocialLink>) => {
        setSaving(true);
        try {
            const isNew = !editingSocial?.createdAt;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch('/api/admin/socials', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(social),
            });

            const data = await response.json();
            if (data.success) {
                fetchSocials();
                setIsModalOpen(false);
                setEditingSocial(null);
            } else {
                alert(data.error || 'Failed to save social link');
            }
        } catch (error) {
            console.error('Error saving social:', error);
            alert('Failed to save social link');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this social link?')) return;

        try {
            const response = await fetch(`/api/admin/socials?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchSocials();
            } else {
                alert(data.error || 'Failed to delete social link');
            }
        } catch (error) {
            console.error('Error deleting social:', error);
            alert('Failed to delete social link');
        }
    };

    const handleToggle = async (social: AdminSocialLink) => {
        try {
            const response = await fetch('/api/admin/socials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: social.id, enabled: !social.enabled }),
            });
            const data = await response.json();
            if (data.success) {
                fetchSocials();
            }
        } catch (error) {
            console.error('Error toggling social:', error);
        }
    };

    const openNewModal = () => {
        setEditingSocial({
            id: '',
            platform: 'facebook',
            url: '',
            displayInFooter: true,
            order: socials.length + 1,
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
                <h1 className="text-2xl font-bold text-gray-800">Social Links</h1>
                <button
                    onClick={openNewModal}
                    className="bg-[#1A4D2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a4a] transition-colors flex items-center gap-2"
                >
                    <span>➕</span>
                    Add Social Link
                </button>
            </div>

            {socials.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm px-6 py-12 text-center text-gray-500">
                    No social links yet. Add one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socials.map((social) => (
                        <div
                            key={social.id}
                            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${social.enabled ? PLATFORM_COLORS[social.platform] || PLATFORM_COLORS.custom : 'border-gray-200 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">{PLATFORM_ICONS[social.platform] || '🔗'}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(social)}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                        title={social.enabled ? 'Disable' : 'Enable'}
                                    >
                                        {social.enabled ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingSocial(social);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(social.id)}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors text-red-500"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg capitalize mb-2">{social.platform}</h3>

                            <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:underline break-all"
                            >
                                {social.url}
                            </a>

                            <div className="mt-4 flex gap-2">
                                {social.displayInFooter && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                                        Footer
                                    </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded-full ${social.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {social.enabled ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && editingSocial && (
                <SocialEditModal
                    social={editingSocial}
                    onSave={handleSave}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingSocial(null);
                    }}
                    saving={saving}
                />
            )}
        </div>
    );
}

interface SocialEditModalProps {
    social: AdminSocialLink;
    onSave: (social: Partial<AdminSocialLink>) => void;
    onClose: () => void;
    saving: boolean;
}

function SocialEditModal({ social, onSave, onClose, saving }: SocialEditModalProps) {
    const [formData, setFormData] = useState({
        id: social.id,
        platform: social.platform || 'facebook',
        url: social.url || '',
        customIcon: social.customIcon || '',
        displayInFooter: social.displayInFooter !== false,
        order: social.order || 1,
        enabled: social.enabled !== false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id || !formData.url) {
            alert('ID and URL are required');
            return;
        }

        onSave({
            id: formData.id,
            platform: formData.platform as AdminSocialLink['platform'],
            url: formData.url,
            customIcon: formData.platform === 'custom' ? formData.customIcon : undefined,
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
                        {social.createdAt ? 'Edit Social Link' : 'Add Social Link'}
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
                            disabled={!!social.createdAt}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value as SocialPlatform })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                        >
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="zalo">Zalo</option>
                            <option value="tiktok">TikTok</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    {formData.platform === 'custom' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Icon (emoji)</label>
                            <input
                                type="text"
                                value={formData.customIcon}
                                onChange={(e) => setFormData({ ...formData, customIcon: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-center text-2xl"
                            />
                        </div>
                    )}

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
