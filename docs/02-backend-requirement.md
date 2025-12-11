# 🔧 Backend Requirement Document
## Sistem Informasi KosanHub - Backend Specification

---

## 1. Architecture Overview

### 1.1 Tech Stack
```
┌─────────────────────────────────────────┐
│           Next.js 15 API Routes         │
│              (App Router)               │
├─────────────────────────────────────────┤
│            Prisma ORM Layer             │
├─────────────────────────────────────────┤
│              PostgreSQL                 │
└─────────────────────────────────────────┘
```

### 1.2 Project Structure (Modular)
```
/src
├── /app
│   └── /api
│       ├── /auth/[...nextauth]/route.ts
│       ├── /users/route.ts
│       ├── /properties/route.ts
│       ├── /rooms/route.ts
│       ├── /residents/route.ts
│       ├── /payments/route.ts
│       ├── /chats/route.ts
│       ├── /messages/route.ts
│       ├── /listings/route.ts
│       ├── /bookings/route.ts
│       ├── /transactions/route.ts
│       ├── /subscriptions/route.ts
│       └── /uploads/route.ts
├── /lib
│   ├── prisma.ts
│   ├── auth.ts
│   ├── google-drive.ts
│   └── utils.ts
├── /services
│   ├── user.service.ts
│   ├── property.service.ts
│   ├── chat.service.ts
│   └── payment.service.ts
└── /types
    └── index.ts
```

---

## 2. CRUD Pattern (Single File)

> **PENTING**: Semua operasi CRUD untuk setiap entity dalam 1 file route.

### 2.1 Standard Route Pattern
```typescript
// /app/api/[entity]/route.ts
export async function GET(request: Request) { /* List/Read */ }
export async function POST(request: Request) { /* Create */ }

// /app/api/[entity]/[id]/route.ts
export async function GET(request: Request, { params }) { /* Read One */ }
export async function PUT(request: Request, { params }) { /* Update */ }
export async function PATCH(request: Request, { params }) { /* Partial Update */ }
export async function DELETE(request: Request, { params }) { /* Soft Delete */ }
```

### 2.2 Soft Delete Implementation
```typescript
// Semua DELETE adalah soft delete
export async function DELETE(request: Request, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  
  const result = await prisma.entity.update({
    where: { id },
    data: {
      deleted_at: new Date(),
      deleted_by: session?.user?.id
    }
  });
  
  return NextResponse.json({ success: true });
}
```

---

## 3. API Endpoints

### 3.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/forgot-password` | Request reset password |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/verify-email` | Verify email OTP |
| POST | `/api/auth/verify-phone` | Verify phone OTP |

### 3.2 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (admin) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Soft delete user |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me/password` | Change password |

### 3.3 Properties (Kos/Kontrakan/Vila)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List properties |
| POST | `/api/properties` | Create property |
| GET | `/api/properties/:id` | Get property detail |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Soft delete property |
| GET | `/api/properties/:id/rooms` | List rooms |
| GET | `/api/properties/:id/residents` | List residents (owner only) |

### 3.4 Rooms (Kamar Kos)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List rooms |
| POST | `/api/rooms` | Create room |
| GET | `/api/rooms/:id` | Get room detail |
| PUT | `/api/rooms/:id` | Update room |
| DELETE | `/api/rooms/:id` | Soft delete room |
| PUT | `/api/rooms/:id/availability` | Update availability |

### 3.5 Residents (Penghuni - PRIVATE)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/residents` | List residents (owner only) |
| POST | `/api/residents` | Add resident |
| GET | `/api/residents/:id` | Get resident detail |
| PUT | `/api/residents/:id` | Update resident |
| DELETE | `/api/residents/:id` | Soft delete resident |
| GET | `/api/residents/:id/payments` | Payment history |
| POST | `/api/residents/:id/documents` | Upload document |

### 3.6 Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | List payments |
| POST | `/api/payments` | Create payment |
| GET | `/api/payments/:id` | Get payment detail |
| PUT | `/api/payments/:id` | Update payment |
| DELETE | `/api/payments/:id` | Soft delete payment |
| POST | `/api/payments/:id/confirm` | Confirm payment |

