# Atelier Motors ERP — Demo Requirements (Claude Code Spec)

> **Target**: Clickable prototype for client demo (1-day build)
> **Client**: Brandon, owner of Atelier Motors (luxury/exotic car wrapping + dealership, OC, CA)
> **Stack**: Next.js 14 (App Router) + Tailwind CSS + local state (no DB for V1)
> **Goal**: Replace Trello. Show a Shopmonkey-quality CRM tailored to luxury auto aesthetics at 1/10th the ongoing cost.

---

## 1. DESIGN SYSTEM — "Atelier"

Brandon's brand is ultra-luxury minimalism. The ERP must feel like it belongs in his world — not a generic blue SaaS dashboard.

### Typography

- **Display / Headings**: `"DM Serif Display"` (Google Fonts) — closest match to Atelier's serif wordmark
- **Body / UI**: `"DM Sans"` (Google Fonts) — clean geometric sans that pairs perfectly
- **Monospace (data/IDs)**: `"JetBrains Mono"` (Google Fonts)
- **All headings**: Lowercase or sentence case (never ALL CAPS except short labels like "VIN" or "PPF")

### Color Palette

```css
:root {
  /* Core */
  --bg-primary: #0a0a0a; /* Near-black background */
  --bg-secondary: #141414; /* Card/panel background */
  --bg-tertiary: #1e1e1e; /* Hover states, inputs */
  --bg-elevated: #242424; /* Modals, dropdowns */

  /* Text */
  --text-primary: #f5f5f0; /* Warm off-white */
  --text-secondary: #8a8a80; /* Muted labels */
  --text-tertiary: #5a5a55; /* Disabled, hints */

  /* Accent — Warm gold (luxury cue) */
  --accent: #c9a96e; /* Primary accent — muted gold */
  --accent-hover: #d4b87d; /* Hover state */
  --accent-muted: rgba(201, 169, 110, 0.12); /* Subtle backgrounds */

  /* Status */
  --status-active: #4ade80; /* Green — in progress */
  --status-waiting: #facc15; /* Amber — awaiting approval */
  --status-complete: #c9a96e; /* Gold — done */
  --status-urgent: #f87171; /* Red — overdue/blocked */

  /* Borders */
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
}
```

### Design Rules

- **Dark mode only** (luxury feel, matches automotive photography)
- **No rounded corners > 8px** — sharp, architectural feel (use `rounded-lg` max)
- **Generous whitespace** — minimum 24px padding on cards, 16px gaps in grids
- **Subtle borders** — 1px with very low opacity, never heavy outlines
- **No emoji or playful icons** — use Lucide icons, thin stroke weight (1.5px)
- **Images**: Use placeholder exotic car images from Unsplash (Lamborghini, Porsche, McLaren) — seeded with `?sig=N` for variety
- **Animations**: Subtle only — 150ms ease-out transitions on hover, no bouncing/spring
- **Sidebar**: 240px wide, collapsible, dark with gold accent on active item
- **No gradients** except very subtle ones on CTAs

### Logo

- Use text "atelier" in DM Serif Display, lowercase, tracking -0.02em
- Below it, smaller: "motors" in DM Sans, uppercase, tracking 0.2em, text-secondary color
- This goes top-left of sidebar

---

## 2. APP STRUCTURE

### Layout

```
┌─────────┬──────────────────────────────────┐
│         │  Header: Page title + search +   │
│ Sidebar │  user avatar                     │
│ 240px   ├──────────────────────────────────┤
│         │                                  │
│ • Jobs  │  Main content area               │
│ • Calendar│                                │
│ • Estimates│                               │
│ • Customers│                               │
│ • Vehicles│                                │
│ • Settings│                                │
│         │                                  │
└─────────┴──────────────────────────────────┘
```

### Navigation (sidebar)

1. **Jobs** (Kanban board) — DEFAULT VIEW, replace Trello
2. **Calendar** (appointment scheduling)
3. **Estimates & Invoices**
4. **Customers** (CRM contacts)
5. **Vehicles** (linked to customers)
6. **Settings** (placeholder)

---

## 3. MODULE SPECS

