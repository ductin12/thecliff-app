'use client';

import { useState, useCallback } from 'react';
import { I18nProvider } from '@/i18n';
import Header from '@/components/Header';
import ServiceGrid from '@/components/ServiceGrid';
import Footer from '@/components/Footer';
import WiFiModal from '@/components/WiFiModal';
import HousekeepingModal from '@/components/HousekeepingModal';
import SurveyModal from '@/components/SurveyModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { services } from '@/config/services';
import { Service, Locale } from '@/types';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Home() {
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isHousekeepingModalOpen, setIsHousekeepingModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  // Analytics tracking
  const { trackButtonClick } = useAnalytics();

  const handleWifiClick = useCallback(() => {
    trackButtonClick('wifi', 'WiFi');
    setIsWifiModalOpen(true);
  }, [trackButtonClick]);

  const handleServiceClick = useCallback((service: Service) => {
    // Track button click
    trackButtonClick(service.id, service.name);

    switch (service.action) {
      case 'link':
        if (service.url) {
          window.open(service.url, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'phone':
        if (service.phone) {
          window.location.href = `tel:${service.phone.replace(/\s/g, '')}`;
        }
        break;
      case 'modal':
        if (service.modalType === 'wifi') {
          setIsWifiModalOpen(true);
        } else if (service.modalType === 'housekeeping') {
          setIsHousekeepingModalOpen(true);
        } else if (service.modalType === 'survey') {
          setIsSurveyModalOpen(true);
        }
        break;
      case 'zalo':
        window.open(SOCIAL_LINKS.zalo, '_blank', 'noopener,noreferrer');
        break;
    }
  }, [trackButtonClick]);

  return (
    <I18nProvider locale={currentLocale} setLocale={setCurrentLocale}>
      <div className="min-h-screen min-h-dvh flex flex-col">
        {/* Language Switcher */}
        <LanguageSwitcher
          currentLocale={currentLocale}
          onLocaleChange={setCurrentLocale}
        />

        {/* Header with WiFi Button */}
        <Header onWifiClick={handleWifiClick} />

        {/* Service Grid */}
        <ServiceGrid
          services={services}
          onServiceClick={handleServiceClick}
        />

        {/* Footer */}
        <Footer />

        {/* Modals */}
        <WiFiModal
          isOpen={isWifiModalOpen}
          onClose={() => setIsWifiModalOpen(false)}
        />
        <HousekeepingModal
          isOpen={isHousekeepingModalOpen}
          onClose={() => setIsHousekeepingModalOpen(false)}
        />
        <SurveyModal
          isOpen={isSurveyModalOpen}
          onClose={() => setIsSurveyModalOpen(false)}
        />
      </div>
    </I18nProvider>
  );
}
