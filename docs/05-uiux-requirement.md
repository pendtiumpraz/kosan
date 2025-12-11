# 🎯 UI/UX Requirement Document
## Sistem Informasi KosanHub - Design Specification

---

## 1. Design System

### 1.1 Brand Identity
| Element | Specification |
|---------|---------------|
| Brand Name | KosanHub |
| Tagline | "Temukan Hunian, Kelola Properti" |
| Logo Style | Modern, Clean, Trustworthy |
| Tone | Professional yet Friendly |

### 1.2 Color Palette

#### Primary Colors
```css
/* Main Brand */
--primary-50:  #EEF2FF;  /* Lightest */
--primary-100: #E0E7FF;
--primary-200: #C7D2FE;
--primary-300: #A5B4FC;
--primary-400: #818CF8;
--primary-500: #6366F1;  /* Main */
--primary-600: #4F46E5;  /* Hover */
--primary-700: #4338CA;
--primary-800: #3730A3;
--primary-900: #312E81;  /* Darkest */

/* Secondary - Teal for accents */
--secondary-500: #14B8A6;
--secondary-600: #0D9488;
```

#### Semantic Colors
```css
/* Status */
--success: #22C55E;  /* Green - Tersedia, Lunas */
--warning: #F59E0B;  /* Amber - Pending, Akan JT */
--error:   #EF4444;  /* Red - Penuh, Telat bayar */
--info:    #3B82F6;  /* Blue - Info, Notifikasi */

/* Neutral */
--gray-50:  #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

#### Dark Mode
```css
--dark-bg:      #0F172A;
--dark-card:    #1E293B;
--dark-border:  #334155;
--dark-text:    #F8FAFC;
```

### 1.3 Typography

```css
/* Font Family */
--font-primary: 'Inter', sans-serif;
--font-display: 'Plus Jakarta Sans', sans-serif;

/* Font Sizes */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */

/* Font Weights */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* Line Heights */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 1.4 Spacing Scale
```css
/* Base: 4px */
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 1.5 Border Radius
```css
--radius-sm:   0.25rem;  /* 4px - Buttons small */
--radius-md:   0.375rem; /* 6px - Inputs */
--radius-lg:   0.5rem;   /* 8px - Cards */
--radius-xl:   0.75rem;  /* 12px - Modals */
--radius-2xl:  1rem;     /* 16px - Large cards */
--radius-full: 9999px;   /* Pills, Avatar */
```

### 1.6 Shadows
```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1);
--shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1);
```

---

## 2. Component Design

### 2.1 Buttons

| Variant | Style | Usage |
|---------|-------|-------|
| Primary | Solid bg-primary-500, white text | Main CTA |
| Secondary | Outlined primary-500 | Secondary actions |
| Ghost | Transparent, primary text | Tertiary actions |
| Destructive | Solid red | Delete, Cancel |
| Success | Solid green | Confirm, Approve |

```
Size Scale:
┌─────────────────────────────────────────────┐
│ sm:  h-8   px-3  text-sm                    │
│ md:  h-10  px-4  text-base (default)        │
│ lg:  h-12  px-6  text-lg                    │
└─────────────────────────────────────────────┘
```

### 2.2 Input Fields

```
┌─────────────────────────────────────────────┐
│ Label                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ [Icon] Placeholder text              │ │ │
│ └─────────────────────────────────────────┘ │
│ Helper text atau error message              │
└─────────────────────────────────────────────┘

States:
• Default: border-gray-300
• Focus:   border-primary-500, ring-2 ring-primary-100
• Error:   border-error, ring-2 ring-error/20
• Disabled: bg-gray-100, cursor-not-allowed
```

### 2.3 Cards

#### Property Card
```
┌─────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │         [Property Image]                │ │
│ │                                         │ │
│ │  [Featured Badge]      [❤️ Favorite]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Nama Properti                               │
│ 📍 Lokasi                                   │
│                                             │
│ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │ 🛏 3   │ │ 🚿 2   │ │ 📐 120 │          │
│ └────────┘ └────────┘ └────────┘          │
│                                             │
│ Rp 2.500.000 /bulan         [Lihat Detail] │
└─────────────────────────────────────────────┘
```

#### Stat Card
```
┌─────────────────────────────────────────────┐
│                                             │
│  [Icon]                                     │
│                                             │
│  Label                                      │
│  Value (large)           ↑ 12% vs lalu     │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.4 Tables