### 3A. JOB BOARD (Priority 1 — The Trello Killer)

This is the hero screen. Must immediately feel better than Trello.

**Layout**: Horizontal Kanban with drag-and-drop columns

**Columns (left to right)**:
| Column | Color Tag | Description |
|--------|-----------|-------------|
| Inquiry | `--text-secondary` | New lead / quote request |
| Scheduled | `--accent` | Appointment confirmed |
| In Progress | `--status-active` | Vehicle in shop |
| Awaiting Approval | `--status-waiting` | Estimate sent, waiting on customer |
| Complete | `--status-complete` | Job done, ready for pickup |

**Job Card contents**:

```
┌─────────────────────────────┐
│ [Vehicle Thumbnail]  40x40  │
│ 2024 Lamborghini Huracán    │  ← vehicle year/make/model, bold
│ Full PPF + Ceramic Coating  │  ← job title / service
│                             │
│ 👤 Marcus Thompson          │  ← customer name
│ 🔧 Alex (Tech)             │  ← assigned technician
│ $12,500                     │  ← job total, accent color
│                             │
│ ▓▓▓▓▓▓░░░░ 60%             │  ← progress bar (optional)
│ Due: Feb 28                 │  ← due date
└─────────────────────────────┘
```

(Use Lucide icons, not emoji — the above is just for spec clarity)

**Interactions**:

- Drag cards between columns (use `@dnd-kit/core` or `react-beautiful-dnd`)
- Click card → slide-out detail panel from right (not a modal — keeps context)
- Filter bar at top: by technician, by service type, by date range
- "+ New Job" button (gold accent) opens a form

**Job Detail Panel** (slide from right, ~480px wide):

- Vehicle info with photo
- Customer contact info (phone, click-to-call)
- Service breakdown (line items with prices)
- Status timeline (vertical, shows progression through columns with timestamps)
- Notes section (append-only log)
- Photo gallery (before/after — placeholder images for demo)
- "Send Estimate" / "Mark Complete" action buttons

### 3B. CALENDAR / SCHEDULING (Priority 2)

**Layout**: Week view by default, with month toggle

**Features**:

- Color-coded blocks by service type:
  - PPF (Paint Protection Film) → Gold/amber
  - Wrap → Blue-grey
  - Ceramic Coating → Green
  - Detailing → Purple-grey
  - Dealership/Sales → White
- Each block shows: vehicle, customer name, time range
- Click block → opens job detail (same panel as Kanban)
- Bay/lift view: rows represent shop bays (Bay 1, Bay 2, Bay 3 + Detail Bay)
- Drag to reschedule

**For demo**: Pre-populate with 8-10 jobs spread across current week

### 3C. ESTIMATES & INVOICES (Priority 3)

**Estimate Builder**:

