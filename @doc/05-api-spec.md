# API & SERVICES SPECIFICATION

## 1. Overview

The Cliff Resort PWA is primarily a frontend application with minimal backend requirements. This document outlines the external services and integrations.

---

## 2. External URLs & Endpoints

### 2.1 Resort Website Links

| Service | URL | Purpose |
|---------|-----|---------|
| Home | `https://thecliffresort.com.vn` | Main website |
| Vista Restaurant | `https://thecliffresort.com.vn/vista-restaurant/` | Restaurant menu |
| Book Table | `https://thecliffresort.com.vn/vista-restaurant/#booking` | Table reservation |
| Zest Spa | `https://thecliffresort.com.vn/zest-spa/` | Spa services |
| Rooms | `https://thecliffresort.com.vn/rooms/` | Room booking |
| Contact | `https://thecliffresort.com.vn/contact/` | Guest services |
| Blog/Activities | `https://thecliffresort.com.vn/blogs/` | Activities info |
| Guest Book | `https://thecliffresort.com.vn/guest-book/` | Photo sharing |

### 2.2 Social Media Links

| Platform | URL |
|----------|-----|
| Facebook | `https://www.facebook.com/TheCliffVietnam/` |
| Instagram | `https://www.instagram.com/thecliffresort_official/` |
| Zalo | `https://zalo.me/thecliffresortmuine` |

---

## 3. Phone Services (tel: links)

### 3.1 Phone Numbers Configuration

```typescript
// src/lib/constants.ts

export const PHONE_NUMBERS = {
  hotline: '19000394',
  reservation: '+842523719111',
  frontDesk: '+842523719111',
  housekeeping: '+842523719111', // Extension TBD
  emergency: '19000394',
  spa: '+842523719111', // Extension TBD
} as const;

// Format for display
export const formatPhone = (phone: string): string => {
  if (phone.startsWith('+84')) {
    return phone.replace('+84', '(+84) ').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone.replace(/(\d{4})(\d{4})/, '$1 $2');
};
```

### 3.2 Phone Call Handler

```typescript
// src/lib/phone.ts

export const makePhoneCall = (phoneNumber: string, serviceName?: string) => {
  // Track analytics
  if (serviceName) {
    trackEvent('phone_call', {
      service: serviceName,
      number: phoneNumber
    });
  }
  
  // Navigate to tel: link
  window.location.href = `tel:${phoneNumber}`;
};

export const makeEmergencyCall = () => {
  // Show confirmation first
  if (confirmEmergencyCall()) {
    makePhoneCall(PHONE_NUMBERS.emergency, 'emergency');
  }
};
```

---

## 4. WiFi Connection Service

### 4.1 WiFi Configuration

```typescript
// src/lib/wifi.ts

interface WiFiConfig {
  ssid: string;
  password: string;
  securityType: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
}

// Load from environment (server-side only)
export const getWiFiConfig = (): WiFiConfig => ({
  ssid: process.env.WIFI_SSID || 'TheCliffResort_Guest',
  password: process.env.WIFI_PASSWORD || '',
  securityType: 'WPA'
});
```

### 4.2 WiFi Connect Handler

```typescript
// src/hooks/useWiFiConnect.ts

export const useWiFiConnect = () => {
  const [showModal, setShowModal] = useState(false);
  const config = useWiFiConfig();
  
  const connect = () => {
    // Detect platform
    if (isAndroid()) {
      // Try Android WiFi intent
      const wifiUri = `WIFI:T:${config.securityType};S:${config.ssid};P:${config.password};;`;
      window.location.href = wifiUri;
      
      // Fallback to modal after timeout
      setTimeout(() => {
        if (!document.hidden) {
          setShowModal(true);
        }
      }, 1000);
    } else {
      // iOS - show modal directly
      setShowModal(true);
    }
    
    // Track attempt
    trackEvent('wifi_connect_attempt', {
      platform: isAndroid() ? 'android' : 'ios'
    });
  };
  
  const copyPassword = async () => {
    await navigator.clipboard.writeText(config.password);
    showToast('Password copied!');
    trackEvent('wifi_password_copied');
  };
  
  return {
    connect,
    copyPassword,
    showModal,
    setShowModal,
    config
  };
};
```

