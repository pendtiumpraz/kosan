# 🔄 Flow Requirement Document
## Alur Pengembangan Sistem KosanHub

---

## 1. Development Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌─────────────┐
│   ERD   │ → │  LOGIC  │ → │   API   │ → │ FRONTEND │ → │ CRUD IN 1   │
│ Schema  │    │ Service │    │ Routes  │    │   Pages  │    │    PAGE     │
└─────────┘    └─────────┘    └─────────┘    └──────────┘    └─────────────┘
     ↓              ↓              ↓              ↓               ↓
  Prisma       Business       REST API       React          Sidebar CRUD
  Models       Logic          Endpoints      Components     Panel Right
```

---

## 2. Step-by-Step Development Flow

### STEP 1: ERD / Database Schema (Prisma)

**Lokasi**: `prisma/schema.prisma`

**Checklist per Entity**:
- [ ] Define model dengan semua fields
- [ ] Tambah `deletedAt` dan `deletedBy` untuk soft delete
- [ ] Define relations (foreign keys)
- [ ] Tambah indexes untuk query optimization
- [ ] Run `npx prisma migrate dev`

**Contoh Flow untuk Entity "Property"**:
```prisma
model Property {
  id          String   @id @default(cuid())
  ownerId     String
  name        String
  type        PropertyType
  // ... fields lainnya
  
  // Soft Delete
  deletedAt   DateTime?
  deletedBy   String?
  
  // Relations
  owner       User     @relation(fields: [ownerId], references: [id])
  rooms       Room[]
  
  // Indexes  
  @@index([ownerId])
  @@index([deletedAt])
}
```

---

### STEP 2: Business Logic / Service Layer

**Lokasi**: `src/services/[entity].service.ts`

**Checklist per Service**:
- [ ] Create function - dengan validasi
- [ ] Read function - dengan filter soft delete
- [ ] Update function - dengan audit log
- [ ] Delete function - soft delete only
- [ ] List function - dengan pagination
- [ ] Business rules validation

**Template Service**:
```typescript
// src/services/property.service.ts

export const propertyService = {
  // CREATE
  async create(data: CreatePropertyInput, userId: string) {
    // 1. Validate business rules
    // 2. Create record
    // 3. Create audit log
    // 4. Return result
  },
  
  // READ
  async getById(id: string, userId: string) {
    // 1. Find record (auto-filter deleted)
    // 2. Check access permission
    // 3. Return result
  },
  
  // UPDATE
  async update(id: string, data: UpdatePropertyInput, userId: string) {
    // 1. Check exists
    // 2. Check permission
    // 3. Update record
    // 4. Create audit log
    // 5. Return result
  },
  
  // DELETE (Soft)
  async delete(id: string, userId: string) {
    // 1. Check exists
    // 2. Check permission
    // 3. Soft delete (set deletedAt)
    // 4. Create audit log
    // 5. Return success
  },
  
  // LIST
  async list(params: ListParams, userId: string) {
    // 1. Build where clause
    // 2. Add soft delete filter
    // 3. Execute query with pagination
    // 4. Return results + meta
  },
};
```

---

### STEP 3: API Routes

**Lokasi**: `src/app/api/[entity]/route.ts`

**Struktur API Routes**:
```
src/app/api/
├── auth/
│   ├── [...nextauth]/route.ts    # NextAuth handler
│   └── register/route.ts         # Registration
├── users/
│   ├── route.ts                  # GET (list), POST (create)
│   └── [id]/route.ts             # GET, PUT, PATCH, DELETE
├── properties/
│   ├── route.ts                  # GET, POST
│   └── [id]/route.ts             # GET, PUT, DELETE
├── rooms/
│   ├── route.ts                  # GET, POST
│   └── [id]/route.ts             # GET, PUT, DELETE
├── residents/
│   ├── route.ts                  # GET, POST
│   └── [id]/route.ts             # GET, PUT, DELETE
├── payments/
│   ├── route.ts                  # GET, POST
│   └── [id]/route.ts             # GET, PUT, DELETE
├── listings/
│   ├── route.ts                  # GET, POST
│   └── [id]/route.ts             # GET, PUT, DELETE
├── chats/
│   ├── route.ts                  # GET, POST
│   └── [id]/
│       ├── route.ts              # GET
│       └── messages/route.ts     # GET, POST
└── reports/
    ├── route.ts                  # GET, POST
    └── [id]/route.ts             # GET, PATCH
```

**Template Route (CRUD in 1 file)**:
```typescript
// src/app/api/properties/route.ts

// GET /api/properties - List all (with filters)
export const GET = withErrorHandler(async (request) => {
  const session = await requireAuth();
  const params = getPaginationParams(request);
  const data = await propertyService.list(params, session.user.id);
  return successResponse(data.items, data.meta);
});

