'use client';

import { Service } from '@/types';
import ServiceButton from './ServiceButton';

interface ServiceGridProps {
    services: Service[];
    onServiceClick: (service: Service) => void;
}

export default function ServiceGrid({ services, onServiceClick }: ServiceGridProps) {
    return (
        <main className="flex-1 py-6 px-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto sm:gap-4">
                {services.map((service) => (
                    <ServiceButton
                        key={service.id}
                        service={service}
                        onClick={() => onServiceClick(service)}
                    />
                ))}
            </div>
        </main>
    );
}