### 3.7 Chats & Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chats` | List chat rooms |
| POST | `/api/chats` | Create/Get chat room |
| GET | `/api/chats/:id` | Get chat detail |
| GET | `/api/chats/:id/messages` | Get messages |
| POST | `/api/chats/:id/messages` | Send message |
| DELETE | `/api/messages/:id` | Soft delete message |
| POST | `/api/chats/:id/block` | Block user |

### 3.8 Marketplace Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | List all listings (public) |
| POST | `/api/listings` | Create listing |
| GET | `/api/listings/:id` | Get listing detail |
| PUT | `/api/listings/:id` | Update listing |
| DELETE | `/api/listings/:id` | Soft delete listing |
| POST | `/api/listings/:id/favorite` | Add to favorite |
| GET | `/api/listings/search` | Advanced search |

### 3.9 Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/:id` | Get booking detail |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Cancel booking |
| POST | `/api/bookings/:id/confirm` | Confirm booking |

### 3.10 File Uploads (Google Drive)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/uploads` | Upload file to Google Drive |
| GET | `/api/uploads/:id` | Get file URL |
| DELETE | `/api/uploads/:id` | Soft delete file |

### 3.11 Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions/plans` | List plans |
| POST | `/api/subscriptions` | Subscribe to plan |
| GET | `/api/subscriptions/current` | Get current subscription |
| PUT | `/api/subscriptions/:id/cancel` | Cancel subscription |

---

## 4. Authentication & Authorization

### 4.1 NextAuth.js v5 Configuration
```typescript
// /lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({ /* ... */ }),
    Google({ /* ... */ }),
  ],
  callbacks: {
    jwt({ token, user }) { /* ... */ },
    session({ session, token }) { /* ... */ },
  },
})
```

### 4.2 Middleware Protection
```typescript
// /middleware.ts
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
  
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

---

## 5. Google Drive Integration

### 5.1 Service Implementation
```typescript
// /lib/google-drive.ts
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToDrive(file: Buffer, fileName: string, folderId: string) {
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: 'image/jpeg',
      body: Readable.from(file),
    },
  });
  
  // Set public permission
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: { role: 'reader', type: 'anyone' },
  });
  
  return `https://drive.google.com/uc?id=${response.data.id}`;
}
```

---

## 6. Real-time Chat (Socket.io)

### 6.1 WebSocket Events
```typescript
// Events
socket.on('join_room', (chatId) => { /* ... */ });
socket.on('leave_room', (chatId) => { /* ... */ });
socket.on('send_message', (data) => { /* ... */ });
socket.on('typing', (chatId) => { /* ... */ });
socket.on('stop_typing', (chatId) => { /* ... */ });
socket.on('read_message', (messageId) => { /* ... */ });
```

---

## 7. Database Queries (with Soft Delete)

### 7.1 Base Query Extension
```typescript
// Prisma middleware untuk auto-filter soft delete
prisma.$use(async (params, next) => {
  if (params.action === 'findMany' || params.action === 'findFirst') {
    params.args.where = {
      ...params.args.where,
      deleted_at: null,
    };
  }
  return next(params);
});
```

---

## 8. Validation (Zod)

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().regex(/^\+62[0-9]{9,12}$/),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)/),
  role: z.enum(['TENANT', 'OWNER', 'BUYER']),
});

export const PropertySchema = z.object({
  name: z.string().min(3),
  type: z.enum(['KOS', 'KONTRAKAN', 'VILLA', 'HOUSE', 'LAND']),
  address: z.string().min(10),
  latitude: z.number(),
  longitude: z.number(),
  // ... more fields
});
```

---

## 9. Error Handling

```typescript
// Standard error response
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Error codes
const ErrorCodes = {
  UNAUTHORIZED: 'AUTH_001',
  FORBIDDEN: 'AUTH_002',
  NOT_FOUND: 'RES_001',
  VALIDATION_ERROR: 'VAL_001',
  INTERNAL_ERROR: 'SRV_001',
} as const;
```

---

## 10. Rate Limiting

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 req/min
});
```