```
┌─────────────────────────────────────────────────────────┐
│ Header Row (bg-gray-50)                                 │
├─────────────────────────────────────────────────────────┤
│ Row 1 (hover:bg-gray-50)                               │
│ Row 2 (striped: bg-white alternate bg-gray-50)         │
│ Row 3                                                   │
├─────────────────────────────────────────────────────────┤
│ Pagination: [< 1 2 3 ... 10 >]  Showing 1-10 of 100   │
└─────────────────────────────────────────────────────────┘
```

### 2.5 Navigation

#### Sidebar (Dashboard)
```
┌────────────────────┐
│ [Logo] KosanHub    │
├────────────────────┤
│                    │
│ 📊 Dashboard       │  ← Active: bg-primary-50
│ 🏠 Properti        │      text-primary-600
│ 🚪 Kamar           │
│ 👥 Penghuni        │
│ 💳 Pembayaran      │
│ ──────────────     │
│ 📢 Listing Saya    │
│ 📅 Booking         │
│ 💬 Chat       [2]  │  ← Badge notification
│ ──────────────     │
│ ⚙️ Pengaturan      │
│ 👑 Langganan       │
│                    │
├────────────────────┤
│ [Avatar] Username  │
│ owner@email.com    │
│ [Logout]           │
└────────────────────┘
```

---

## 3. Page Layouts

### 3.1 Public Layout
```
┌─────────────────────────────────────────────────────────┐
│ NAVBAR (sticky)                                         │
│ h-16, bg-white, shadow-sm                              │
│ [Logo] [Menu Items] [Search] [Login/Register]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    MAIN CONTENT                         │
│                    (min-height: calc(100vh - 64px))    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
│ bg-gray-900, text-white                                │
│ [Links] [Social] [Copyright]                           │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR          │ HEADER (h-16)                        │
│ w-64 (desktop)   │ [Search] [Notif] [Profile]          │
│ collapsed on     ├─────────────────────────────────────│
│ mobile           │                                      │
│                  │ PAGE CONTENT                         │
│ bg-white         │ p-6                                  │
│ border-r         │ bg-gray-50 (light)                  │
│                  │ bg-dark-bg (dark)                   │
│                  │                                      │
│                  │                                      │
│                  │                                      │
└──────────────────┴─────────────────────────────────────┘
```

---

## 4. User Flows

### 4.1 Registration Flow (Owner)
```
[Landing Page]
      │
      ▼
[Click "Daftar"]
      │
      ▼
[Select: "Pemilik Properti"]
      │
      ▼
[Step 1: Data Pribadi]
• Nama, Email, HP, Password
      │
      ▼
[Step 2: Verifikasi Identitas]
• Upload KTP, Selfie+KTP
      │
      ▼
[Step 3: Info Bisnis]
• Nama usaha, Alamat, Jenis properti
      │
      ▼
[Submit] → [OTP Verification]
      │
      ▼
[Pending Review] (Email notification)
      │
      ▼
[Admin Review 1-3 days]
      │
      ├─── Rejected → [Notification + Reason]
      │
      ▼
[Approved] → [Email: Account Active]
      │
      ▼
[Login] → [Dashboard]
```

### 4.2 Chat Flow
```
[Pencari melihat listing]
      │
      ▼
[Klik "Chat Pemilik"]
      │
      ▼
[Create/Open Chat Room]
      │
      ▼
[Chat Interface]
• Kirim text message
• Upload gambar/dokumen → Google Drive
• Read receipts
      │
      ▼
[Deal/Tidak Deal]
      │
      ├─── Deal → [Owner add as Resident]
      │
      ▼
[Continue Chat / End]
```

### 4.3 Add Resident Flow (Owner)
```
[Dashboard] → [Penghuni] → [+ Tambah]
      │
      ▼
[Select Property & Room]
      │
      ▼
[Step 1: Data Identitas]
• Nama, KTP, TTL, Gender, dll
      │
      ▼
[Step 2: Kontak Darurat]
• Nama, Hubungan, No. HP
      │
      ▼
[Step 3: Info Sewa]
• Tanggal masuk, Harga, Deposit, Jatuh tempo
      │
      ▼
[Step 4: Dokumen]
• Upload KTP, Kontrak
      │
      ▼
[Save] → [Resident Added]
         [Room Status → OCCUPIED]
```

---

## 5. Micro-interactions

