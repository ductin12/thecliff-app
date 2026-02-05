'use client';

import { useState, useEffect, useCallback, useRef, FormEvent } from 'react';
import { useTranslation } from '@/i18n';

interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

// Rating criteria
const RATING_CRITERIA = [
    { id: 'room', labelEn: 'Room & Facilities', labelVi: 'Phòng & Tiện nghi', icon: '🛏️' },
    { id: 'staff', labelEn: 'Staff & Service', labelVi: 'Nhân viên & Phục vụ', icon: '👨‍💼' },
    { id: 'food', labelEn: 'Food & Dining', labelVi: 'Ẩm thực', icon: '🍽️' },
    { id: 'beach', labelEn: 'Beach & Pool', labelVi: 'Bãi biển & Hồ bơi', icon: '🏖️' },
    { id: 'cleanliness', labelEn: 'Cleanliness', labelVi: 'Vệ sinh', icon: '✨' },
];

const WEBHOOK_URL = 'https://auto.thecliff.io.vn/webhook/survey-form';

export default function SurveyModal({ isOpen, onClose }: SurveyModalProps) {
    const { t, locale } = useTranslation();
    const [formState, setFormState] = useState<FormState>('idle');

    // Guest info
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    // Ratings
    const [overallRating, setOverallRating] = useState(0);
    const [criteriaRatings, setCriteriaRatings] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState('');

    const wasOpenRef = useRef(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            const timeoutId = setTimeout(() => {
                setFormState('idle');
                setFullName('');
                setPhone('');
                setEmail('');
                setRoomNumber('');
                setCheckIn('');
                setCheckOut('');
                setOverallRating(0);
                setCriteriaRatings({});
                setFeedback('');
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

    const handleCriteriaRating = (criteriaId: string, rating: number) => {
        setCriteriaRatings(prev => ({ ...prev, [criteriaId]: rating }));
    };

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !roomNumber.trim() || overallRating === 0) {
            return;
        }

        setFormState('loading');

        try {
            // 1. Save to database via API
            const dbPayload = {
                type: 'survey',
                guestName: fullName.trim(),
                roomNumber: roomNumber.trim(),
                phone: phone.trim() || undefined,
                email: email.trim() || undefined,
                checkIn: checkIn || undefined,
                checkOut: checkOut || undefined,
                rating: overallRating,
                criteriaRatings: {
                    room: criteriaRatings.room || undefined,
                    staff: criteriaRatings.staff || undefined,
                    food: criteriaRatings.food || undefined,
                    beach: criteriaRatings.beach || undefined,
                    cleanliness: criteriaRatings.cleanliness || undefined,
                },
                feedback: feedback.trim() || undefined,
            };

            const dbResponse = await fetch('/api/admin/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dbPayload),
            });

            if (!dbResponse.ok) {
                console.error('Failed to save survey to database');
            }

            // 2. Send to webhook via GET
            const params = new URLSearchParams({
                full_name: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                room_number: roomNumber.trim(),
                check_in: checkIn,
                check_out: checkOut,
                overall_rating: String(overallRating),
                feedback: feedback.trim(),
                timestamp: new Date().toISOString(),
                locale: locale,
            });

            // Add criteria ratings
            RATING_CRITERIA.forEach(criteria => {
                const rating = criteriaRatings[criteria.id] || 0;
                params.append(`rating_${criteria.id}`, String(rating));
            });

            // Call webhook (non-blocking, don't wait for response)
            fetch(`${WEBHOOK_URL}?${params.toString()}`, { method: 'GET' }).catch(() => {
                console.debug('Webhook call failed, but form was saved');
            });

            setFormState('success');
        } catch {
            setFormState('error');
        }
    }, [fullName, phone, email, roomNumber, checkIn, checkOut, overallRating, criteriaRatings, feedback, locale]);

    const handleNewSurvey = useCallback(() => {
        setFormState('idle');
        setFullName('');
        setPhone('');
        setEmail('');
        setRoomNumber('');
        setCheckIn('');
        setCheckOut('');
        setOverallRating(0);
        setCriteriaRatings({});
        setFeedback('');
    }, []);

    if (!isOpen) return null;

    // Star rating component
    const StarRating = ({ value, onChange, size = 'md' }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md' | 'lg' }) => {
        const sizeClass = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-xl' : 'text-2xl';
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`${sizeClass} transition-all hover:scale-110 ${star <= value ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    const isVi = locale === 'vi';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="survey-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#1A4D2E] to-[#2D6B45] text-white px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">⭐</span>
                            <div>
                                <h2 id="survey-title" className="text-xl font-bold">
                                    {isVi ? 'Đánh giá kỳ nghỉ' : 'Rate Your Stay'}
                                </h2>
                                <p className="text-white/80 text-sm">
                                    {isVi ? 'Ý kiến của bạn rất quan trọng' : 'Your feedback matters'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Form State: Idle/Loading */}
                    {(formState === 'idle' || formState === 'loading') && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Guest Info Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    {isVi ? 'Thông tin khách' : 'Guest Information'}
                                </h3>

                                {/* Name & Room - Side by side */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            {isVi ? 'Họ tên' : 'Full Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder={isVi ? 'Tên của bạn' : 'Your name'}
                                            required
                                            disabled={formState === 'loading'}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            {isVi ? 'Số phòng' : 'Room'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={roomNumber}
                                            onChange={(e) => setRoomNumber(e.target.value)}
                                            placeholder="101"
                                            required
                                            disabled={formState === 'loading'}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Phone & Email */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            {isVi ? 'Điện thoại' : 'Phone'}
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+84..."
                                            disabled={formState === 'loading'}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@..."
                                            disabled={formState === 'loading'}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Check-in & Check-out */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Check-in
                                        </label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            disabled={formState === 'loading'}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">
                                            Check-out
                                        </label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            disabled={formState === 'loading'}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Overall Rating */}
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 text-center">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                    {isVi ? 'Đánh giá chung' : 'Overall Experience'} <span className="text-red-500">*</span>
                                </h3>
                                <div className="flex justify-center">
                                    <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {overallRating === 0 && (isVi ? 'Nhấn để đánh giá' : 'Tap to rate')}
                                    {overallRating === 1 && (isVi ? 'Rất không hài lòng' : 'Very Poor')}
                                    {overallRating === 2 && (isVi ? 'Không hài lòng' : 'Poor')}
                                    {overallRating === 3 && (isVi ? 'Bình thường' : 'Average')}
                                    {overallRating === 4 && (isVi ? 'Hài lòng' : 'Good')}
                                    {overallRating === 5 && (isVi ? 'Rất hài lòng' : 'Excellent')}
                                </p>
                            </div>

                            {/* Criteria Ratings */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    {isVi ? 'Đánh giá chi tiết' : 'Rate by Category'}
                                </h3>
                                <div className="grid gap-2">
                                    {RATING_CRITERIA.map((criteria) => (
                                        <div
                                            key={criteria.id}
                                            className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{criteria.icon}</span>
                                                <span className="text-sm text-gray-700">
                                                    {isVi ? criteria.labelVi : criteria.labelEn}
                                                </span>
                                            </div>
                                            <StarRating
                                                value={criteriaRatings[criteria.id] || 0}
                                                onChange={(v) => handleCriteriaRating(criteria.id, v)}
                                                size="sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    {isVi ? 'Góp ý thêm' : 'Additional Comments'}
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={isVi ? 'Chia sẻ trải nghiệm của bạn...' : 'Share your experience...'}
                                    disabled={formState === 'loading'}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A4D2E] outline-none text-sm resize-none disabled:bg-gray-100"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={formState === 'loading' || !fullName.trim() || !roomNumber.trim() || overallRating === 0}
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
                                        {isVi ? 'Đang gửi...' : 'Submitting...'}
                                    </>
                                ) : (
                                    <>
                                        <span>📬</span>
                                        {isVi ? 'Gửi đánh giá' : 'Submit Review'}
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Form State: Success */}
                    {formState === 'success' && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-xl font-bold text-green-600 mb-2">
                                {isVi ? 'Cảm ơn bạn!' : 'Thank You!'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {isVi
                                    ? 'Đánh giá của bạn đã được ghi nhận. Chúng tôi rất trân trọng ý kiến của bạn!'
                                    : 'Your feedback has been submitted. We truly appreciate your input!'}
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleNewSurvey}
                                    className="w-full py-3 bg-[#1A4D2E] text-white rounded-xl font-medium
                                        hover:bg-[#2D6B45] transition-colors"
                                >
                                    {isVi ? 'Gửi đánh giá khác' : 'Submit Another Review'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 border border-gray-300 rounded-xl
                                        text-gray-700 font-medium
                                        hover:bg-gray-50 transition-colors"
                                >
                                    {isVi ? 'Đóng' : 'Close'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Form State: Error */}
                    {formState === 'error' && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">😔</div>
                            <h3 className="text-xl font-bold text-red-600 mb-2">
                                {isVi ? 'Có lỗi xảy ra' : 'Something went wrong'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {isVi
                                    ? 'Không thể gửi đánh giá. Vui lòng thử lại.'
                                    : 'Failed to submit your review. Please try again.'}
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setFormState('idle')}
                                    className="w-full py-3 bg-[#1A4D2E] text-white rounded-xl font-medium
                                        hover:bg-[#2D6B45] transition-colors"
                                >
                                    {isVi ? 'Thử lại' : 'Try Again'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 border border-gray-300 rounded-xl
                                        text-gray-700 font-medium
                                        hover:bg-gray-50 transition-colors"
                                >
                                    {isVi ? 'Đóng' : 'Close'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
