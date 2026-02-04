'use client';

import { useState, useCallback } from 'react';
import { I18nProvider } from '@/i18n';
import Header from '@/components/Header';
import ServiceGrid from '@/components/ServiceGrid';
import Footer from '@/components/Footer';
import WiFiModal from '@/components/WiFiModal';
import EmergencyButton from '@/components/EmergencyButton';
import HousekeepingModal from '@/components/HousekeepingModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { services } from '@/config/services';
import { Service, Locale } from '@/types';
import { SOCIAL_LINKS } from '@/lib/constants';

export default function Home() {
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isHousekeepingModalOpen, setIsHousekeepingModalOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  const handleWifiClick = useCallback(() => {
    setIsWifiModalOpen(true);
  }, []);

  const handleServiceClick = useCallback((service: Service) => {
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
        }
        break;
      case 'zalo':
        window.open(SOCIAL_LINKS.zalo, '_blank', 'noopener,noreferrer');
        break;
    }
  }, []);

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

        {/* Emergency Button (Fixed) */}
        <EmergencyButton />

        {/* Modals */}
        <WiFiModal
          isOpen={isWifiModalOpen}
          onClose={() => setIsWifiModalOpen(false)}
        />
        <HousekeepingModal
          isOpen={isHousekeepingModalOpen}
          onClose={() => setIsHousekeepingModalOpen(false)}
        />
      </div>
    </I18nProvider>
  );
}