// POST /api/properties - Create new
export const POST = withErrorHandler(async (request) => {
  const session = await requireRole(["OWNER", "AGENT", "ADMIN"]);
  const body = await parseBody(request, createPropertySchema);
  const property = await propertyService.create(body, session.user.id);
  return successResponse(property, undefined, 201);
});
```

```typescript
// src/app/api/properties/[id]/route.ts

// GET /api/properties/:id - Get one
export const GET = withErrorHandler(async (request, { params }) => {
  const { id } = await params;
  const session = await requireAuth();
  const property = await propertyService.getById(id, session.user.id);
  return successResponse(property);
});

// PUT /api/properties/:id - Update
export const PUT = withErrorHandler(async (request, { params }) => {
  const { id } = await params;
  const session = await requireAuth();
  const body = await parseBody(request, updatePropertySchema);
  const property = await propertyService.update(id, body, session.user.id);
  return successResponse(property);
});

// DELETE /api/properties/:id - Soft Delete
export const DELETE = withErrorHandler(async (request, { params }) => {
  const { id } = await params;
  const session = await requireAuth();
  await propertyService.delete(id, session.user.id);
  return successResponse({ message: "Deleted successfully" });
});
```

---

### STEP 4: Frontend Pages

**Lokasi**: `src/app/(dashboard)/[entity]/page.tsx`

**Struktur Pages**:
```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (public)/
│   ├── page.tsx                  # Landing
│   ├── listings/page.tsx         # Marketplace
│   └── listings/[id]/page.tsx
└── (dashboard)/
    ├── layout.tsx                # Dashboard layout + Sidebar
    ├── dashboard/page.tsx        # Overview
    ├── properties/page.tsx       # CRUD Properties
    ├── rooms/page.tsx            # CRUD Rooms
    ├── residents/page.tsx        # CRUD Residents
    ├── payments/page.tsx         # CRUD Payments
    ├── listings/page.tsx         # CRUD Listings
    ├── chats/page.tsx            # Chat interface
    └── settings/page.tsx         # Settings
```

---

### STEP 5: CRUD in One Page (Sidebar Right Panel)

**Layout Pattern**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR LEFT │ MAIN CONTENT                    │ SIDEBAR RIGHT (CRUD PANEL) │
│              │                                  │                            │
│ Navigation   │ ┌─────────────────────────────┐ │ ┌─────────────────────────┐│
│              │ │ Header: Title + Add Button  │ │ │ FORM CREATE/EDIT       ││
│ • Dashboard  │ ├─────────────────────────────┤ │ │                        ││
│ • Properti   │ │                             │ │ │ [Field 1]              ││
│ • Kamar      │ │      DATA TABLE             │ │ │ [Field 2]              ││
│ • Penghuni   │ │                             │ │ │ [Field 3]              ││
│ • Pembayaran │ │  ID | Name | Status | Act   │ │ │ ...                    ││
│ • Listing    │ │  1  | ABC  | Active | ⚡    │ │ │                        ││
│ • Chat       │ │  2  | DEF  | Draft  | ⚡    │ │ │ [Save] [Cancel]        ││
│              │ │                             │ │ │                        ││
│              │ │ Pagination                  │ │ │ ─────────────────────  ││
│              │ └─────────────────────────────┘ │ │ DELETE SECTION         ││
│              │                                  │ │ [Delete] (soft delete) ││
│              │                                  │ └─────────────────────────┘│
└──────────────┴──────────────────────────────────┴────────────────────────────┘
```

**Component Structure**:
```
src/components/
├── layout/
│   ├── DashboardLayout.tsx       # Main layout
│   ├── Sidebar.tsx               # Left sidebar navigation
│   └── RightPanel.tsx            # Right sidebar for CRUD
├── crud/
│   ├── DataTable.tsx             # Reusable data table
│   ├── CrudPanel.tsx             # Right panel wrapper
│   ├── CreateForm.tsx            # Create form wrapper
│   ├── EditForm.tsx              # Edit form wrapper
│   └── DeleteConfirm.tsx         # Delete confirmation
└── forms/
    ├── PropertyForm.tsx
    ├── RoomForm.tsx
    ├── ResidentForm.tsx
    ├── PaymentForm.tsx
    └── ListingForm.tsx
```

**CRUD Page Template**:
```tsx
// src/app/(dashboard)/properties/page.tsx

"use client";

import { useState } from "react";
import { DataTable } from "@/components/crud/DataTable";
import { CrudPanel } from "@/components/crud/CrudPanel";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { useProperties } from "@/hooks/useProperties";

export default function PropertiesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<"closed" | "create" | "edit">("closed");
  
  const { data, isLoading, refetch } = useProperties();
  
  const handleCreate = () => {
    setSelectedId(null);
    setPanelMode("create");
  };
  
  const handleEdit = (id: string) => {
    setSelectedId(id);
    setPanelMode("edit");
  };
  
  const handleClose = () => {
    setSelectedId(null);
    setPanelMode("closed");
  };
  
  const handleSuccess = () => {
    refetch();
    handleClose();
  };
  
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Properti</h1>
          <button onClick={handleCreate}>+ Tambah Properti</button>
        </div>
        
        <DataTable
          data={data?.items || []}
          columns={columns}
          onEdit={handleEdit}
          isLoading={isLoading}
        />
      </div>
      
      {/* Right Panel for CRUD */}
      <CrudPanel
        isOpen={panelMode !== "closed"}
        onClose={handleClose}
        title={panelMode === "create" ? "Tambah Properti" : "Edit Properti"}
      >
        <PropertyForm
          id={selectedId}
          onSuccess={handleSuccess}
          onCancel={handleClose}
        />
      </CrudPanel>
    </div>
  );
}
```