- Select customer (search/autocomplete)
- Select vehicle (from customer's vehicles, or add new)
- Add line items from service catalog:

| Service                                  | Base Price      |
| ---------------------------------------- | --------------- |
| Full Body PPF (XPEL Ultimate Plus)       | $5,500 - $8,000 |
| Partial PPF (Front End)                  | $1,800 - $2,500 |
| Full Color Change Wrap                   | $3,500 - $6,000 |
| Chrome Delete                            | $800 - $1,500   |
| Ceramic Coating (Gtechniq Crystal Serum) | $1,200 - $2,000 |
| Full Detail                              | $300 - $500     |
| Window Tint (Full Vehicle)               | $400 - $600     |
| Wheel Powder Coating (set of 4)          | $1,200 - $2,000 |

- Custom line items (free text + price)
- Tax toggle (CA sales tax 7.75%)
- Discount field ($ or %)
- Notes to customer
- **Preview**: Clean, branded estimate that could be sent to a customer
  - Shows Atelier logo, vehicle info, line items, total
  - "Approve" button (simulated)

**Invoice view**: Same as estimate but with "INVOICE" header, payment status badge, and "Mark Paid" action

**List view**: Table of all estimates/invoices with:

- Status filter (Draft, Sent, Approved, Paid, Overdue)
- Search by customer or vehicle
- Sort by date, amount

### 3D. CUSTOMERS CRM (Priority 4 — but still important)

**List View**: Table with columns:

- Name
- Phone
- Email
- Vehicles (count badge)
- Total Spent (lifetime)
- Last Visit
- Tags (VIP, Dealer, Repeat, New)

**Customer Detail Page**:

- Contact info card
- Vehicles owned (linked list)
- Job history (timeline of all work)
- Total revenue from this customer
- Notes
- Communication log (placeholder for future text/email integration)

### 3E. VEHICLES

**List View**: Card grid (not table — show vehicle photos)

- Each card: Photo, Year/Make/Model, Owner name, services count
- Search by VIN, make, model, or owner

**Vehicle Detail**:

- Photo gallery
- VIN, Color, Mileage
- Owner (linked to customer)
- Service history (all jobs on this vehicle)
- Current protection status (e.g., "PPF: Full body, applied 01/15/2025")

---

## 4. MOCK DATA

Pre-seed the app with realistic luxury auto data. This makes the demo feel REAL.

### Customers (8-10)

```json
[
  {
    "name": "Marcus Thompson",
    "phone": "(949) 555-0142",
    "email": "marcus@outlook.com",
    "tags": ["VIP", "Repeat"],
    "totalSpent": 47500
  },
  {
    "name": "David Chen",
    "phone": "(714) 555-0198",
    "email": "dchen@gmail.com",
    "tags": ["VIP"],
    "totalSpent": 32000
  },
  {
    "name": "Sarah Al-Rashidi",
    "phone": "(949) 555-0267",
    "email": "sarah.r@icloud.com",
    "tags": ["New"],
    "totalSpent": 6500
  },
  {
    "name": "James Moretti",
    "phone": "(310) 555-0334",
    "email": "jmoretti@yahoo.com",
    "tags": ["Dealer"],
    "totalSpent": 125000
  },
  {
    "name": "Ryan Okafor",
    "phone": "(949) 555-0411",
    "email": "ryan.o@gmail.com",
    "tags": ["Repeat"],
    "totalSpent": 18500
  },
  {
    "name": "Kevin Park",
    "phone": "(562) 555-0178",
    "email": "kpark@gmail.com",
    "tags": ["VIP", "Repeat"],
    "totalSpent": 55000
  },
  {
    "name": "Nicole Reyes",
    "phone": "(714) 555-0523",
    "email": "nicole.r@outlook.com",
    "tags": ["New"],
    "totalSpent": 3800
  },
  {
    "name": "Anthony DiNapoli",
    "phone": "(949) 555-0691",
    "email": "adinapoli@icloud.com",
    "tags": ["Repeat"],
    "totalSpent": 22000
  }
]
```

### Vehicles (10-12)

```json
[
  {
    "year": 2024,
    "make": "Lamborghini",
    "model": "Huracán Tecnica",
    "color": "Bianco Sideris",
    "vin": "ZHWUF4ZF4RLA12345",
    "owner": "Marcus Thompson"
  },
  {
    "year": 2023,
    "make": "Porsche",
    "model": "911 GT3 RS",
    "color": "Python Green",
    "vin": "WP0AF2A93PS123456",
    "owner": "David Chen"
  },
  {
    "year": 2024,
    "make": "McLaren",
    "model": "750S",
    "color": "Silica White",
    "vin": "SBM14DCA1RW123456",
    "owner": "Sarah Al-Rashidi"
  },
  {
    "year": 2023,
    "make": "Ferrari",
    "model": "296 GTB",
    "color": "Rosso Corsa",
    "vin": "ZFF96BHA4P0123456",
    "owner": "James Moretti"
  },
  {
    "year": 2024,
    "make": "Mercedes-AMG",
    "model": "GT 63 S",
    "color": "Obsidian Black",
    "vin": "W1K6J7GB4RA123456",
    "owner": "Kevin Park"
  },
  {
    "year": 2023,
    "make": "BMW",
    "model": "M4 Competition",
    "color": "Isle of Man Green",
    "vin": "WBS43AZ09P1234567",
    "owner": "Ryan Okafor"
  },
  {
    "year": 2024,
    "make": "Rolls-Royce",
    "model": "Spectre",
    "color": "Black Diamond",
    "vin": "SCA666S04RU123456",
    "owner": "Kevin Park"
  },
  {
    "year": 2023,
    "make": "Porsche",
    "model": "Cayenne Turbo GT",
    "color": "Arctic Grey",
    "vin": "WP1BF2AY5PD123456",
    "owner": "Anthony DiNapoli"
  },
  {
    "year": 2024,
    "make": "Lamborghini",
    "model": "Urus Performante",
    "color": "Nero Noctis",
    "vin": "ZPBUA1ZL4RLA12345",
    "owner": "James Moretti"
  },
  {
    "year": 2023,
    "make": "Audi",
    "model": "RS e-tron GT",
    "color": "Daytona Grey",
    "vin": "WUAASAF67P1234567",
    "owner": "Nicole Reyes"
  }
]
```

### Jobs (8-10 across Kanban columns)

Include a mix:

- 2 in "Inquiry" (new leads)
- 1 in "Scheduled"
- 3 in "In Progress" (shop is busy — looks great in demo)
- 1 in "Awaiting Approval"
- 2 in "Complete"

Each job should have realistic services and prices matching the service catalog above.

### Calendar

Pre-populate the current week with the "Scheduled" and "In Progress" jobs assigned to bays and time slots.

---

## 5. TECHNICAL NOTES FOR CLAUDE CODE

### Project Setup

```bash
npx create-next-app@latest atelier-erp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd atelier-erp
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react date-fns
```

### Key Architecture Decisions

- **State management**: React Context + useReducer (no Redux — overkill for demo)
- **Data**: JSON files in `/src/data/` imported directly. No API routes needed.
- **Routing**: App Router — `/jobs`, `/calendar`, `/estimates`, `/customers`, `/vehicles`
- **Drag-and-drop**: `@dnd-kit` (modern, maintained, lightweight)
- **Icons**: `lucide-react` (clean, consistent, thin strokes)
- **Dates**: `date-fns` (lightweight)
- **No auth**: Demo mode — show "Brandon" avatar as logged-in user
- **No database**: All state in-memory with React Context, pre-seeded from mock data

### File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar + header
│   ├── page.tsx            # Redirects to /jobs
│   ├── jobs/
│   │   └── page.tsx        # Kanban board
│   ├── calendar/
│   │   └── page.tsx        # Week/month view
│   ├── estimates/
│   │   └── page.tsx        # Estimate/invoice list + builder
│   ├── customers/
│   │   └── page.tsx        # Customer list + detail
│   └── vehicles/
│       └── page.tsx        # Vehicle grid + detail
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── SlidePanel.tsx  # Reusable right slide-out panel
│   ├── jobs/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── JobCard.tsx
│   │   └── JobDetail.tsx
│   ├── calendar/
│   │   ├── WeekView.tsx
│   │   └── CalendarEvent.tsx
│   ├── estimates/
│   │   ├── EstimateBuilder.tsx
│   │   ├── EstimatePreview.tsx
│   │   └── EstimateList.tsx
│   ├── customers/
│   │   ├── CustomerTable.tsx
│   │   └── CustomerDetail.tsx
│   ├── vehicles/
│   │   ├── VehicleGrid.tsx
│   │   └── VehicleDetail.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── ProgressBar.tsx
│       └── StatusDot.tsx
├── context/
│   └── AppContext.tsx       # Global state provider
├── data/
│   ├── customers.ts
│   ├── vehicles.ts
│   ├── jobs.ts
│   ├── services.ts          # Service catalog with pricing
│   └── estimates.ts
├── types/
│   └── index.ts             # TypeScript interfaces
└── lib/
    └── utils.ts             # Formatters, helpers
```

### TypeScript Types

```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: ("VIP" | "Repeat" | "New" | "Dealer")[];
  totalSpent: number;
  lastVisit: string; // ISO date
  notes: string;
  createdAt: string;
}

