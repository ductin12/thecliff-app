# PROJECT OVERVIEW - THE CLIFF RESORT IN-ROOM SERVICES PWA

## 1. Giới thiệu dự án

### 1.1 Mục đích
Xây dựng **Progressive Web App (PWA)** cho The Cliff Resort Mui Ne, cho phép khách lưu trú tại 200 phòng resort truy cập nhanh các dịch vụ thông qua **QR Code** được chiếu trên TV trong phòng.

### 1.2 Mục tiêu chính
- ✅ Cung cấp trải nghiệm mobile-first cho khách hàng
- ✅ Không cần cài đặt app - chạy trực tiếp trên trình duyệt
- ✅ Tích hợp kết nối WiFi nhanh chóng
- ✅ Truy cập dịch vụ resort chỉ với 1 chạm
- ✅ Nút khẩn cấp SOS luôn sẵn sàng

### 1.3 Phương thức truy cập
1. Khách quét **QR Code** từ video trên TV trong phòng
2. Mở trực tiếp trên trình duyệt di động
3. **Không cần cài đặt app**

---

## 2. Target Users (Đối tượng sử dụng)

| Đối tượng | Đặc điểm | Yêu cầu UI/UX |
|-----------|----------|---------------|
| Khách Việt Nam | Tiếng Việt, quen smartphone | UI tiếng Việt, icon rõ ràng |
| Khách quốc tế | English, diverse devices | Bilingual support (EN/VI) |
| Khách lớn tuổi | Cần font to, UI đơn giản | Font min 14px, touch target lớn |
| Khách khẩn cấp | Cần truy cập nhanh SOS | Nút SOS nổi bật, 1 chạm |
| **Nhân viên** | Quản lý orders, requests | Admin dashboard |
| **Admin** | Quản lý toàn bộ hệ thống | Full admin panel |

---

## 3. Danh sách tính năng (Features)

### 3.1 ✅ Phase 1: Core Features (MVP - COMPLETED)

| # | Feature | Mô tả | Status |
|---|---------|-------|--------|
| 1 | WiFi Connect | Kết nối WiFi resort nhanh | ✅ Done |
| 2 | Home | Link trang chủ resort | ✅ Done |
| 3 | Vista Restaurant | Xem menu nhà hàng | ✅ Done |
| 4 | Book Table | Đặt bàn Vista Restaurant | ✅ Done |
| 5 | Zest Spa | Xem dịch vụ spa | ✅ Done |
| 6 | Front Desk | Gọi điện lễ tân | ✅ Done |
| 7 | Housekeeping | Yêu cầu dọn phòng | ✅ Done |
| 8 | Book Room | Đặt phòng thêm | ✅ Done |
| 9 | Guest Services | Thông tin dịch vụ | ✅ Done |
| 10 | Activities | Hoạt động giải trí | ✅ Done |
| 11 | Share Memory | Guest book | ✅ Done |
| 12 | Social Media | FB/IG/Zalo links | ✅ Done |
| 13 | Emergency/SOS | Gọi khẩn cấp | ✅ Done |
| 14 | Admin Panel | Quản lý buttons, phones, forms | ✅ Done |
| 15 | Analytics | Page views, button clicks | ✅ Done |
| 16 | Survey Form | Đánh giá khách hàng | ✅ Done |

### 3.2 🔄 Phase 2: Customer Management

| # | Feature | Mô tả | Priority |
|---|---------|-------|----------|
| 1 | **Customer Login** | Đăng nhập bằng email/phone | 🔴 High |
| 2 | **Profile Management** | Xem/sửa thông tin cá nhân | 🔴 High |
| 3 | **Booking History** | Lịch sử đặt phòng | 🔴 High |
| 4 | **Loyalty Points** | Điểm thưởng tích lũy | 🟡 Medium |
| 5 | **Membership Tiers** | Hạng thành viên (Silver, Gold, Platinum) | 🟡 Medium |
| 6 | **CRM Integration** | Sync data với CRM (vtiger) | 🔴 High |

### 3.3 📋 Phase 3: Booking System

| # | Feature | Mô tả | Priority |
|---|---------|-------|----------|
| 1 | **Room Availability** | Xem phòng trống | 🔴 High |
| 2 | **Online Booking** | Đặt phòng trực tiếp | 🔴 High |
| 3 | **Booking Management** | Xem/hủy/sửa booking | 🔴 High |
| 4 | **Rate Calendar** | Xem giá phòng theo ngày | 🟡 Medium |
| 5 | **Special Requests** | Yêu cầu đặc biệt (extra bed, view) | 🟡 Medium |
| 6 | **Booking Confirmation** | Email/SMS xác nhận | 🔴 High |

### 3.4 🍽️ Phase 4: Food Ordering

| # | Feature | Mô tả | Priority |
|---|---------|-------|----------|
| 1 | **Menu Management** | Admin thêm/sửa/xóa món ăn | 🔴 High |
| 2 | **Food Categories** | Phân loại: Appetizers, Main, Drinks,... | 🔴 High |
| 3 | **Menu Display** | Khách xem menu với hình ảnh, giá | 🔴 High |
| 4 | **Shopping Cart** | Giỏ hàng, thêm/bớt món | 🔴 High |
| 5 | **Order Placement** | Đặt món, chọn giờ giao | 🔴 High |
| 6 | **Order Tracking** | Theo dõi trạng thái order | 🔴 High |
| 7 | **Simple Billing** | Tính tiền, in bill | 🟡 Medium |
| 8 | **Order History** | Lịch sử order | 🟡 Medium |

