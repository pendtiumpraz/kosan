# KosanHub

Platform SaaS berbasis web untuk manajemen kos-kosan, kontrakan, dan marketplace properti.

> **Status**: 🚧 Development Phase - Basic CRUD implemented, banyak fitur belum selesai

## Tech Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Framework | Next.js 15 (App Router) | ✅ |
| Language | TypeScript | ✅ |
| Database | PostgreSQL | ✅ |
| ORM | Prisma 7 | ✅ |
| Authentication | NextAuth.js v5 | ✅ |
| Styling | Tailwind CSS | ✅ |
| UI Components | shadcn/ui | ✅ |
| State Management | Zustand + React Query | ❌ Belum |
| Real-time | Socket.io | ❌ Belum |
| File Storage | Google Drive API | ❌ Belum |
| Maps | Google Maps API | ❌ Belum |
| Payment | Midtrans/Xendit | ❌ Belum |
| Email | SendGrid | ❌ Belum |
| Charts | Recharts | ❌ Belum |

## Getting Started

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, Register
│   ├── (public)/         # Landing, Listings, About, Contact, FAQ, Pricing
│   ├── (dashboard)/      # Dashboard pages (protected)
│   └── api/              # API routes
├── components/
│   ├── layout/           # Sidebar, RightPanel
│   ├── public/           # Navbar, Footer, PropertyCard
│   └── ui/               # DataTable, FormElements
├── lib/                  # Prisma, Auth, Utils
└── services/             # Business logic layer
```

## Features Status

### ✅ Implemented (Selesai)

| Feature | Deskripsi |
|---------|-----------|
| Database Schema | 18+ models dengan soft delete |
| Authentication | NextAuth.js dengan credentials & Google OAuth |
| Public Pages | Landing, Listings, Detail, About, Contact, FAQ, Pricing |
| Auth Pages | Login, Register (Owner/User) |
| Dashboard Layout | Sidebar dengan role-based menu |
| API Routes | CRUD untuk properties, rooms, residents, payments, listings, bookings |
| Services | Business logic layer |
| Role-based Menu | Menu berbeda per role (6 roles) |
| Logout | Working logout dengan redirect ke login |

### ⚠️ Partial / Basic Implementation (Belum Sempurna)

| Feature | Status | Yang Kurang |
|---------|--------|-------------|
| **Dashboard Overview** | ⚠️ Basic | Belum ada chart/grafik (Recharts), hanya statistik sederhana |
| **Properties CRUD** | ⚠️ Basic | CRUD dalam 1 halaman, belum ada Right Panel/Drawer form |
| **Rooms CRUD** | ⚠️ Basic | CRUD dalam 1 halaman, belum ada Right Panel/Drawer form |
| **Residents CRUD** | ⚠️ Basic | CRUD dalam 1 halaman, belum ada Right Panel/Drawer form |
| **Payments CRUD** | ⚠️ Basic | Belum ada upload bukti bayar, belum ada filter status |
| **Listings CRUD** | ⚠️ Basic | Belum ada image gallery, belum ada featured badge |
| **Bookings CRUD** | ⚠️ Basic | Belum ada calendar view, belum ada status flow |
| **DataTable** | ⚠️ Basic | Belum ada sorting, filtering, pagination server-side |
| **Form Validation** | ⚠️ Basic | Hanya client-side, belum comprehensive Zod validation |
| **Marketplace** | ⚠️ Basic | Belum ada Map View, belum ada advanced filter |
| **Register Owner** | ⚠️ Basic | Belum ada upload KTP & Selfie, belum ada step wizard |

---

## ❌ Belum Diimplementasi (Per Requirement Doc)

### 1. Frontend Requirements (04-frontend-requirement.md)

#### Layout & Components
| Feature | Status | Notes |
|---------|--------|-------|
| Right Panel CRUD | ❌ | Form create/edit di sidebar kanan, bukan halaman terpisah |
| Skeleton Loading | ❌ | Shimmer animation saat loading data |
| Empty States | ❌ | Ilustrasi & CTA saat data kosong |
| Error Pages | ❌ | Custom 404, 500 pages dengan ilustrasi |
| Toast Notifications | ❌ | Feedback sukses/error yang proper |
| Stat Cards | ❌ | Card statistik dengan icon dan value |
| Filter Bar | ❌ | Bar filter untuk marketplace |
| Search Autocomplete | ❌ | Search dengan suggestions |

#### Dashboard Pages (Belum Ada)
| Route | Untuk Role | Status |
|-------|------------|--------|
| `/dashboard/my-rental` | TENANT | ❌ Belum ada |
| `/dashboard/my-payments` | TENANT | ❌ Belum ada |
| `/dashboard/favorites` | USER, TENANT | ❌ Belum ada |
| `/dashboard/subscription` | OWNER, AGENT | ❌ Belum ada |
| `/dashboard/users` | SUPER_ADMIN, ADMIN | ⚠️ Basic |
| `/dashboard/reports` | SUPER_ADMIN, ADMIN | ❌ Belum ada |
| `/dashboard/analytics` | SUPER_ADMIN, ADMIN | ❌ Belum ada |

#### Forms (React Hook Form + Zod)
| Form | Status | Notes |
|------|--------|-------|
| PropertyForm | ⚠️ Basic | Belum ada image upload, map picker |
| RoomForm | ⚠️ Basic | Belum ada image upload |
| ResidentForm | ⚠️ Basic | Belum ada KTP upload, step wizard |
| PaymentForm | ⚠️ Basic | Belum ada bukti bayar upload |
| ListingForm | ⚠️ Basic | Belum ada image gallery upload |
| ProfileForm | ❌ | Halaman edit profile lengkap |

### 2. Backend Requirements (02-backend-requirement.md)

#### API Endpoints Belum Ada
| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /api/auth/forgot-password` | ❌ | Request reset password |
| `POST /api/auth/reset-password` | ❌ | Reset password dengan token |
| `POST /api/auth/verify-email` | ❌ | Verifikasi email OTP |
| `POST /api/auth/verify-phone` | ❌ | Verifikasi phone OTP |
| `GET /api/users/me` | ❌ | Get current user profile |
| `PUT /api/users/me/password` | ❌ | Change password |
| `GET /api/chats` | ❌ | List chat rooms |
| `POST /api/chats` | ❌ | Create chat room |
| `GET /api/chats/:id/messages` | ❌ | Get messages |
| `POST /api/chats/:id/messages` | ❌ | Send message |
| `POST /api/uploads` | ❌ | Upload file ke Google Drive |
| `GET /api/subscriptions/plans` | ❌ | List subscription plans |
| `POST /api/subscriptions` | ❌ | Subscribe to plan |
| `POST /api/listings/:id/favorite` | ❌ | Add to favorite |
| `GET /api/listings/search` | ❌ | Advanced search dengan filter |
| `POST /api/reports` | ❌ | Submit fraud report |

