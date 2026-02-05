'use client';

import { useState, useEffect, useCallback, useRef, FormEvent } from 'react';
import { useTranslation } from '@/i18n';

interface HousekeepingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

const WEBHOOK_URL = 'https://auto.thecliff.io.vn/webhook/booking-form-submit';

export default function HousekeepingModal({ isOpen, onClose }: HousekeepingModalProps) {
    const { t } = useTranslation();
    const [formState, setFormState] = useState<FormState>('idle');
    const [roomNumber, setRoomNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [notes, setNotes] = useState('');
    const wasOpenRef = useRef(false);

    // Reset form when modal opens (using ref to track previous state)
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            // Modal just opened - schedule state reset for next render
            const timeoutId = setTimeout(() => {
                setFormState('idle');
                setRoomNumber('');
                setFullName('');
                setPreferredTime('');
                setNotes('');
            }, 0);
            return () => clearTimeout(timeoutId);
        }
        wasOpenRef.current = isOpen;
    }, [isOpen]);

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

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        if (!roomNumber.trim() || !fullName.trim()) {
            return;
        }

        setFormState('loading');

        try {
            // Build query params for GET request
            const params = new URLSearchParams({
                room_number: roomNumber.trim(),
                full_name: fullName.trim(),
                preferred_time: preferredTime.trim() || '',
                notes: notes.trim() || '',
                type: 'housekeeping',
                timestamp: new Date().toISOString(),
            });

            const response = await fetch(`${WEBHOOK_URL}?${params.toString()}`, {
                method: 'GET',
            });

            if (response.ok) {
                setFormState('success');
            } else {
                setFormState('error');
            }
        } catch {
            setFormState('error');
        }
    }, [roomNumber, fullName, preferredTime, notes]);

    const handleNewRequest = useCallback(() => {
        setFormState('idle');
        setRoomNumber('');
        setFullName('');
        setPreferredTime('');
        setNotes('');
    }, []);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="housekeeping-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🧹</div>
                    <h2 id="housekeeping-title" className="text-xl font-bold text-gray-800">
                        {t.housekeeping.title}
                    </h2>
                </div>

                {/* Form State: Idle/Loading */}
                {(formState === 'idle' || formState === 'loading') && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Room Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.housekeeping.roomNumber} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                placeholder={t.housekeeping.roomNumberPlaceholder}
                                required
                                disabled={formState === 'loading'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A4D2E] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.housekeeping.fullName} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={t.housekeeping.fullNamePlaceholder}
                                required
                                disabled={formState === 'loading'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A4D2E] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        {/* Preferred Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.housekeeping.preferredTime}
                            </label>
                            <input
                                type="text"
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                                placeholder={t.housekeeping.preferredTimePlaceholder}
                                disabled={formState === 'loading'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A4D2E] focus:border-transparent outline-none transition-all disabled:bg-gray-100"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.housekeeping.notes}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={t.housekeeping.notesPlaceholder}
                                disabled={formState === 'loading'}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A4D2E] focus:border-transparent outline-none transition-all resize-none disabled:bg-gray-100"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={formState === 'loading' || !roomNumber.trim() || !fullName.trim()}
                            className="w-full py-3 bg-[#1A4D2E] text-white rounded-xl font-medium
                         hover:bg-[#2D6B45] transition-all
                         disabled:bg-gray-400 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
                        >
                            {formState === 'loading' ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {t.housekeeping.submitting}
                                </>
                            ) : (
                                t.housekeeping.submit
                            )}
                        </button>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={formState === 'loading'}
                            className="w-full py-3 border border-gray-300 rounded-xl
                         text-gray-700 font-medium
                         hover:bg-gray-50 transition-colors
                         disabled:opacity-50"
                        >
                            {t.housekeeping.close}
                        </button>
                    </form>
                )}

                {/* Form State: Success */}
                {formState === 'success' && (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-green-600 mb-2">
                            {t.housekeeping.success}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t.housekeeping.successMessage}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleNewRequest}
                                className="w-full py-3 bg-[#1A4D2E] text-white rounded-xl font-medium
                           hover:bg-[#2D6B45] transition-colors"
                            >
                                {t.housekeeping.newRequest}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 border border-gray-300 rounded-xl
                           text-gray-700 font-medium
                           hover:bg-gray-50 transition-colors"
                            >
                                {t.housekeeping.close}
                            </button>
                        </div>
                    </div>
                )}

                {/* Form State: Error */}
                {formState === 'error' && (
                    <div className="text-center">
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-bold text-red-600 mb-2">
                            {t.housekeeping.error}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t.housekeeping.errorMessage}
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setFormState('idle')}
                                className="w-full py-3 bg-[#1A4D2E] text-white rounded-xl font-medium
                           hover:bg-[#2D6B45] transition-colors"
                            >
                                {t.housekeeping.tryAgain}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 border border-gray-300 rounded-xl
                           text-gray-700 font-medium
                           hover:bg-gray-50 transition-colors"
                            >
                                {t.housekeeping.close}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
