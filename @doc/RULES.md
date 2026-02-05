# The Cliff Resort PWA - Developer Rules & Guidelines

> Tài liệu này giúp lập trình viên mới nhanh chóng hiểu cấu trúc dự án và tuân thủ các quy tắc phát triển.

## 📁 Cấu Trúc Dự Án

```
Thecliff-app/
├── @doc/                    # Tài liệu dự án (BẮT BUỘC đọc trước khi code)
├── data/                    # Database JSON (config.json)
├── logs/                    # Application logs
├── public/                  # Static assets (images, icons)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   └── api/            # API routes
│   ├── components/          # React components
│   ├── config/              # App configuration
│   ├── hooks/               # Custom React hooks
│   ├── i18n/                # Translations (en, vi)
│   ├── lib/                 # Utilities & constants
│   └── types/               # TypeScript type definitions
└── package.json
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev -- -p 3001

# 3. Access
# Guest App: http://localhost:3001
# Admin Panel: http://localhost:3001/admin
# Admin Password: thecliff@admin2026 (xem .env.local)
```

## 📋 Quy Tắc Phát Triển

### 1. Components
- **Location**: `src/components/`
- **Naming**: PascalCase (e.g., `SurveyModal.tsx`)
- **Pattern**: Functional components với TypeScript
- **State**: Use `useState`, `useCallback`, `useRef` appropriately

### 2. API Routes
- **Location**: `src/app/api/`
- **Pattern**: RESTful (GET, POST, PATCH, DELETE)
- **Response**: Always return `{ success: boolean, data?: any, error?: string }`
- **Auth**: Admin routes require password authentication

### 3. Translations (i18n)
- **Files**: `src/i18n/en.ts`, `src/i18n/vi.ts`
- **Rule**: Mỗi text hiển thị PHẢI có bản dịch cả EN và VI
- **Usage**: `const { t } = useTranslation();` then `t.key.subkey`

### 4. Types
- **Location**: `src/types/`
- **Rule**: Define types before implementing features
- **Files**:
  - `index.ts` - Guest app types
  - `admin.ts` - Admin panel types

### 5. Database
- **File**: `data/config.json`
- **Access**: Use functions from `src/lib/database.ts`
- **Rule**: NEVER modify config.json directly, always use API

### 6. Styling
- **Framework**: Tailwind CSS
- **Colors**: Use brand colors defined in config
  - Primary: `#1A4D2E` (dark green)
  - Secondary: `#2D6B45` (lighter green)
  - Emergency: `#DC2626` (red)

## ⚠️ Những Điều KHÔNG Được Làm

1. ❌ **KHÔNG** hardcode text - phải dùng i18n
2. ❌ **KHÔNG** edit config.json trực tiếp
3. ❌ **KHÔNG** commit .env.local hoặc logs/*.log
4. ❌ **KHÔNG** dùng `any` type - define proper types
5. ❌ **KHÔNG** bỏ qua TypeScript errors

## ✅ Checklist Trước Khi Commit

- [ ] `npm run build` không có lỗi
- [ ] Đã test trên cả guest app và admin panel
- [ ] Đã thêm translations nếu có text mới
- [ ] Đã update docs nếu thêm feature mới
- [ ] Code đã được format đúng

## 📚 Đọc Thêm

| File | Nội dung |
|------|----------|
| `@doc/00-index.md` | Mục lục tài liệu |
| `@doc/01-project-overview.md` | Tổng quan dự án |
| `@doc/04-component-spec.md` | Chi tiết components |
| `@doc/05-api-spec.md` | API documentation |
| `@doc/10-admin-panel-spec.md` | Admin panel specs |

## 🐛 Debugging

1. Check logs: `logs/error.log`
2. Browser DevTools → Network tab
3. Check `data/config.json` for data issues
4. Restart dev server if hot reload fails

## 📞 Contacts

- Project Lead: [Contact Info]
- DevOps: [Contact Info]
