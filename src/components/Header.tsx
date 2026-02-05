'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BRAND_ASSETS, PHONE_NUMBERS } from '@/lib/constants';
import { useTranslation } from '@/i18n';

interface HeaderProps {
    onWifiClick: () => void;
}

export default function Header({ onWifiClick }: HeaderProps) {
    const { t } = useTranslation();
    const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

    const handleEmergencyClick = () => {
        setShowEmergencyConfirm(true);
    };

    const handleConfirm = () => {
        window.location.href = `tel:${PHONE_NUMBERS.emergency.replace(/\s/g, '')}`;
        setShowEmergencyConfirm(false);
    };

    const handleCancel = () => {
        setShowEmergencyConfirm(false);
    };

    return (
        <>
            <header className="relative bg-gradient-to-b from-[#1A4D2E] to-[#2D6B45] text-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={BRAND_ASSETS.banner}
                        alt="The Cliff Resort"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center py-6 px-4">
                    {/* Logo */}
                    <div className="mb-4">
                        <Image
                            src={BRAND_ASSETS.logo}
                            alt="The Cliff Resort Logo"
                            width={160}
                            height={60}
                            className="h-12 w-auto"
                            priority
                        />
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-bold mb-1">
                            {t.header.welcome}
                        </h1>
                        <p className="text-sm text-white/80">
                            {t.header.tagline}
                        </p>
                    </div>

                    {/* Action Buttons - WiFi and Emergency side by side */}
                    <div className="flex items-center gap-3">
                        {/* WiFi Button */}
                        <button
                            onClick={onWifiClick}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                             px-5 py-3 rounded-full transition-all duration-300 
                             border border-white/30 shadow-lg hover:shadow-xl
                             active:scale-95"
                            aria-label="Connect to WiFi"
                        >
                            <span className="text-xl">📶</span>
                            <span className="font-medium">{t.header.connectWifi}</span>
                        </button>

                        {/* Emergency Button */}
                        <button
                            onClick={handleEmergencyClick}
                            className="flex items-center gap-2 bg-[#DC2626]/90 hover:bg-[#DC2626] backdrop-blur-sm 
                             px-5 py-3 rounded-full transition-all duration-300 
                             border border-red-400/50 shadow-lg shadow-red-500/30 hover:shadow-xl
                             active:scale-95"
                            aria-label="Emergency - Call for help"
                        >
                            <span className="text-xl">🚨</span>
                            <span className="font-medium">{t.emergency.title}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Emergency Confirmation Dialog */}
            {showEmergencyConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="emergency-title"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
                        <div className="text-5xl mb-4">🚨</div>
                        <h2 id="emergency-title" className="text-xl font-bold text-gray-800 mb-2">
                            {t.emergency.title}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t.emergency.message}
                        </p>
                        <p className="text-lg font-semibold text-[#DC2626] mb-6">
                            {PHONE_NUMBERS.emergency}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 border border-gray-300 rounded-xl
                                   text-gray-700 font-medium
                                   hover:bg-gray-50 transition-colors"
                            >
                                {t.emergency.cancel}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 bg-[#DC2626] text-white rounded-xl
                                   font-medium hover:bg-[#B91C1C] transition-colors"
                            >
                                {t.emergency.callNow}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

