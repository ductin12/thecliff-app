'use client';

import { Service } from '@/types';
import { useTranslation, getServiceName } from '@/i18n';

interface ServiceButtonProps {
    service: Service;
    onClick: () => void;
}

export default function ServiceButton({ service, onClick }: ServiceButtonProps) {
    const { t } = useTranslation();
    const translatedName = getServiceName(t, service.id);

    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center 
                 bg-white rounded-2xl p-4 
                 shadow-md hover:shadow-lg 
                 transition-all duration-300
                 active:scale-95 
                 border border-gray-100
                 min-h-[100px]
                 hover:border-[#1A4D2E]/20"
            aria-label={translatedName}
        >
            {/* Icon */}
            <div className="text-3xl mb-2">
                {service.icon}
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {translatedName}
            </span>
        </button>
    );
}