#### Backend Features
| Feature | Status | Notes |
|---------|--------|-------|
| Zod Validation | ⚠️ Basic | Belum comprehensive per schema |
| Error Handling | ⚠️ Basic | Belum ada standard error codes |
| Rate Limiting | ❌ | Upstash Redis rate limiter |
| Audit Logging | ❌ | Track semua user actions |
| Soft Delete Filter | ⚠️ | Middleware auto-filter deletedAt |
| Pagination | ⚠️ Basic | Belum ada server-side cursor |

### 3. UI/UX Requirements (05-uiux-requirement.md)

| Feature | Status | Notes |
|---------|--------|-------|
| Dark Mode | ❌ | Theme switcher light/dark |
| Color System | ⚠️ | Belum consistent dengan design system |
| Typography Scale | ⚠️ | Belum pakai Plus Jakarta Sans |
| Micro-interactions | ❌ | Button hover, card hover effects |
| Loading Skeleton | ❌ | Shimmer animation |
| Form Error States | ⚠️ Basic | Belum proper styling |
| Responsive Design | ⚠️ | Mobile belum optimal |
| Accessibility | ❌ | ARIA labels, keyboard nav |

### 4. Role Requirements (06-role-requirement.md)

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Verification UI | ❌ | UI untuk approve/reject owner registration |
| Trust Score System | ❌ | Scoring berdasarkan verifikasi & aktivitas |
| KTP Verification | ❌ | Upload & review KTP |
| Selfie Verification | ❌ | Upload & review Selfie+KTP |
| Agent License Verification | ❌ | Verifikasi lisensi AREBI |
| Role Upgrade Flow | ❌ | USER → OWNER upgrade dengan verifikasi |
| 2FA for Admin | ❌ | Wajib untuk SUPER_ADMIN & ADMIN |

### 5. App Requirements (01-app-requirement.md)

#### Integrasi External
| Service | Status | Notes |
|---------|--------|-------|
| Google Drive API | ❌ | File storage untuk KTP, foto properti |
| Google Maps API | ❌ | Location picker & map display |
| Socket.io | ❌ | Real-time chat |
| Midtrans/Xendit | ❌ | Payment gateway |
| SendGrid | ❌ | Email notifications |
| WhatsApp API | ❌ | WhatsApp notifications (opsional) |

#### Chat System
| Feature | Status | Notes |
|---------|--------|-------|
| Chat Room List | ❌ | Daftar percakapan |
| Real-time Messaging | ❌ | WebSocket connection |
| Image Sharing | ❌ | Upload gambar di chat |
| Read Receipts | ❌ | Tanda sudah dibaca |
| Typing Indicator | ❌ | "sedang mengetik..." |
| Block User | ❌ | Block & report user |

#### SaaS Features
| Feature | Status | Notes |
|---------|--------|-------|
| Subscription Plans UI | ❌ | Halaman pilih paket |
| Payment Integration | ❌ | Bayar langganan |
| Usage Limits | ❌ | Limit listing per plan |
| Invoice Generation | ❌ | Generate invoice PDF |

