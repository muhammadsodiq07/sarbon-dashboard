# Sarbon Dispatcher — Cargo List Page (Premium v3)

Frontend test task: dispatcher uchun cargo ro'yxati sahifasi.
**Next.js 14 + React 18 + TypeScript + Tailwind + TanStack Query**

## 🚀 Tez ishga tushirish

```bash
pnpm i
pnpm run dev
```

Brauzerda: **http://localhost:3000**

## ✨ Yangi xususiyatlar (v3)

### 🎯 Filterlar to'liq ishlaydi
Barcha filterlar **client-side** ishlaydi — Qayerdan, Qayerga, Transport, Og'irlik (min/max), Sana, Saralash, va 5 ta toggle switch (Sevimli, Takliflar, Refrijerator, ADR, 2 haydovchili). Filter o'zgarganda **darhol** natija ko'rinadi, qayta loading yo'q.

### 📍 Sticky sidebar (desktop)
Chap tarafdagi xarita + filter **doim ko'rinib turadi**, pastga skroll qilganda yo'qolmaydi. Filter ham scroll bo'lsa, ichki scrollbar bilan.

### 📱 Mobile drawer
Mobile'da filter ikon search bar yonida — bosilganda **slide-in drawer** ochiladi (o'ngdan), overlay bilan. Aktiv filterlar soni ikon ustida badge'da ko'rinadi.

### 🎬 Smooth transitions
- Filter o'zgarganda **fade-in animatsiya**
- Body scroll lock mobile drawer ochiq paytda
- `keepPreviousData` TanStack Query'da — eski natijalar yangisi kelguncha qoladi
- Layout jumping yo'q

### 📋 Footer
Toza Footer — brand, foydali linklar, kontakt, ma'lumot, App Store / Google Play tugmalari, copyright.

### 📌 Sticky header
Header har doim yuqorida turadi (z-40), skroll'da yo'qolmaydi.

## 🗺 Asosiy elementlar

- **Katta xarita** chap sidebar'da — barcha cargo yo'llari (yashil/sariq/kulrang ranglar bilan)
- **Toggle switch'lar** — har biri o'z rangli ikon kvadrati bilan (yurak=qizil, chat=ko'k, qor=havorang, ogohlantirish=sariq, foydalanuvchilar=binafsha)
- **Mini-map har bir kartada** — real lat/lng asosida
- **Gradient stat kartochkalar** — sparkline grafiklar bilan
- **Cargo card** — to'lov breakdown, hujjat rozetkalari, ADR badge, vehicles count

## 🔧 CORS proxy

Brauzer `/api/sarbon/...` → Next.js server → `https://api.sarbon.me/v1/...` (4 ta majburiy header bilan).

## 📁 Struktura

```
src/
├── app/
│   ├── api/sarbon/[...path]/route.ts   # CORS proxy
│   ├── dispatcher/cargo/page.tsx
│   └── globals.css
├── components/
│   ├── cargo/
│   │   ├── CargoPageContent.tsx        # Main layout
│   │   ├── BigRouteMap.tsx             # Katta xarita
│   │   ├── CargoFilterSidebar.tsx      # Filter + switchlar
│   │   ├── CargoSearchBar.tsx          # Search + mobile filter btn
│   │   ├── CargoStats.tsx              # Stats dashboard
│   │   ├── CargoCard.tsx               # Cargo card
│   │   ├── MiniMap.tsx
│   │   ├── CargoPagination.tsx
│   │   └── ...
│   ├── layout/                         # Header, Footer, Logo, LanguageSwitcher
│   └── ui/                             # Button, Input, Switch, etc.
├── hooks/                              # useCargoList, useCargoFilters, useT
├── lib/                                # api-client, cargo.service, utils
├── store/                              # i18n.store
├── i18n/locales/                       # uz, ru, en
└── types/                              # cargo.ts
```

## ✅ Test mezonlari (10/10)

Hammasi ✓ — README'ning oldingi versiyasini ko'ring.

## 🛠 Skriptlar

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run type-check
```