interface Vehicle {
  id: string;
  customerId: string;
  year: number;
  make: string;
  model: string;
  color: string;
  vin: string;
  imageUrl: string; // Unsplash placeholder
  services: string[]; // IDs of past jobs
}

type JobStatus = "inquiry" | "scheduled" | "in_progress" | "awaiting_approval" | "complete";

interface Job {
  id: string;
  customerId: string;
  vehicleId: string;
  title: string; // e.g., "Full PPF + Ceramic Coating"
  status: JobStatus;
  assignedTech: string;
  services: JobLineItem[];
  total: number;
  progress: number; // 0-100
  dueDate: string;
  bay: string; // "Bay 1", "Bay 2", etc.
  scheduledStart: string; // ISO datetime
  scheduledEnd: string;
  notes: JobNote[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

interface JobLineItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

interface JobNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Estimate {
  id: string;
  customerId: string;
  vehicleId: string;
  jobId?: string;
  status: "draft" | "sent" | "approved" | "declined" | "invoiced" | "paid" | "overdue";
  lineItems: JobLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  createdAt: string;
  sentAt?: string;
  approvedAt?: string;
  paidAt?: string;
}

interface Service {
  id: string;
  name: string;
  category: "ppf" | "wrap" | "ceramic" | "detail" | "tint" | "wheels" | "other";
  priceMin: number;
  priceMax: number;
  defaultPrice: number;
  estimatedHours: number;
}
```

---

## 6. WHAT MAKES THIS A "KILLER" DEMO

1. **It looks like HIS brand** — not generic SaaS. Dark luxury aesthetic with gold accents, his serif font, his world of exotic cars.

2. **The Kanban board is immediately familiar** — he already thinks in Trello columns. This is Trello but with vehicle photos, customer info, pricing, and progress built in.

3. **Real-looking data** — Lamborghinis, Ferraris, McLarens with real color names. Customers with real OC phone numbers. Prices that match his actual service rates.

4. **The estimate preview** — show him a clean, branded estimate he could send to a customer. This alone replaces manual quoting.

5. **Calendar with bay management** — he can see his shop capacity at a glance. No more double-booking bays.

6. **Speed** — it's a client-side Next.js app with mock data. Everything loads instantly. Makes it feel premium.

---

## 7. DEMO SCRIPT (How to present to Brandon)

1. Open the app → "This is your shop management system, built for Atelier."
2. **Jobs page** → "Here's your workflow. Same columns you use in Trello, but now each card shows the vehicle, customer, pricing, and who's working on it."
3. Drag a card → "Drag jobs between stages. When Alex finishes the Huracán PPF, drag it to Complete."
4. Click a card → "Click into any job for the full breakdown — services, photos, notes, timeline."
5. **Calendar** → "See your week at a glance. Each bay has its own row so you never double-book."
6. **Estimates** → "Build a quote in 30 seconds. Pick the customer, pick the car, add services from your catalog. Send it — and when they approve, it converts to a job automatically."
7. Show estimate preview → "This is what your customer sees. Your branding, clean layout, easy approve button."
8. **Customers** → "Everyone who's ever been in your shop, with their vehicles, spend history, and tags. Your VIPs, your dealer contacts, all in one place."
9. Close: "This is yours. No monthly fee. We build it to your spec, hosted on your domain."

---

## 8. CLAUDE CODE PROMPT

When you're ready to build, paste this to Claude Code:

```
Build the Atelier Motors ERP demo app per the requirements in atelier-erp-requirements.md.

Start with:
1. Project scaffolding (Next.js + Tailwind + packages)
2. Design system (globals.css with CSS variables, Tailwind config with custom fonts/colors)
3. Layout (sidebar, header, slide panel)
4. Mock data files
5. Jobs Kanban board (this is the hero — make it beautiful)
6. Calendar view
7. Estimates & invoices
8. Customers & vehicles

Prioritize visual polish over functionality depth. This is a demo — it needs to LOOK incredible and be clickable, not handle edge cases. Use placeholder images from picsum.photos or loremflickr.com/640/480/exotic+car for vehicle photos.

Design direction: Ultra-luxury dark UI. Think Vertu phone meets Shopmonkey. DM Serif Display for headings, DM Sans for body. Near-black backgrounds, warm off-white text, muted gold accents. Sharp corners, generous spacing, thin-stroke icons.
```
