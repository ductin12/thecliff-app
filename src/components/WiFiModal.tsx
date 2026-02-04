'use client';

import { useEffect, useCallback, useState } from 'react';
import { WIFI_CONFIG } from '@/lib/constants';
import { useTranslation } from '@/i18n';

interface WiFiModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WiFiModal({ isOpen, onClose }: WiFiModalProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopyPassword = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(WIFI_CONFIG.password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wifi-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">📶</div>
                    <h2 id="wifi-title" className="text-xl font-bold text-gray-800">
                        {t.wifi.title}
                    </h2>
                </div>

                {/* WiFi Info */}
                <div className="space-y-4 mb-6">
                    {/* SSID */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                            {t.wifi.networkName}
                        </label>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {WIFI_CONFIG.ssid}
                        </p>
                    </div>

                    {/* Password */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                            {t.wifi.password}
                        </label>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-lg font-semibold text-gray-800 font-mono">
                                {WIFI_CONFIG.password}
                            </p>
                            <button
                                onClick={handleCopyPassword}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#1A4D2E] text-white hover:bg-[#2D6B45]'
                                    }`}
                            >
                                {copied ? t.wifi.copied : t.wifi.copy}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">
                        {t.wifi.howToConnect}
                    </h3>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>{t.wifi.step1}</li>
                        <li>{t.wifi.step2}</li>
                        <li>{t.wifi.step3} &quot;{WIFI_CONFIG.ssid}&quot;</li>
                        <li>{t.wifi.step4}</li>
                    </ol>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#1A4D2E] text-white rounded-xl font-medium
                     hover:bg-[#2D6B45] transition-colors"
                >
                    {t.wifi.gotIt}
                </button>
            </div>
        </div>
    );
}