### 4.3 Platform Detection

```typescript
// src/lib/platform.ts

export const isAndroid = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/i.test(userAgent);
};

export const isIOS = (): boolean => {
  return /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isMobile = (): boolean => {
  return isAndroid() || isIOS();
};
```

---

## 5. Analytics Service (Google Analytics 4)

### 5.1 GA4 Configuration

```typescript
// src/lib/analytics.ts

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize GA
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_ID) return;
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    page_path: window.location.pathname,
  });
};
```

### 5.2 Event Tracking

```typescript
// Track custom events
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Pre-defined events
export const trackButtonClick = (buttonName: string) => {
  trackEvent('button_click', { button_name: buttonName });
};

export const trackPhoneCall = (service: string) => {
  trackEvent('phone_call', { service_name: service });
};

export const trackWiFiConnect = (platform: string) => {
  trackEvent('wifi_connect', { platform });
};

export const trackQRScan = (source: string) => {
  trackEvent('qr_scan', { source });
};
```

### 5.3 Tracked Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `page_view` | path | Automatic page views |
| `button_click` | button_name | Any service button click |
| `phone_call` | service_name | Phone call initiated |
| `wifi_connect` | platform | WiFi connection attempt |
| `wifi_password_copied` | - | Password copied |
| `qr_scan` | source | QR code scan (via UTM) |
| `emergency_call` | - | Emergency button used |
| `social_click` | platform | Social media link clicked |
| `install_prompt` | response | PWA install prompt response |

---

## 6. Service Worker & Caching

### 6.1 Cache Strategy

```javascript
// Cache-first for static assets
const CACHE_NAME = 'thecliff-v1';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/logo.png',
];

// Workbox strategies via next-pwa
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/thecliffresort\.com\.vn/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'external-content',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
});
```

### 6.2 Offline Page

```typescript
// src/app/offline/page.tsx

export default function OfflinePage() {
  return (
    <div className="offline-container">
      <h1>You're Offline</h1>
      <p>Please connect to the internet to access all services.</p>
      
      <div className="offline-actions">
        <h2>While Offline:</h2>
        <a href="tel:+842523719111">📞 Call Front Desk</a>
        <a href="tel:19000394">🚨 Emergency Call</a>
      </div>
    </div>
  );
}
```

---

## 7. QR Code Configuration

### 7.1 QR Code Parameters

```typescript
// QR Code URL structure
const QR_URL = 'https://app.thecliffresort.com.vn';

// With UTM tracking
const QR_URL_TRACKED = {
  base: 'https://app.thecliffresort.com.vn',
  params: {
    utm_source: 'tv',
    utm_medium: 'qr',
    utm_campaign: 'inroom_services'
  }
};

// Full URL
// https://app.thecliffresort.com.vn?utm_source=tv&utm_medium=qr&utm_campaign=inroom_services
```

### 7.2 QR Code Specifications

| Property | Value |
|----------|-------|
| Size | 300x300px minimum |
| Error Correction | Level H (30%) |
| Format | PNG with transparent BG |
| Quiet Zone | 4 modules |

---

## 8. Error Handling

### 8.1 Error Boundary

```typescript
// src/components/ErrorBoundary.tsx

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to analytics
    trackEvent('error', {
      error_message: error.message,
      component_stack: errorInfo.componentStack
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 8.2 Network Error Handling

```typescript
// Handle fetch errors
export const safeFetch = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    // Check if offline
    if (!navigator.onLine) {
      showToast('You are offline');
      return null;
    }
    throw error;
  }
};
```

---

## 9. Security Headers

### 9.1 Response Headers

```typescript
// next.config.js

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

**Document Version**: 1.0  
**Created**: 2026-02-04  
**Author**: Development Team
