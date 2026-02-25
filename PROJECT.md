# Atelier Motors — Custom CRM & Shop Management Platform

## Project Overview

A custom CRM and shop management platform built for **Atelier Motors**, a luxury/exotic car wrapping shop in Orange County, CA. This replaces Shopmonkey ($500/mo) and Trello with a purpose-built solution.

### Client Details

- **Company:** Atelier Motors
- **Owner:** Brandon
- **Location:** Orange County, CA
- **Revenue:** ~$60K/month
- **Team:** 6 full-time employees
- **Services:** Luxury/exotic car wrapping, PPF, ceramic coating, tint, shop work, dealership
- **Instagram:** @ateliermotorsportoc
- **Website:** ateliermotors.com
- **Budget:** $6,000–$7,500 one-time build
- **Current stack:** Trello (CRM), interested in Shopmonkey features

---

## Product Requirements

### Core Modules

#### 1. Customer Management (CRM)

- Customer profiles with vehicle history
- Contact info, notes, vehicle details (year/make/model/color)
- Customer tags (VIP, repeat, referral source)
- Search and filter customers
- Communication log (calls, texts, emails)

#### 2. Job/Work Order Management

- Create work orders tied to customers and vehicles
- Job types: wrap, PPF, ceramic, tint, custom, dealership
- Status workflow: Inquiry → Quoted → Scheduled → In Progress → QC → Complete → Invoiced
- Photo documentation per job (before/after)
- Team member assignment per job
- Estimated vs actual hours tracking
- Material tracking (wrap brand, color, square footage)

#### 3. Scheduling & Calendar

- Shop calendar view (day/week/month)
- Bay/station assignment (which bay, which car)
- Drag-and-drop scheduling
- Estimated job duration
- Conflict detection (double-booked bays)

#### 4. Invoicing & Payments

- Generate invoices from work orders
- Line items with labor + materials
- Deposit tracking (50% upfront typical for wraps)
- Payment status tracking
- Integration-ready for Stripe/Square

#### 5. Dealership Inventory

- Vehicle listings for sale
- Status: Available / Pending / Sold
- Photos, specs, pricing
- Cost basis and margin tracking

#### 6. iMessage Marketing Blasts

- Customer list segmentation
- Blue iMessage blast capability (via Mac relay or Apple Business API)
- Template management
- Opt-in/opt-out tracking (TCPA compliance)
- Delivery/read receipt tracking

#### 7. Dashboard & Analytics

- Monthly revenue tracking
- Job count and average ticket size
- Customer acquisition metrics
- Employee utilization
- Pipeline value (quoted but not yet scheduled)

---

## Design System — "Atelier"

### Brand Identity

Atelier's brand is **minimal, luxury, industrial**. Think high-end gallery meets automotive workshop.

### Typography

- **Primary font:** Serif display — use `Playfair Display` or `Cormorant Garamond` for headings
- **Body font:** Clean sans-serif — use `Inter` or `DM Sans`
- **Wordmark:** "atelier" in lowercase serif, muted gray (#6B6B6B on light, #A0A0A0 on dark)

### Color Palette

- **Background:** #0A0A0A (near black) / #FFFFFF (white mode)
- **Surface:** #141414 (cards, panels)
- **Border:** #2A2A2A (subtle dividers)
- **Text Primary:** #F5F5F5 (on dark) / #1A1A1A (on light)
- **Text Secondary:** #888888
- **Accent:** #C4A265 (warm gold — luxury touch, use sparingly)
- **Success:** #4CAF50
- **Warning:** #FF9800
- **Error:** #F44336

### UI Principles

- Dark mode primary (matches their brand)
- Generous whitespace — never cramped
- Large hero images for dealership section
- Minimal borders, use elevation/shadow instead
- No rounded corners > 8px — keep it sharp
- Subtle hover states, smooth transitions (200ms ease)
- Photography-forward (the cars ARE the design)

---

## Tech Stack

- **Frontend:** Next.js 16+ (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (customized to Atelier design system)
- **State:** React hooks + context (keep it simple)
- **Backend:** Next.js API routes (for demo) → can scale to separate API later
- **Database:** SQLite via Prisma (for demo) → PostgreSQL in production
- **Auth:** NextAuth.js (simple credentials for demo)
- **Deployment:** Vercel
