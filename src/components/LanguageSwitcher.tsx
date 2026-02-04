'use client';

import { useState } from 'react';
import { APP_CONFIG } from '@/lib/constants';
import type { Locale } from '@/types';

const languageNames: Record<Locale, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
    ru: 'Русский',
    fr: 'Français',
    ko: '한국어',
};

const languageFlags: Record<Locale, string> = {
    en: '🇬🇧',
    vi: '🇻🇳',
    ru: '🇷🇺',
    fr: '🇫🇷',
    ko: '🇰🇷',
};

interface LanguageSwitcherProps {
    currentLocale: Locale;
    onLocaleChange: (locale: Locale) => void;
}

export default function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 z-30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm 
                   px-3 py-2 rounded-full shadow-lg
                   border border-gray-200 hover:border-gray-300
                   transition-all"
            >
                <span>{languageFlags[currentLocale]}</span>
                <span className="text-sm font-medium text-gray-700">
                    {currentLocale.toUpperCase()}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-lg 
                          border border-gray-100 overflow-hidden min-w-[160px]">
                        {APP_CONFIG.supportedLocales.map((locale) => (
                            <button
                                key={locale}
                                onClick={() => {
                                    onLocaleChange(locale);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 w-full px-4 py-3 text-left
                           hover:bg-gray-50 transition-colors
                           ${locale === currentLocale ? 'bg-[#1A4D2E]/5' : ''}`}
                            >
                                <span>{languageFlags[locale]}</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {languageNames[locale]}
                                </span>
                                {locale === currentLocale && (
                                    <span className="ml-auto text-[#1A4D2E]">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
