# Changelog - The Cliff Resort PWA

Tất cả thay đổi quan trọng của dự án được ghi lại tại đây.

---

## [1.2.0] - 2026-02-05

### ✨ Features Mới
- **Survey Form**: Thêm form đánh giá cho khách với:
  - Đánh giá chung (5 sao)
  - Đánh giá theo tiêu chí (Phòng, Nhân viên, Ẩm thực, Bãi biển, Vệ sinh)
  - Lưu vào database và gửi webhook
  - Hiển thị trong Admin Panel → Form Submissions → Surveys

- **Analytics Tracking**: Theo dõi page views và button clicks
  - Hook `useAnalytics` cho guest app
  - API `/api/track` để ghi nhận events
  - Hiển thị trong Admin Panel Dashboard

### 🔧 Fixes
- **Emergency Button**: Di chuyển từ góc dưới-phải lên header, cạnh nút WiFi
  - Fix lỗi chồng lên chat widget
  - Giữ nguyên functionality với confirm dialog

### 📁 Files Changed
- `src/components/SurveyModal.tsx` [NEW]
- `src/components/Header.tsx` [MODIFIED] - Thêm Emergency button
- `src/components/EmergencyButton.tsx` [DEPRECATED] - Không còn sử dụng
- `src/hooks/useAnalytics.ts` [NEW]
- `src/app/api/track/route.ts` [NEW]
- `src/types/admin.ts` [MODIFIED] - Thêm SurveySubmission fields
- `src/config/services.ts` [MODIFIED] - Thêm Survey service

---

## [1.1.0] - 2026-02-05

### ✨ Features Mới
- **Admin Panel**: Hoàn thiện giao diện quản trị
  - Login với password authentication
  - Dashboard với analytics overview
  - CRUD cho: Buttons, Phones, Socials, Webhooks
  - Form Submissions management (Housekeeping, Food Orders, Surveys)

- **API Routes**: REST APIs cho admin operations
  - `/api/admin/auth` - Authentication
  - `/api/admin/buttons` - Buttons management
  - `/api/admin/phones` - Phone numbers
  - `/api/admin/socials` - Social links
  - `/api/admin/webhooks` - Webhooks
  - `/api/admin/forms` - Form submissions
  - `/api/admin/analytics` - Analytics data

### 📁 Files Changed
- `src/app/admin/` [NEW] - All admin pages
- `src/app/api/admin/` [NEW] - All admin APIs
- `src/lib/database.ts` [NEW] - Database utilities
- `src/types/admin.ts` [NEW] - Admin types

---

## [1.0.0] - 2026-02-04

### 🎉 Initial Release
- **Guest PWA Application**
  - Header với logo, welcome message, WiFi button
  - Service Grid với 12 buttons (Home, Restaurant, Spa, etc.)
  - Footer với hotline và social links
  - Language switcher (EN/VI)

- **Modals**
  - WiFi Modal với QR code
  - Housekeeping Request Modal
  - Social Links Modal

- **Core Infrastructure**
  - Next.js 16 với App Router
  - TypeScript
  - Tailwind CSS
  - i18n support (EN, VI)

---

## Versioning

Dự án sử dụng [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH**
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes
