# 👥 Role Requirements Document
## Sistem Informasi KosanHub - User Roles & Permissions

---

## 1. Daftar Roles

| No | Role | Kode | Deskripsi |
|----|------|------|-----------|
| 1 | **Super Admin** | `SUPER_ADMIN` | Administrator utama platform, full access |
| 2 | **Admin** | `ADMIN` | Staff platform, akses moderasi |
| 3 | **Owner** | `OWNER` | Pemilik properti (kos/kontrakan/vila/rumah/tanah) |
| 4 | **Agent** | `AGENT` | Agen properti terverifikasi |
| 5 | **Tenant** | `TENANT` | Penyewa/penghuni properti |
| 6 | **User** | `USER` | User biasa (belum menentukan role) |

---

## 2. Detail Setiap Role

### 2.1 SUPER_ADMIN

**Deskripsi**: Administrator tertinggi platform dengan akses penuh ke seluruh sistem.

**Kemampuan**:
- ✅ Manage semua users (CRUD)
- ✅ Approve/reject registrasi Owner & Agent
- ✅ Verify/suspend properties & listings
- ✅ Handle reports (fraud, spam, dll)
- ✅ Manage subscription plans
- ✅ View semua data platform
- ✅ Access audit logs
- ✅ Manage facility master data
- ✅ Platform settings & configuration
- ✅ View analytics & reports

**Batasan**: Tidak ada batasan

---

### 2.2 ADMIN

**Deskripsi**: Staff platform dengan akses moderasi terbatas.

**Kemampuan**:
- ✅ Review & verify Owner/Agent registrations
- ✅ Review & verify property listings
- ✅ Handle reports
- ✅ View user data (terbatas)
- ✅ Suspend/unsuspend users
- ✅ View analytics (terbatas)

**Batasan**:
- ❌ Tidak bisa delete permanent
- ❌ Tidak bisa manage subscription plans
- ❌ Tidak bisa access platform settings
- ❌ Tidak bisa manage other admins

---

### 2.3 OWNER

**Deskripsi**: Pemilik properti yang sudah terverifikasi.

**Persyaratan Registrasi**:
| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama Lengkap | ✅ | Min 3 karakter |
| Email | ✅ | Unik, perlu verifikasi |
| No. HP | ✅ | Format +62, perlu verifikasi OTP |
| Password | ✅ | Min 8 karakter, 1 huruf besar, 1 angka |
| Foto KTP | ✅ | JPG/PNG, max 5MB |
| Selfie + KTP | ✅ | Foto diri memegang KTP |
| Nama Usaha | ✅ | Nama kos/properti |
| Alamat Usaha | ✅ | Alamat lengkap |
| Jenis Properti | ✅ | KOS/KONTRAKAN/VILLA/HOUSE/LAND |
| NPWP | ⬜ | Opsional |

**Flow Registrasi**:
```
Daftar → Isi Form → Upload KTP & Selfie → Verifikasi Email/HP 
    → Pending Review Admin (1-3 hari) → Approved/Rejected
```

**Kemampuan**:
- ✅ Manage properti sendiri (CRUD)
- ✅ Manage kamar dalam properti
- ✅ Manage penghuni (data private)
- ✅ Manage pembayaran penghuni
- ✅ Chat dengan calon penyewa
- ✅ Buat listing di marketplace
- ✅ Lihat riwayat & laporan keuangan
- ✅ Upgrade subscription

**Batasan**:
- ❌ Tidak bisa akses data properti orang lain
- ❌ Tidak bisa akses data penghuni properti lain
- ❌ Listing perlu verifikasi admin dulu
- ⚠️ Tergantung subscription plan (jumlah listing, dll)

---

### 2.4 AGENT

**Deskripsi**: Agen properti profesional yang terverifikasi untuk mengelola properti klien.

**Persyaratan Registrasi**:
| Field | Wajib | Keterangan |
|-------|-------|------------|
| Semua field OWNER | ✅ | Sama seperti owner |
| Nomor Lisensi Agen | ✅ | AREBI/asosiasi agen resmi |
| Surat Izin Usaha | ✅ | Upload dokumen |

**Flow Registrasi**:
```
Daftar sebagai Agent → Isi Form + Lisensi → Review Admin (lebih ketat)
    → Verifikasi Lisensi → Approved/Rejected
```

**Kemampuan**:
- ✅ Semua kemampuan OWNER
- ✅ Manage properti klien (yang di-assign)
- ✅ Handle booking & inquiry untuk klien
- ✅ View commission reports

**Batasan**:
- ❌ Hanya bisa akses properti yang di-assign
- ❌ Tidak bisa akses data finansial klien langsung
- ⚠️ Perlu persetujuan owner untuk aksi tertentu

**Perbedaan dengan OWNER**:
- Agent mengelola properti **orang lain**
- Agent harus punya **lisensi resmi**
- Agent bisa di-assign ke **multiple properties**

---

### 2.5 TENANT

**Deskripsi**: Penyewa/penghuni yang sudah terdaftar di suatu properti.

**Persyaratan Registrasi**:
| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama Lengkap | ✅ | Min 3 karakter |
| Email | ✅ | Unik, perlu verifikasi |
| No. HP | ✅ | Format +62, perlu verifikasi OTP |
| Password | ✅ | Min 8 karakter |
| Foto KTP | ⬜ | Opsional saat daftar |
| Selfie | ⬜ | Opsional saat daftar |

**Flow menjadi Tenant**:
```
Daftar sebagai USER → Browse Listings → Chat dengan Owner 
    → Deal → Owner input sebagai Penghuni → Status jadi TENANT
```

**Kemampuan**:
- ✅ Browse semua listings
- ✅ Chat dengan owner/agent
- ✅ Booking/inquiry properti
- ✅ Simpan favorit
- ✅ Lihat riwayat sewa sendiri
- ✅ Lihat tagihan & riwayat pembayaran sendiri
- ✅ Upload bukti pembayaran
- ✅ Lihat kontrak sendiri

**Batasan**:
- ❌ Tidak bisa lihat data penghuni lain
- ❌ Tidak bisa buat listing
- ❌ Tidak bisa manage properti

---

### 2.6 USER

**Deskripsi**: User umum yang baru mendaftar, belum menentukan sebagai apa.

**Persyaratan Registrasi**:
| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama Lengkap | ✅ | Min 3 karakter |
| Email | ✅ | Unik |
| Password | ✅ | Min 8 karakter |

**Kemampuan**:
- ✅ Browse listings (public)
- ✅ View detail properti
- ✅ Simpan favorit
- ✅ Upgrade ke OWNER/AGENT (dengan verifikasi)

**Batasan**:
- ❌ Tidak bisa chat dengan owner (harus upgrade)
- ❌ Tidak bisa booking
- ❌ Tidak bisa buat listing

---

## 3. Permission Matrix

| Feature | SUPER_ADMIN | ADMIN | OWNER | AGENT | TENANT | USER |
|---------|:-----------:|:-----:|:-----:|:-----:|:------:|:----:|
| **USERS** |
| View all users | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ |
| Create user | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit any user | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete user | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Suspend user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **PROPERTIES** |
| View all | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own | ✅ | ✅ | ✅ | ✅** | ❌ | ❌ |
| Create | ✅ | ❌ | ✅ | ✅** | ❌ | ❌ |
| Edit own | ✅ | ❌ | ✅ | ✅** | ❌ | ❌ |
| Delete own | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Verify | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **RESIDENTS** |
| View (own property) | ✅ | ❌ | ✅ | ✅** | ❌ | ❌ |
| Create | ✅ | ❌ | ✅ | ✅** | ❌ | ❌ |
| Edit | ✅ | ❌ | ✅ | ✅** | ❌ | ❌ |
| Delete | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View own data | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **PAYMENTS** |
| View all | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own property | ✅ | ❌ | ✅ | ✅** | ❌ | ❌ |
| View own | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create | ✅ | ❌ | ✅ | ✅** | ✅*** | ❌ |
| Verify | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **LISTINGS** |
| View public | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Edit own | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Delete own | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Verify | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **CHAT** |
| Send message | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View all chats | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own chats | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **REPORTS** |
| Submit report | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all reports | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Handle report | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **SUBSCRIPTIONS** |
| Manage plans | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Subscribe | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| View own | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |

> *Limited view for moderation
> **Only for assigned properties
> ***Only payment proof upload

---

## 4. Anti-Fraud Measures per Role

### 4.1 Verification Requirements

| Role | KTP | Selfie+KTP | Email | Phone | License | Admin Review |
|------|:---:|:----------:|:-----:|:-----:|:-------:|:------------:|
| USER | ❌ | ❌ | ✅ | ⬜ | ❌ | ❌ |
| TENANT | ⬜ | ⬜ | ✅ | ✅ | ❌ | ❌ |
| OWNER | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| AGENT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (ketat) |

### 4.2 Trust Score System

Setiap user punya **Trust Score** (0-100):

**Cara mendapatkan poin**:
| Aksi | Poin |
|------|------|
| Email verified | +5 |
| Phone verified | +10 |
| KTP uploaded | +15 |
| Selfie verified | +15 |
| Admin verified | +20 |
| Transaksi sukses | +5/transaksi |
| Review positif | +2/review |
| Akun > 6 bulan | +10 |

**Cara kehilangan poin**:
| Aksi | Poin |
|------|------|
| Report valid terhadap user | -20 |
| Transaksi gagal/cancel | -5 |
| Review negatif | -3 |
| Warning dari admin | -15 |

**Trust Level**:
- 0-25: 🔴 Low Trust (batasan fitur)
- 26-50: 🟡 Medium Trust
- 51-75: 🟢 Good Trust
- 76-100: ⭐ Excellent Trust (badge verified)

### 4.3 Listing Verification

Setiap listing baru harus melalui:
1. **Auto-check**: Duplicate detection, banned words
2. **Admin Review**: Foto asli, lokasi valid, harga wajar
3. **Periodic Re-verification**: Setiap 6 bulan

---

## 5. Role Upgrade Flow

### USER → OWNER
```
Profile → "Upgrade ke Pemilik" → Isi data bisnis + KTP + Selfie
    → Submit → Admin Review (1-3 hari) → Approved → Role = OWNER
```

### USER → AGENT
```
Profile → "Daftar sebagai Agent" → Isi data + Lisensi
    → Submit → Admin Verify Lisensi → Approved → Role = AGENT
```

### USER → TENANT
```
(Otomatis) Ketika OWNER menambahkan user sebagai penghuni propertinya
```

---

## 6. Session & Security

| Role | Session Duration | 2FA Required | IP Restriction |
|------|-----------------|--------------|----------------|
| SUPER_ADMIN | 1 hour | ✅ Wajib | ⬜ Optional |
| ADMIN | 4 hours | ✅ Wajib | ❌ |
| OWNER | 7 days | ⬜ Optional | ❌ |
| AGENT | 7 days | ⬜ Optional | ❌ |
| TENANT | 30 days | ❌ | ❌ |
| USER | 30 days | ❌ | ❌ |

---

*Dokumen ini adalah bagian dari Requirements KosanHub v1.0*
