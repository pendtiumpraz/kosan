# KosanHub

Platform SaaS berbasis web untuk manajemen kos-kosan, kontrakan, dan marketplace properti.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |

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

### Implemented

- [x] **Database Schema** - 18+ models with soft delete
- [x] **Authentication** - NextAuth.js with credentials & Google OAuth
- [x] **Public Pages** - Landing, Listings, Detail, About, Contact, FAQ, Pricing
- [x] **Auth Pages** - Login, Register (Owner/Tenant)
- [x] **Dashboard** - Overview, Properties, Rooms, Residents, Payments, Listings, Bookings
- [x] **API Routes** - CRUD for properties, rooms, residents, payments, listings, bookings
- [x] **Services** - Business logic for property, room, resident, payment, listing, booking
- [x] **Role-based Access** - SUPER_ADMIN, ADMIN, OWNER, AGENT, TENANT, USER

### Not Yet Implemented

- [ ] **Real-time Chat** - Socket.io integration
- [ ] **Google Drive** - File upload/storage
- [ ] **Google Maps** - Location picker & display
- [ ] **Payment Gateway** - Midtrans/Xendit integration
- [ ] **Email Service** - SendGrid for notifications
- [ ] **2FA** - Two-factor authentication
- [ ] **Rate Limiting** - API protection
- [ ] **Audit Logging** - Action tracking middleware

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
