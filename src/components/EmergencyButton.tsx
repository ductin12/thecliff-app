'use client';

import { useState } from 'react';
import { PHONE_NUMBERS } from '@/lib/constants';
import { useTranslation } from '@/i18n';

export default function EmergencyButton() {
    const { t } = useTranslation();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleEmergencyClick = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        window.location.href = `tel:${PHONE_NUMBERS.emergency.replace(/\s/g, '')}`;
        setShowConfirm(false);
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    return (
        <>
            {/* Emergency Button */}
            <button
                onClick={handleEmergencyClick}
                className="fixed bottom-5 right-5 z-40 w-16 h-16 
                   bg-[#DC2626] text-white rounded-full
                   shadow-lg shadow-red-500/40
                   flex items-center justify-center
                   hover:bg-[#B91C1C] transition-all
                   active:scale-95
                   animate-pulse"
                aria-label="Emergency - Call for help"
            >
                <span className="text-2xl">🚨</span>
            </button>

            {/* Confirmation Dialog */}
            {showConfirm && (
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