### 5.1 Button States
```css
/* Hover */
transform: translateY(-1px);
box-shadow: shadow-lg;
transition: all 150ms ease;

/* Active/Press */
transform: translateY(0);
box-shadow: shadow-sm;

/* Loading */
opacity: 0.7;
cursor: wait;
[Spinner] + "Loading..."
```

### 5.2 Card Hover
```css
/* Property Card */
hover {
  transform: translateY(-4px);
  box-shadow: shadow-xl;
  transition: all 200ms ease;
}
```

### 5.3 Toast Notifications
```
Position: top-right
Animation: slide-in-from-right

┌─────────────────────────────────────┐
│ ✓ Success! Data berhasil disimpan  │
└─────────────────────────────────────┘

Types:
• Success: bg-green-500
• Error: bg-red-500
• Warning: bg-amber-500
• Info: bg-blue-500

Duration: 5 seconds
Dismissable: swipe/click X
```

### 5.4 Loading States
```
┌─────────────────────────────────────┐
│ SKELETON LOADING                     │
│                                     │
│ ████████████████                    │
│ ████████████████████████████        │
│ ██████████████████                  │
│                                     │
│ Shimmer animation: left to right    │
└─────────────────────────────────────┘
```

---

## 6. Responsive Design

### 6.1 Breakpoint Behavior

| Element | Mobile (<768) | Tablet (768-1024) | Desktop (>1024) |
|---------|---------------|-------------------|-----------------|
| Sidebar | Hidden (hamburger) | Collapsed icons | Full expanded |
| Grid Listings | 1 column | 2 columns | 3-4 columns |
| Chat | Full screen | Split 40/60 | Split 30/70 |
| Tables | Card view | Horizontal scroll | Full table |
| Navigation | Bottom nav | Sidebar | Sidebar |

### 6.2 Mobile-First Approach
```css
/* Base: Mobile */
.container { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 1.5rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 2rem; }
}
```

---

## 7. Accessibility Guidelines

### 7.1 Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Use tools: WebAIM Contrast Checker

### 7.2 Focus States
```css
/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### 7.3 ARIA Labels
```html
<!-- Interactive elements -->
<button aria-label="Tutup modal">×</button>
<button aria-label="Kirim pesan">
  <SendIcon />
</button>

<!-- Status -->
<span role="status" aria-live="polite">
  Mengirim pesan...
</span>
```

### 7.4 Keyboard Navigation
- Tab: Navigate between elements
- Enter/Space: Activate buttons
- Arrow keys: Navigate lists/menus
- Escape: Close modals/dropdowns

---

## 8. Animation & Transitions

### 8.1 Base Transitions
```css
/* Quick feedback */
--duration-fast: 150ms;

/* Standard interactions */
--duration-normal: 300ms;

/* Complex animations */
--duration-slow: 500ms;

/* Easing */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 8.2 Page Transitions
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 9. Error States

### 9.1 Form Validation
```
┌─────────────────────────────────────┐
│ Email *                             │
│ ┌─────────────────────────────────┐ │
│ │ invalid-email          [⚠️]    │ │ ← Border red
│ └─────────────────────────────────┘ │
│ ❌ Format email tidak valid         │ ← Error text red
└─────────────────────────────────────┘
```

### 9.2 Empty States
```
┌─────────────────────────────────────────────┐
│                                             │
│              [Illustration]                 │
│                                             │
│         Belum ada penghuni                  │
│    Tambahkan penghuni pertama Anda          │
│                                             │
│         [+ Tambah Penghuni]                 │
│                                             │
└─────────────────────────────────────────────┘
```

### 9.3 Error Pages
```
┌─────────────────────────────────────────────┐
│                                             │
│              [404 Illustration]             │
│                                             │
│            Halaman Tidak Ditemukan          │
│   Maaf, halaman yang Anda cari tidak ada    │
│                                             │
│            [Kembali ke Beranda]             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 10. Design Checklist

### Pre-Development
- [ ] Color palette defined
- [ ] Typography scale set
- [ ] Spacing system established
- [ ] Component library documented
- [ ] Responsive breakpoints decided

### Per Component
- [ ] All states designed (default, hover, active, disabled)
- [ ] Error states included
- [ ] Loading states included
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Responsive behavior defined

### Per Page
- [ ] Mobile layout designed
- [ ] Tablet layout designed
- [ ] Desktop layout designed
- [ ] Empty states designed
- [ ] Error states designed
- [ ] Loading skeleton designed
