# TECHNICAL STACK SPECIFICATION

## 1. Công nghệ chính (Core Technologies)

### 1.1 Frontend Framework
```
Framework: Next.js 14+ (React-based)
Lý do chọn:
- Server-side rendering (SSR) cho SEO
- Static export cho performance
- Built-in routing
- Image optimization
- PWA support via next-pwa
```

### 1.2 Styling
```
Framework: Tailwind CSS v3.4+
UI Library: shadcn/ui (optional)
Lý do chọn:
- Mobile-first responsive
- Utility-first cho rapid development
- Bundle size nhỏ với purge
- Custom theming dễ dàng
```

### 1.3 PWA Support
```
Package: next-pwa
Service Worker: Workbox
Manifest: Custom manifest.json
```

---

## 2. Project Structure

```
/thecliff-app
├── /public
│   ├── /icons              # PWA icons (192, 512)
│   ├── /images             # Logo, banner, assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service Worker (generated)
│   └── favicon.ico
│
├── /src
│   ├── /app                # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   │
│   ├── /components
│   │   ├── Header.tsx      # Logo + WiFi button
│   │   ├── ServiceGrid.tsx # Main grid buttons
│   │   ├── ServiceButton.tsx # Individual button
│   │   ├── Footer.tsx      # Contact + Social
│   │   ├── WiFiModal.tsx   # WiFi connect modal
│   │   ├── EmergencyButton.tsx # SOS floating button
│   │   └── SocialModal.tsx # Social media popup
│   │
│   ├── /hooks
│   │   ├── useWiFiConnect.ts
│   │   └── useAnalytics.ts
│   │
│   ├── /lib
│   │   ├── analytics.ts    # GA4 tracking
│   │   ├── constants.ts    # URLs, phone numbers
│   │   └── utils.ts        # Helper functions
│   │
│   └── /types
│       └── index.ts        # TypeScript types
│
├── /config
│   └── services.json       # Service button config
│
├── .env.local              # Environment variables
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
├── package.json
├── Dockerfile              # Docker config
├── docker-compose.yml      # Docker Compose
└── README.md
```

---

## 3. Dependencies

### 3.1 Production Dependencies
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-pwa": "^5.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### 3.2 Dev Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

---

## 4. Compatibility Requirements

### 4.1 Browser Support
| Browser | Version | Status |
|---------|---------|--------|
| iOS Safari | 12+ | ✅ Required |
| Android Chrome | 70+ | ✅ Required |
| Samsung Internet | 10+ | ✅ Supported |
| Firefox Mobile | 68+ | ✅ Supported |

### 4.2 Device Support
| Screen Size | Range | Layout |
|-------------|-------|--------|
| Mobile Small | 320px - 375px | 2 columns |
| Mobile Medium | 376px - 428px | 3 columns |
| Mobile Large | 429px - 767px | 3 columns |
| Tablet | 768px+ | 4 columns |

### 4.3 Orientation Support
- ✅ Portrait mode (primary)
- ✅ Landscape mode (responsive)

---

## 5. Performance Requirements

### 5.1 Core Web Vitals Targets
| Metric | Target | Max |
|--------|--------|-----|
| LCP (Largest Contentful Paint) | < 1.5s | 2.5s |
| FID (First Input Delay) | < 50ms | 100ms |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.1 |
| TTI (Time to Interactive) | < 2s | 3s |

### 5.2 Network Performance
| Condition | Load Time Target |
|-----------|------------------|
| 4G Fast | < 1.5s |
| 4G Slow | < 2.5s |
| 3G | < 4s |

### 5.3 Asset Optimization
- Images: WebP format, responsive srcset
- Icons: SVG hoặc optimized PNG
- JavaScript: Code splitting, tree shaking
- CSS: Purge unused utilities

---

## 6. PWA Configuration

### 6.1 manifest.json
```json
{
  "name": "The Cliff Resort Services",
  "short_name": "TheCliff",
  "description": "In-room services for The Cliff Resort guests",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#1A4D2E",
  "theme_color": "#1A4D2E",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 6.2 Service Worker Strategy
```javascript
// Caching strategies
const CACHE_STRATEGIES = {
  static: 'CacheFirst',      // CSS, JS, Images
  dynamic: 'NetworkFirst',   // API calls
  images: 'StaleWhileRevalidate'
};

// Pre-cache assets
const PRE_CACHE = [
  '/',
  '/icons/icon-192.png',
  '/images/logo.png',
  '/offline.html'
];
```

---

## 7. Environment Variables

### 7.1 Required Variables
```env
# App Config
NEXT_PUBLIC_APP_URL=https://app.thecliffresort.com.vn
NEXT_PUBLIC_APP_NAME="The Cliff Resort Services"

# WiFi Config (sensitive - không expose trong client)
WIFI_SSID=TheCliffResort_Guest
WIFI_PASSWORD=********

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API endpoints (nếu có)
NEXT_PUBLIC_API_URL=https://api.thecliffresort.com.vn
```

### 7.2 Environment Files
```
.env.local          # Local development (git ignored)
.env.development    # Development server
.env.production     # Production build
.env.test          # Test environment
```

---

## 8. Security Considerations

### 8.1 Sensitive Data Handling
- ❌ KHÔNG hardcode WiFi password trong source
- ✅ Sử dụng environment variables
- ✅ Rate limiting cho emergency calls
- ✅ Input sanitization

### 8.2 HTTPS Requirements
- ✅ SSL certificate bắt buộc
- ✅ HSTS headers
- ✅ Secure cookies

### 8.3 Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' www.googletagmanager.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
  }
];
```

---

## 9. Accessibility (A11y)

### 9.1 WCAG 2.1 AA Compliance
| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Color Contrast | > 4.5:1 | Tailwind color checks |
| Focus Visible | Required | focus:ring classes |
| Touch Target | > 44x44px | min-h-11 min-w-11 |
| Screen Reader | Required | ARIA labels |
| Font Size | > 14px | text-sm minimum |

### 9.2 Keyboard Navigation
- ✅ Tất cả buttons focusable
- ✅ Tab order logic
- ✅ Enter/Space activation
- ✅ Skip links

---

**Document Version**: 1.0  
**Created**: 2026-02-04  
**Author**: Development Team
