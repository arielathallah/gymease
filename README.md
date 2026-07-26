# GymEase - Workout Without Bringing Anything 🏋️‍♂️

GymEase is a full-featured SaaS marketplace platform connecting gym enthusiasts across Indonesia with partner gyms. Users can search and book gyms, rent clothes (sizes XS - XXL) & towels on-demand, purchase fitness products, compare pass packages, and access instant QR tickets.

---

## 🌟 Key Features

- **Guest Access First**: Guests can browse landing page, search gyms by city/branch, view facilities, opening hours, pricing, packages, products, FAQs, and reviews without requiring login. Login is required only for Booking, Checkout, Wishlist, Reviews, and Profile management.
- **Gym Partner Branches**: Coverage across major Indonesian hubs:
  - **GymEase Kemanggisan** (Jakarta Barat)
  - **GymEase Grogol** (Jakarta Barat)
  - **GymEase BSD** (Tangerang Selatan)
  - **GymEase Bekasi** (Bekasi Cyber Park area)
  - **GymEase Tangerang** (Tangerang City Center)
  - **GymEase Depok** (Margonda Raya)
- **Comprehensive Booking & Rental Flow**:
  - Choose Branch & Partner Gym
  - Choose Date & Time slot
  - Select Gym Pass Package
  - Rent Clothes (Interactive **XS, S, M, L, XL, XXL** size picker with real-time stock & price calculation)
  - Rent Towels (Quantity & live stock check)
  - Voucher & Promo Code redemption (`GYMEASE20`, `FITSTART`)
  - Subtotal, Discount, Tax, Grand Total calculation & QR Ticket generation
- **Role-Based Access Control (RBAC)**:
  - `Guest`: Public visitor.
  - `User`: Manage bookings, QR tickets, order history, wishlist, profile.
  - `Branch Admin`: Managed strictly per branch via **Supabase Row Level Security (RLS)**. Admin Kemanggisan ONLY sees Kemanggisan bookings/orders!
  - `Super Admin`: Global system overview, revenue analytics, manage all partners/branches, inventory, and export reports.
- **Analytics & Export Engine**:
  - Dashboard interactive revenue & booking charts using Recharts.
  - Export system reports into **PDF**, **Excel (.xlsx)**, and **CSV** formats.
- **Dynamic UX**: Dark Mode & Light Mode support, glassmorphic UI, Google Maps direction integration, WhatsApp live contact, interactive QR modal ticket viewer.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS, Framer Motion, Lucide React Icons
- **Database & Security**: PostgreSQL, Supabase Auth, Supabase Storage, Supabase Row Level Security (RLS)
- **Analytics & Data Export**: Recharts, jsPDF, XLSX (SheetJS)
- **State Management**: Zustand / Dynamic React State with Mock-fallback capability

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone or open the workspace directory
cd C:\Users\Hp_5C\.gemini\antigravity\scratch\gymease

# Install dependencies
npm install
```

### 2. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view GymEase!

---

## 🗄️ Database & Supabase Deployment

1. Copy `.env.example` to `.env.local` and add your Supabase credentials.
2. Run the migration SQL in your Supabase SQL Editor:
   `supabase/migrations/20260723000000_schema_rls_storage.sql`
3. Execute the seed script:
   `supabase/seed.sql`

---

## 📄 License

Built for GymEase Indonesia. All rights reserved.
