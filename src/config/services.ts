import { Service } from '@/types';
import { EXTERNAL_URLS, PHONE_NUMBERS } from '@/lib/constants';

export const services: Service[] = [
    {
        id: 'home',
        name: 'Home',
        icon: '🏠',
        action: 'link',
        url: EXTERNAL_URLS.home,
    },
    {
        id: 'vista',
        name: 'Vista Restaurant',
        icon: '🍽️',
        action: 'link',
        url: EXTERNAL_URLS.vistaRestaurant,
    },
    {
        id: 'book-table',
        name: 'Book Table',
        icon: '📅',
        action: 'link',
        url: EXTERNAL_URLS.bookTable,
    },
    {
        id: 'spa',
        name: 'Zest Spa',
        icon: '💆',
        action: 'link',
        url: EXTERNAL_URLS.zestSpa,
    },
    {
        id: 'front-desk',
        name: 'Front Desk',
        icon: '🛎️',
        action: 'phone',
        phone: PHONE_NUMBERS.frontDesk,
    },
    {
        id: 'housekeeping',
        name: 'Housekeeping',
        icon: '🧹',
        action: 'phone',
        phone: PHONE_NUMBERS.housekeeping,
    },
    {
        id: 'book-room',
        name: 'Book Room',
        icon: '🛏️',
        action: 'link',
        url: EXTERNAL_URLS.rooms,
    },
    {
        id: 'services',
        name: 'Guest Services',
        icon: 'ℹ️',
        action: 'link',
        url: EXTERNAL_URLS.contact,
    },
    {
        id: 'activities',
        name: 'Activities',
        icon: '🏊',
        action: 'link',
        url: EXTERNAL_URLS.activities,
    },
    {
        id: 'gallery',
        name: 'Share Memory',
        icon: '📸',
        action: 'link',
        url: EXTERNAL_URLS.guestBook,
    },
    {
        id: 'social',
        name: 'Social Media',
        icon: '📱',
        action: 'modal',
        modalType: 'social',
    },
];