### 3.5 👥 Phase 5: Staff Management

| # | Feature | Mô tả | Priority |
|---|---------|-------|----------|
| 1 | **Role-based Access** | Admin, Manager, Staff, Guest | 🔴 High |
| 2 | **Staff Accounts** | Quản lý tài khoản nhân viên | 🔴 High |
| 3 | **Permissions** | Phân quyền theo role | 🔴 High |
| 4 | **Activity Logs** | Theo dõi hoạt động | 🟡 Medium |
| 5 | **Task Assignment** | Phân công task housekeeping | 🟡 Medium |

### 3.6 PWA Features
- ✅ Installable trên home screen
- ✅ Offline capability (basic)
- ✅ Service Worker caching
- ✅ manifest.json đầy đủ
- ✅ Icons 192x192 & 512x512
- 🔄 Push notifications (Phase 2+)

---

## 4. Phạm vi dự án (Scope)

### 4.1 Phase 1 (MVP) - ✅ COMPLETED
- ✅ PWA frontend với React.js/Next.js
- ✅ Responsive design (320px - 768px)
- ✅ PWA manifest & service worker
- ✅ WiFi connect modal
- ✅ Phone call integration
- ✅ External link integration
- ✅ Admin panel (basic CRUD)
- ✅ Analytics tracking
- ✅ Survey/feedback form

### 4.2 Phase 2-5 (Future)
- 🔄 Database migration (JSON → Supabase)
- 🔄 Customer authentication
- 🔄 CRM API integration
- 🔄 Booking system
- 🔄 Food ordering system
- 🔄 Staff management
- 🔄 Payment integration
- 🔄 Push notifications

---

## 5. Database Strategy

> [!IMPORTANT]
> Chi tiết tại: [11-database-recommendation.md](./11-database-recommendation.md)

### 5.1 Current (Phase 1)
- **Database**: JSON file (`data/config.json`)
- **Suitable for**: Static config, low-volume data

### 5.2 Future (Phase 2+)
- **Recommended**: **Supabase (PostgreSQL)**
- **Reasons**:
  - Relational data (bookings, orders)
  - Built-in authentication
  - Real-time subscriptions
  - File storage (food images)
  - Free tier generous

### 5.3 Migration Path
```
Phase 1 (Current): JSON file
    ↓
Phase 2: Supabase setup + Auth migration
    ↓
Phase 3: Booking tables + CRM sync
    ↓
Phase 4: Food ordering tables
    ↓
Phase 5: Staff/roles tables
```

---

## 6. Thông tin thương hiệu

### 6.1 Brand Colors
```css
Primary: #1A4D2E    /* Xanh rêu - từ logo */
Secondary: #F4E4C1  /* Vàng nhạt - từ banner */
Accent: #FF6B35     /* Cam nhấn */
Emergency: #DC2626  /* Đỏ - nút khẩn cấp */
Background: #FFFFFF /* Trắng */
Text: #1F2937       /* Xám đậm */
```

### 6.2 Typography
- **Font chính**: Inter, Roboto hoặc system fonts
- **Tiêu đề**: 18-24px, Bold
- **Nút chức năng**: 14-16px, Medium
- **Footer**: 12-14px, Regular

### 6.3 Assets
- **Logo**: `https://thecliffresort.com.vn/wp-content/uploads/2025/11/logo-thecliff-white.png`
- **Banner**: `https://thecliffresort.com.vn/wp-content/uploads/2025/11/banner-the-cliff-2.jpg`

---

## 7. Thông tin liên hệ

### 7.1 URLs và Hotlines
| Service | URL/Number |
|---------|------------|
| Website | https://thecliffresort.com.vn |
| Vista Restaurant | https://thecliffresort.com.vn/vista-restaurant/ |
| Zest Spa | https://thecliffresort.com.vn/zest-spa/ |
| Booking | https://thecliffresort.com.vn/rooms/ |
| Hotline | 1900 0394 |
| Reservation | +84 252 3719 111 |

### 7.2 Social Media
| Platform | URL |
|----------|-----|
| Facebook | https://www.facebook.com/TheCliffVietnam/ |
| Instagram | https://www.instagram.com/thecliffresort_official/ |
| Zalo | https://zalo.me/thecliffresortmuine |
| Youtube | https://www.youtube.com/@thecliffresortresidencesmuine |

---

## 8. API Integrations (Future)

| API | Purpose | Priority |
|-----|---------|----------|
| **CRM (vtiger)** | Sync customer data, loyalty points | 🔴 High |
| **PMS** | Room availability, bookings | 🔴 High |
| **Payment Gateway** | Online payments | 🟡 Medium |
| **SMS Gateway** | OTP, notifications | 🟡 Medium |
| **Email Service** | Booking confirmations | 🟡 Medium |

---

## 9. Roadmap Timeline

```
2026 Q1: Phase 1 MVP ✅ COMPLETED
2026 Q2: Phase 2 Customer Management
2026 Q3: Phase 3 Booking System
2026 Q4: Phase 4 Food Ordering
2027 Q1: Phase 5 Staff Management + Optimization
```

---

**Document Version**: 2.0  
**Created**: 2026-02-04  
**Last Updated**: 2026-02-05  
**Author**: Development Team