---

## 3. Entity Development Checklist

### Per Entity harus melalui flow ini:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ENTITY: [NAMA ENTITY]                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ [ ] 1. ERD/Schema                                                           │
│     └── prisma/schema.prisma                                                │
│         ├── [ ] Model definition                                            │
│         ├── [ ] Soft delete fields (deletedAt, deletedBy)                  │
│         ├── [ ] Relations                                                   │
│         ├── [ ] Indexes                                                     │
│         └── [ ] Run migration                                               │
│                                                                              │
│ [ ] 2. Validation Schema                                                    │
│     └── src/lib/validations.ts                                              │
│         ├── [ ] Create schema                                               │
│         ├── [ ] Update schema                                               │
│         └── [ ] Export types                                                │
│                                                                              │
│ [ ] 3. Service Layer                                                        │
│     └── src/services/[entity].service.ts                                    │
│         ├── [ ] create()                                                    │
│         ├── [ ] getById()                                                   │
│         ├── [ ] update()                                                    │
│         ├── [ ] delete() - soft delete                                      │
│         ├── [ ] list() - with pagination                                    │
│         └── [ ] Business rules                                              │
│                                                                              │
│ [ ] 4. API Routes                                                           │
│     ├── src/app/api/[entity]/route.ts                                       │
│     │   ├── [ ] GET - list                                                  │
│     │   └── [ ] POST - create                                               │
│     └── src/app/api/[entity]/[id]/route.ts                                  │
│         ├── [ ] GET - get one                                               │
│         ├── [ ] PUT - update                                                │
│         └── [ ] DELETE - soft delete                                        │
│                                                                              │
│ [ ] 5. Frontend                                                             │
│     ├── src/hooks/use[Entity].ts                                            │
│     │   └── [ ] React Query hooks                                           │
│     ├── src/components/forms/[Entity]Form.tsx                               │
│     │   └── [ ] Form component                                              │
│     └── src/app/(dashboard)/[entity]/page.tsx                               │
│         ├── [ ] Page with DataTable                                         │
│         ├── [ ] Right panel for CRUD                                        │
│         ├── [ ] Create flow                                                 │
│         ├── [ ] Edit flow                                                   │
│         └── [ ] Delete flow (soft)                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Entity List & Status

| No | Entity | ERD | Validation | Service | API | Frontend | Status |
|----|--------|:---:|:----------:|:-------:|:---:|:--------:|:------:|
| 1 | Users | ✅ | ✅ | 🔄 | ✅ | ⬜ | In Progress |
| 2 | Properties | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 3 | Rooms | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 4 | Residents | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 5 | Payments | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 6 | Chats | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 7 | Messages | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 8 | Listings | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 9 | Bookings | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 10 | Reports | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Pending |
| 11 | Subscriptions | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| 12 | Notifications | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | Pending |

**Legend**:
- ✅ Completed
- 🔄 In Progress
- ⬜ Not Started

---

## 5. Soft Delete Rules

### Semua DELETE operations WAJIB menggunakan Soft Delete:

```typescript
// ❌ JANGAN gunakan hard delete
await prisma.property.delete({ where: { id } });

// ✅ GUNAKAN soft delete
await prisma.property.update({
  where: { id },
  data: {
    deletedAt: new Date(),
    deletedBy: userId,
  },
});
```

### Auto-filter di Query:
```typescript
// Prisma middleware otomatis filter deletedAt = null
// Lihat: src/lib/prisma.ts
```

### Restore Data (jika diperlukan):
```typescript
await prisma.property.update({
  where: { id },
  data: {
    deletedAt: null,
    deletedBy: null,
  },
});
```

---

## 6. API Response Standard

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validasi gagal",
    "details": {
      "name": ["Nama minimal 3 karakter"]
    }
  }
}
```

---

## 7. Next Steps

1. ⬜ Complete Service Layer untuk semua entities
2. ⬜ Complete API Routes untuk semua entities
3. ⬜ Setup Frontend Layout dengan Dashboard
4. ⬜ Create reusable CRUD components
5. ⬜ Implement Right Panel CRUD pattern
6. ⬜ Connect Frontend dengan API

---

*Dokumen ini adalah panduan development flow untuk KosanHub v1.0*
