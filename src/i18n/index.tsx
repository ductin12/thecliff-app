// i18n index - translation context and hooks
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { en, Translations } from './en';
import { vi } from './vi';
import { ru } from './ru';
import { fr } from './fr';
import { ko } from './ko';
import type { Locale } from '@/types';

// All translations
const translations: Record<Locale, Translations> = {
    en,
    vi,
    ru,
    fr,
    ko,
};

// Context type
interface I18nContextType {
    locale: Locale;
    t: Translations;
    setLocale: (locale: Locale) => void;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider props
interface I18nProviderProps {
    children: ReactNode;
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

// Provider component
export function I18nProvider({ children, locale, setLocale }: I18nProviderProps) {
    const t = translations[locale] || translations.en;

    return (
        <I18nContext.Provider value= {{ locale, t, setLocale }
}>
    { children }
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
}

// Get service name by ID
export function getServiceName(t: Translations, serviceId: string): string {
    const serviceMap: Record<string, keyof Translations['services']> = {
        'home': 'home',
        'vista': 'vistaRestaurant',
        'book-table': 'bookTable',
        'spa': 'zestSpa',
        'front-desk': 'frontDesk',
        'housekeeping': 'housekeeping',
        'book-room': 'bookRoom',
        'services': 'guestServices',
        'activities': 'activities',
        'gallery': 'shareMemory',
        'social': 'socialMedia',
    };

    const key = serviceMap[serviceId];
    return key ? t.services[key] : serviceId;
}
