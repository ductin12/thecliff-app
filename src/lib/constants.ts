// Environment variables for The Cliff Resort PWA

// WiFi Configuration
export const WIFI_CONFIG = {
  ssid: 'Thecliff',
  password: '123456',
  securityType: 'WPA' as const,
};

// Phone Numbers
export const PHONE_NUMBERS = {
  hotline: '+84 2523 719 111',
  frontDesk: '+84 2523 719 111',
  housekeeping: '+84 2523 719 111',
  security: '+84 2523 719 123',
  medical: '+84 2523 719 123',
  emergency: '+84 2523 719 123',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  home: 'https://thecliffresort.com.vn',
  vistaRestaurant: 'https://thecliffresort.com.vn/vista-restaurant/',
  bookTable: 'https://thecliffresort.com.vn/vista-restaurant/#booking',
  zestSpa: 'https://thecliffresort.com.vn/zest-spa/',
  rooms: 'https://thecliffresort.com.vn/rooms/',
  contact: 'https://thecliffresort.com.vn/contact/',
  activities: 'https://thecliffresort.com.vn/blogs/',
  guestBook: 'https://thecliffresort.com.vn/guest-book/',
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/TheCliffVietnam/',
  instagram: 'https://www.instagram.com/thecliffresort_official/',
  zalo: 'https://zalo.me/thecliffresortmuine',
} as const;

// Brand Assets
export const BRAND_ASSETS = {
  logo: 'https://thecliffresort.com.vn/wp-content/uploads/2025/11/logo-thecliff-white.png',
  banner: 'https://thecliffresort.com.vn/wp-content/uploads/2025/11/banner-the-cliff-2.jpg',
} as const;

// App Configuration
export const APP_CONFIG = {
  name: 'The Cliff Resort Services',
  shortName: 'TheCliff',
  description: 'In-room services for The Cliff Resort guests',
  defaultLocale: 'en',
  supportedLocales: ['en', 'vi', 'ru', 'fr', 'ko'] as const,
} as const;
