# DATABASE RECOMMENDATION - THE CLIFF RESORT PWA

## 1. Phân Tích Yêu Cầu

### 1.1 Hiện Tại (Phase 1 - MVP)
- ✅ Đang dùng: **JSON file** (`data/config.json`)
- Data tĩnh: buttons, phones, socials, webhooks
- Analytics đơn giản: page views, button clicks
- Form submissions: housekeeping, surveys

### 1.2 Tương Lai (Phase 2+)

| Module | Data Types | Volume | Relationships |
|--------|------------|--------|---------------|
| **Customer Management** | Users, profiles, loyalty points, membership tiers | ~10K users | User ↔ Bookings, Points |
| **Staff Management** | Admin, employees, roles, permissions | ~200 users | Employee ↔ Orders |
| **Booking System** | Reservations, rooms, rates, availability | ~5K bookings/year | User ↔ Room ↔ Booking |
| **Food Menu** | Items, categories, images, prices | ~500 items | Category ↔ Items |
| **Food Orders** | Orders, items, status, billing | ~2K orders/month | User ↔ Order ↔ Items |
| **CRM Integration** | Sync with external CRM API | Real-time sync | External API |

---

## 2. So Sánh Database Options

### 2.1 Comparison Matrix

| Criteria | PostgreSQL | MongoDB | Supabase | Firebase | PlanetScale |
|----------|------------|---------|----------|----------|-------------|
| **Cost** | Free/Low | Free tier | Free tier | Free tier | Free tier |
| **Relational** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Real-time** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Auth Built-in** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Next.js Integration** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Vietnamese Support** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Hosting in Vietnam** | ✅ (self) | ✅ (Atlas) | ❌ | ❌ | ❌ |

---

## 3. 🏆 Đề Xuất: **Supabase (PostgreSQL)**

### 3.1 Lý Do Chọn Supabase

1. **PostgreSQL Core** - Relational database mạnh mẽ, phù hợp cho:
   - Quan hệ User ↔ Booking ↔ Payment
   - Inventory management (food items, rooms)
   - Transaction support (orders, billing)

2. **Built-in Authentication** - Sẵn có:
   - Email/password login
   - OAuth (Google, Facebook)
   - Phone OTP (Vietnam numbers)
   - Row Level Security (RLS)

3. **Real-time Subscriptions** - Hữu ích cho:
   - Live order status updates
   - Housekeeping request tracking
   - Admin dashboard real-time

4. **Storage** - Lưu trữ files:
   - Food item images
   - User avatars
   - Invoice PDFs

5. **Edge Functions** - Serverless:
   - Webhook processing
   - CRM sync
   - Payment callbacks

6. **Free Tier Generous**:
   - 500MB database
   - 1GB storage
   - 2M function invocations/month
   - Đủ cho MVP và initial growth

### 3.2 Tech Stack Đề Xuất

```
Frontend: Next.js 16 (App Router)
Database: Supabase (PostgreSQL)
ORM: Prisma (type-safe queries)
Auth: Supabase Auth + NextAuth.js
Storage: Supabase Storage
Real-time: Supabase Realtime
Hosting: Vercel
```

---

## 4. Database Schema (Đề Xuất)

### 4.1 Core Tables

```sql
-- USERS & AUTH
users (id, email, phone, full_name, avatar_url, role, created_at)
profiles (id, user_id, room_number, loyalty_points, membership_tier)
sessions (id, user_id, token, expires_at)

-- CUSTOMER MANAGEMENT
customers (id, crm_id, email, phone, name, tier, points, created_at)
loyalty_transactions (id, customer_id, points, type, description, created_at)

-- STAFF MANAGEMENT
employees (id, user_id, department, position, status)
roles (id, name, permissions)
employee_roles (employee_id, role_id)

-- BOOKING SYSTEM
rooms (id, number, type, floor, status, rate)
bookings (id, customer_id, room_id, check_in, check_out, status, total)
booking_services (id, booking_id, service_type, status, created_at)

-- FOOD ORDERING
categories (id, name_en, name_vi, icon, order)
menu_items (id, category_id, name_en, name_vi, description, price, image_url, available)
orders (id, customer_id, room_number, status, subtotal, tax, total, created_at)
order_items (id, order_id, menu_item_id, quantity, price, notes)

-- ANALYTICS & LOGS
analytics_events (id, type, target, metadata, user_id, created_at)
form_submissions (id, type, data, status, created_at)
```

### 4.2 Entity Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  users   │────▶│ profiles │     │  roles   │
└──────────┘     └──────────┘     └──────────┘
     │                               │
     ▼                               ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│customers │────▶│ bookings │◀────│  rooms   │
└──────────┘     └──────────┘     └──────────┘
     │                               
     ▼                               
┌──────────┐     ┌──────────┐     ┌────────────┐
│  orders  │────▶│order_item│◀────│ menu_items │
└──────────┘     └──────────┘     └────────────┘
                                        ▲
                                        │
                                  ┌──────────┐
                                  │categories│
                                  └──────────┘
```

---

## 5. Migration Plan

### Phase 1: Chuẩn Bị (1 week)
- [ ] Tạo Supabase project
- [ ] Setup Prisma schema
- [ ] Configure environment variables
- [ ] Create migration scripts

### Phase 2: Core Migration (2 weeks)
- [ ] Migrate config data từ JSON
- [ ] Setup authentication
- [ ] Migrate form submissions
- [ ] Migrate analytics data

### Phase 3: New Features (4+ weeks)
- [ ] Customer management module
- [ ] Food ordering system
- [ ] Booking integration
- [ ] CRM API sync

---

## 6. Alternatives

### 6.1 Nếu Muốn Self-Hosted
**PostgreSQL + Prisma + NextAuth**
- Full control
- No vendor lock-in
- Cần DevOps skill

### 6.2 Nếu Cần Max Scalability
**PlanetScale (MySQL)**
- Serverless MySQL
- Unlimited connections
- Auto-scaling
- Tốt cho high-traffic

### 6.3 Nếu Budget Thấp
**SQLite + Turso**
- Embedded database
- Edge-ready
- Very low cost

---

## 7. Kết Luận

> [!IMPORTANT]
> **Đề xuất: Supabase (PostgreSQL)** là lựa chọn tốt nhất cho dự án này vì:
> 1. ✅ Hỗ trợ relational data (bookings, orders)
> 2. ✅ Built-in auth (tiết kiệm thời gian)
> 3. ✅ Real-time cho order tracking
> 4. ✅ Storage cho food images
> 5. ✅ Free tier đủ dùng cho MVP
> 6. ✅ Dễ integrate với Next.js

---

**Document Version**: 1.0  
**Created**: 2026-02-05  
**Author**: Development Team
