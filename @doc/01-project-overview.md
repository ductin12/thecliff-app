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

---

## 3. Danh sách tính năng (Features)

### 3.1 Core Features
| # | Feature | Mô tả | Priority |
|---|---------|-------|----------|
| 1 | WiFi Connect | Kết nối WiFi resort nhanh | 🔴 High |
| 2 | Home | Link trang chủ resort | 🟡 Medium |
| 3 | Vista Restaurant | Xem menu nhà hàng | 🔴 High |
| 4 | Book Table | Đặt bàn Vista Restaurant | 🔴 High |
| 5 | Zest Spa | Xem dịch vụ spa | 🟡 Medium |
| 6 | Front Desk | Gọi điện lễ tân | 🔴 High |
| 7 | Housekeeping | Yêu cầu dọn phòng | 🔴 High |
| 8 | Book Room | Đặt phòng thêm | 🟡 Medium |
| 9 | Guest Services | Thông tin dịch vụ | 🟡 Medium |
| 10 | Activities | Hoạt động giải trí | 🟢 Low |
| 11 | Share Memory | Guest book | 🟢 Low |
| 12 | Social Media | FB/IG/Zalo links | 🟡 Medium |
| 13 | Emergency/SOS | Gọi khẩn cấp | 🔴 Critical |

### 3.2 PWA Features
- ✅ Installable trên home screen
- ✅ Offline capability (basic)
- ✅ Service Worker caching
- ✅ manifest.json đầy đủ
- ✅ Icons 192x192 & 512x512

---

## 4. Phạm vi dự án (Scope)

### 4.1 Trong phạm vi ✅
- PWA frontend với React.js/Next.js
- Responsive design (320px - 768px)
- PWA manifest & service worker
- WiFi connect modal
- Phone call integration
- External link integration
- QR Code generation
- Analytics tracking

### 4.2 Ngoài phạm vi ❌
- Backend CMS phức tạp
- Payment integration
- Room authentication
- In-app ordering system
- Push notifications (phase 2)

---

## 5. Thông tin thương hiệu

### 5.1 Brand Colors
```css
Primary: #1A4D2E    /* Xanh rêu - từ logo */
Secondary: #F4E4C1  /* Vàng nhạt - từ banner */
Accent: #FF6B35     /* Cam nhấn */
Emergency: #DC2626  /* Đỏ - nút khẩn cấp */
Background: #FFFFFF /* Trắng */
Text: #1F2937       /* Xám đậm */
```

### 5.2 Typography
- **Font chính**: Inter, Roboto hoặc system fonts
- **Tiêu đề**: 18-24px, Bold
- **Nút chức năng**: 14-16px, Medium
- **Footer**: 12-14px, Regular

### 5.3 Assets
- **Logo**: `https://thecliffresort.com.vn/wp-content/uploads/2025/11/logo-thecliff-white.png`
- **Banner**: `https://thecliffresort.com.vn/wp-content/uploads/2025/11/banner-the-cliff-2.jpg`

---

## 6. Thông tin liên hệ

### 6.1 URLs và Hotlines
| Service | URL/Number |
|---------|------------|
| Website | https://thecliffresort.com.vn |
| Vista Restaurant | https://thecliffresort.com.vn/vista-restaurant/ |
| Zest Spa | https://thecliffresort.com.vn/zest-spa/ |
| Booking | https://thecliffresort.com.vn/rooms/ |
| Hotline | 1900 0394 |
| Reservation | +84 252 3719 111 |

### 6.2 Social Media
| Platform | URL |
|----------|-----|
| Facebook | https://www.facebook.com/TheCliffVietnam/ |
| Instagram | https://www.instagram.com/thecliffresort_official/ |
| Zalo | https://zalo.me/thecliffresortmuine |

---

## 7. Các câu hỏi cần làm rõ

> [!WARNING]
> Các thông tin sau cần được xác nhận trước khi development

1. **WiFi credentials**: SSID và password chính xác?
2. **Extension numbers**: Có số nội bộ cho từng dịch vụ?
3. **Emergency protocol**: Số điện thoại khẩn cấp ưu tiên?
4. **Ngôn ngữ**: Bilingual (Việt/Anh) hay chỉ tiếng Việt?
5. **Room service**: Có cần tích hợp order đồ ăn online?
6. **Payment**: Có cần thanh toán trực tuyến?
7. **Authentication**: Khách có cần login bằng số phòng?

---

**Document Version**: 1.0  
**Created**: 2026-02-04  
**Author**: Development Team
