// Service types and interfaces

export type ServiceAction = 'link' | 'phone' | 'modal' | 'zalo';
export type ModalType = 'wifi' | 'social' | 'housekeeping';
export type Locale = 'en' | 'vi' | 'ru' | 'fr' | 'ko';

export interface Service {
    id: string;
    name: string;
    icon: string;
    action: ServiceAction;
    url?: string;
    phone?: string;
    modalType?: ModalType;
}

export interface SocialLink {
    platform: 'facebook' | 'instagram' | 'youtube';
    url: string;
    icon: string;
}

export interface WiFiConfig {
    ssid: string;
    password: string;
    securityType: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
}

export interface PhoneContact {
    name: string;
    number: string;
}
