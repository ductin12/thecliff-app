'use client';

import Image from 'next/image';
import { BRAND_ASSETS } from '@/lib/constants';
import { useTranslation } from '@/i18n';

interface HeaderProps {
    onWifiClick: () => void;
}

export default function Header({ onWifiClick }: HeaderProps) {
    const { t } = useTranslation();

    return (
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

                {/* WiFi Button */}
                <button
                    onClick={onWifiClick}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                     px-6 py-3 rounded-full transition-all duration-300 
                     border border-white/30 shadow-lg hover:shadow-xl
                     active:scale-95"
                    aria-label="Connect to WiFi"
                >
                    <span className="text-xl">📶</span>
                    <span className="font-medium">{t.header.connectWifi}</span>
                </button>
            </div>
        </header>
    );
}