---

## 📋 Development Priority (TODO)

### 🔴 High Priority
1. **Right Panel CRUD** - Implementasi form di sidebar kanan untuk UX lebih baik
2. **Image Upload** - Google Drive integration untuk foto properti/KTP
3. **Tenant Pages** - `/dashboard/my-rental`, `/dashboard/my-payments`
4. **DataTable Enhancement** - Sorting, filtering, pagination server-side
5. **Toast Notifications** - Feedback sukses/error yang proper

### 🟡 Medium Priority
1. **Admin Verification UI** - Approve/reject owner registration
2. **Chat System** - Real-time chat dengan Socket.io
3. **Map Integration** - Google Maps untuk location picker
4. **Charts** - Recharts untuk analytics dashboard
5. **Skeleton Loading** - Loading states yang proper

### 🟢 Low Priority
1. **Dark Mode** - Theme switcher
2. **2FA** - Two-factor authentication untuk admin
3. **Payment Gateway** - Subscription payment
4. **Email Service** - Notifications & OTP
5. **WhatsApp Notification** - Opsional

---

## Entity Development Status

Berdasarkan flow requirement (07-flow-requirement.md):

| Entity | ERD | Validation | Service | API | Frontend | CRUD Panel |
|--------|:---:|:----------:|:-------:|:---:|:--------:|:----------:|
| Users | ✅ | ⚠️ | ⚠️ | ✅ | ⚠️ | ❌ |
| Properties | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Rooms | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Residents | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Payments | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Listings | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Bookings | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Chats | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Messages | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Subscriptions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Notifications | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Favorites | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AuditLogs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend**: ✅ Done | ⚠️ Partial | ❌ Not Started

## API Endpoints

### Authentication
| Method | Endpoint | Status |
|--------|----------|--------|
| POST | `/api/auth/register` | ✅ |
| POST | `/api/auth/[...nextauth]` | ✅ |
| POST | `/api/auth/forgot-password` | ❌ |
| POST | `/api/auth/reset-password` | ❌ |
| POST | `/api/auth/verify-email` | ❌ |

### Properties
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/properties` | ✅ |
| POST | `/api/properties` | ✅ |
| GET | `/api/properties/:id` | ✅ |
| PUT | `/api/properties/:id` | ✅ |
| DELETE | `/api/properties/:id` | ✅ |

### Rooms
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/rooms` | ✅ |
| POST | `/api/rooms` | ✅ |
| GET | `/api/rooms/:id` | ✅ |
| PUT | `/api/rooms/:id` | ✅ |
| DELETE | `/api/rooms/:id` | ✅ |

### Residents
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/residents` | ✅ |
| POST | `/api/residents` | ✅ |
| GET | `/api/residents/:id` | ✅ |
| PUT | `/api/residents/:id` | ✅ |
| DELETE | `/api/residents/:id` | ✅ |

### Payments
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/payments` | ✅ |
| POST | `/api/payments` | ✅ |
| GET | `/api/payments/:id` | ✅ |
| PUT | `/api/payments/:id` | ✅ |
| DELETE | `/api/payments/:id` | ✅ |

### Listings
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/listings` | ✅ |
| POST | `/api/listings` | ✅ |
| GET | `/api/listings/:id` | ✅ |
| PUT | `/api/listings/:id` | ✅ |
| DELETE | `/api/listings/:id` | ✅ |
| POST | `/api/listings/:id/favorite` | ❌ |

### Bookings
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/bookings` | ✅ |
| POST | `/api/bookings` | ✅ |
| GET | `/api/bookings/:id` | ✅ |
| PUT | `/api/bookings/:id` | ✅ |
| DELETE | `/api/bookings/:id` | ✅ |

### Not Yet Implemented
- `/api/chats` - Chat rooms
- `/api/messages` - Chat messages
- `/api/uploads` - File uploads (Google Drive)
- `/api/subscriptions` - SaaS plans
- `/api/notifications` - User notifications
- `/api/reports` - Fraud reports

## User Roles

| Role | Description |
|------|-------------|
| SUPER_ADMIN | Full platform access |
| ADMIN | Moderate access (verify users/listings) |
| OWNER | Manage own properties & residents |
| AGENT | Manage client properties |
| TENANT | Rent properties, make payments |
| USER | Browse listings only |

## SaaS Plans

| Plan | Price/month | Listings | Residents | Storage |
|------|-------------|----------|-----------|---------|
| Free | Rp 0 | 3 | 10 | 500MB |
| Basic | Rp 99K | 20 | 50 | 5GB |
| Pro | Rp 299K | ∞ | ∞ | 50GB |
| Enterprise | Custom | ∞ | ∞ | ∞ |

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Development Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npx tsc --noEmit  # TypeScript check
npx prisma studio # Database GUI
```

## License

Private - All rights reserved
