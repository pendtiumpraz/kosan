# 📋 App Requirement Document
## Sistem Informasi Kos-Kosan, Kontrakan & Marketplace Properti (SaaS)

---

## 1. Overview Aplikasi

### 1.1 Deskripsi Umum
Platform **KosanHub** adalah SaaS berbasis web untuk:
- **Manajemen Kos-kosan & Kontrakan** - Pengelolaan properti sewa
- **Sewa Rumah & Vila** - Marketplace penyewaan properti
- **Jual Beli Rumah & Tanah** - Marketplace transaksi properti

### 1.2 Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| File Storage | Google Drive API |
| Real-time Chat | Socket.io |
| Styling | Tailwind CSS |

---

## 2. User Roles

| Role | Deskripsi |
|------|-----------|
| **Super Admin** | Administrator platform - Full access |
| **Owner** | Pemilik properti - Manage properti, penghuni, keuangan |
| **Tenant** | Penghuni/Penyewa - Booking, chat, pembayaran |
| **Buyer** | Pembeli properti - Browse, inquiry, negosiasi |

---

## 3. Flow Registrasi

### Pencari Kos (Tenant/Buyer)
| Field | Wajib | Validasi |
|-------|-------|----------|
| Nama Lengkap | ✓ | Min 3 karakter |
| Email | ✓ | Format valid, unik |
| No. HP | ✓ | Format +62, unik |
| Password | ✓ | Min 8 karakter, 1 huruf besar, 1 angka |
| KTP | Opsional | JPG/PNG, max 5MB |

### Pemilik Properti (Owner)
| Field | Wajib | Validasi |
|-------|-------|----------|
| Nama Lengkap | ✓ | Min 3 karakter |
| Email | ✓ | Format valid, unik |
| No. HP | ✓ | Format +62, unik |
| Password | ✓ | Min 8 karakter |
| KTP | ✓ | JPG/PNG, max 5MB |
| Foto Selfie+KTP | ✓ | JPG/PNG, max 5MB |
| Nama Usaha | ✓ | Min 3 karakter |
| Alamat Usaha | ✓ | Min 10 karakter |
| Jenis Properti | ✓ | Kos/Kontrakan/Vila/Rumah/Tanah |

---

## 4. Fitur Chat System

- Real-time messaging via WebSocket
- Private chat (Owner & Tenant)
- Enkripsi end-to-end
- Media sharing (gambar, dokumen)
- File storage ke Google Drive
- Read receipts & Typing indicator
- Message search & Chat history
- Block & Report user

---

## 5. Manajemen Penghuni (PRIVATE)

Data berikut hanya dapat diakses owner properti terkait:
- **Identitas**: Nama, KTP, TTL, Pekerjaan, Kontak
- **Kontak Darurat**: Nama, Hubungan, No. HP
- **Data Sewa**: Tanggal masuk/keluar, Kamar, Harga, Deposit
- **Riwayat Pembayaran**: Tanggal, Jumlah, Metode, Status
- **Dokumen**: Kontrak, KTP, KK

---

## 6. Jenis Listing Properti

1. **Kos-Kosan** - Harian/Bulanan/Tahunan, per kamar
2. **Kontrakan** - Bulanan/Tahunan, rumah utuh
3. **Vila** - Harian/Mingguan, event booking
4. **Rumah Dijual** - Jual langsung/Cicilan
5. **Tanah Dijual** - Jual langsung/Kavling

---

## 7. Soft Delete Policy

Semua DELETE menggunakan soft delete:
```typescript
{
  deleted_at: DateTime? // null = active
  deleted_by: String?   // user yang menghapus
}
```

---

## 8. SaaS Subscription Plans

| Fitur | Free | Basic | Pro | Enterprise |
|-------|------|-------|-----|------------|
| Harga/bulan | Rp 0 | Rp 99K | Rp 299K | Custom |
| Listing | 3 | 20 | ∞ | ∞ |
| Penghuni | 10 | 50 | ∞ | ∞ |
| Storage | 500MB | 5GB | 50GB | ∞ |

---

## 9. Security Requirements

- JWT + Refresh Token
- Role-based Access Control (RBAC)
- Password hashing (bcrypt)
- Data encryption (AES-256)
- TLS 1.3 untuk transit
- Audit logging

---

## 10. Integrations

| Service | Purpose |
|---------|---------|
| Google Drive API | File storage |
| Google Maps API | Location |
| Midtrans/Xendit | Payment gateway |
| SendGrid | Email service |
