# InvoiceForge — Project Requirements Analysis

## Executive Summary

I've completed a comprehensive analysis of the InvoiceForge requirements document. This is a **Phase 1 Frontend Design & Prototyping** project for a single-user invoicing application targeting freelancers and solo professionals in Singapore.

Below is my structured understanding of the **WHAT**, **WHY**, and **HOW**.

---

## 1. THE WHAT — Project Definition

### 1.1 Core Product Identity

| Attribute | Definition |
|-----------|------------|
| **Product Name** | InvoiceForge |
| **Product Type** | Single-user invoicing SPA |
| **Target Users** | Freelancers & solo professionals (Singapore-based) |
| **Phase Scope** | Frontend prototyping with mock data (no backend persistence yet) |
| **Currency** | SGD — `S$1,234.56` format with 2 decimal precision |

### 1.2 User Personas Served

```
┌─────────────────────────────────────────────────────────────────┐
│                        TWO DISTINCT USERS                       │
├─────────────────────────────┬───────────────────────────────────┤
│         THE ADMIN           │           THE CLIENT              │
│       (You - Owner)         │         (The Payer)               │
├─────────────────────────────┼───────────────────────────────────┤
│ • Friction-free workflow    │ • Professional presentation      │
│ • Rapid document generation │ • Trustworthy, clear documents   │
│ • Cash flow visibility      │ • Zero barriers to payment       │
│ • Speed & efficiency        │ • Confidence in legitimacy       │
└─────────────────────────────┴───────────────────────────────────┘
```

### 1.3 Application Views (5 Total)

| View | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| **Dashboard** | `/dashboard` | Financial pulse & quick actions | Metrics grid, recent invoices, activity feed |
| **Clients** | `/clients` | Client directory | Table/card list, avatar system, add/edit forms |
| **Invoices** | `/invoices` | Invoice command center | Filter tabs, status badges, row actions |
| **Invoice Editor** | `/invoices/new`, `/invoices/:id/edit` | High-speed creation | Line item editor, live calculations, sticky footer |
| **Public Invoice** | `/i/:token` | Client-facing shareable | Print-optimized, payment modal mockup |

### 1.4 Data Model Summary

```
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│     CLIENT      │       │       INVOICE       │       │     LINE_ITEM       │
├─────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ • id            │◄──1:N─│ • id                │──1:N─►│ • id                │
│ • name          │       │ • invoiceNumber     │       │ • type (item/       │
│ • email         │       │ • clientId          │       │   section/discount) │
│ • company       │       │ • status            │       │ • description       │
│ • address       │       │ • issueDate         │       │ • quantity          │
│ • phone         │       │ • dueDate           │       │ • unitType          │
│ • notes         │       │ • token             │       │ • unitPrice         │
│ • totalBilled   │       │ • lineItems[]       │       │ • position          │
└─────────────────┘       └─────────────────────┘       └─────────────────────┘
```

**Invoice Status Flow:**
```
┌─────────┐    Send    ┌─────────┐   Mark Paid   ┌─────────┐
│  DRAFT  │ ─────────► │ PENDING │ ────────────► │  PAID   │
└─────────┘            └────┬────┘               └─────────┘
                            │
                     Due Date Passes
                            │
                            ▼
                      ┌──────────┐
                      │ OVERDUE  │
                      └──────────┘
```

---

## 2. THE WHY — Design Philosophy & Rationale

### 2.1 Core Philosophy

> **"Precision is the ultimate sophistication."**

Every pixel, interaction, and typographic choice must serve a purpose. The interface conveys:

| Quality | Manifestation |
|---------|---------------|
| **Swift** | Inertia/React SPA — instant navigation, no page reloads |
| **Confident** | Bold typography, deliberate spacing — projects competence |
| **Trustworthy** | Clean financial presentation — clients take invoices seriously |

### 2.2 Design Manifesto: "Neo-Editorial Precision"

This is a **hybrid aesthetic** merging two design traditions:

```
┌──────────────────────────────┬────────────────────────────────────┐
│     SWISS FOUNDATION         │     NEO-EDITORIAL EXECUTION        │
├──────────────────────────────┼────────────────────────────────────┤
│ Rigid grid systems           │ Asymmetric tension within grid     │
│ Purposeful whitespace        │ Generous margins that breathe      │
│ Typographic hierarchy        │ DRAMATIC scale contrasts           │
│ Functional minimalism        │ Singular bold accent for focus     │
│ Data-forward layouts         │ Editorial typography treatments    │
└──────────────────────────────┴────────────────────────────────────┘
```

### 2.3 The Signature Element

> **The Invoice Number Treatment**

The invoice number (e.g., `2025-0001`) is displayed:
- **Oversized** (`text-6xl` to `text-8xl`)
- **Monospace font** (Geist Mono)
- **Tighter tracking**
- **Editorial confidence** in positioning

This transforms a mundane reference number into **a statement of professionalism**.

### 2.4 Anti-Patterns (Explicit Rejections)

| ❌ AVOID | ✅ INSTEAD | RATIONALE |
|----------|-----------|-----------|
| Soft diffuse shadows (`shadow-lg`) | Sharp, shallow (`shadow-sm`) or 1px borders | Precision over softness |
| Rounded-everything (`rounded-xl`) | Precise corners (`rounded-md`/`rounded-lg` max) | Intentional, not decorative |
| Generic icons everywhere | Purposeful iconography + text labels | Clarity over decoration |
| Gradient backgrounds | Solid color blocks | Swiss minimalism |
| Decorative illustrations | Data & typography ARE the decoration | Content-first design |
| System fonts (Inter/Roboto) | Distinctive pairing (Instrument Serif + Geist) | Editorial identity |

---

## 3. THE HOW — Technical Implementation Strategy

### 3.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        TECHNOLOGY STACK                         │
├─────────────────────────────────────────────────────────────────┤
│  BACKEND           │  Ruby on Rails 8.x                         │
│  FRONTEND ADAPTER  │  Inertia.js (Rails Adapter)                │
│  VIEW LAYER        │  React 18+                                 │
│  STYLING           │  TailwindCSS v4                            │
│  COMPONENTS        │  ShadCN UI (Radix Primitives)              │
│  ICONS             │  Lucide React                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Typography System

| Role | Font Family | Weights | Usage |
|------|-------------|---------|-------|
| **Display/Headlines** | Instrument Serif | 400 | Page titles, invoice numbers |
| **UI/Body** | Geist | 400, 500, 600, 700 | All interface text |
| **Monospace** | Geist Mono | 400, 500 | Numbers, data, invoice numbers |

**Typographic Scale:**
```
Invoice Hero:    text-6xl / text-8xl  │  font-mono   │  tracking-tighter
Page Title:      text-4xl             │  font-display│  leading-none
Section Heading: text-xl              │  font-sans   │  font-semibold
Body:            text-sm / text-base  │  font-sans   │  font-normal
Data/Numbers:    text-sm              │  font-mono   │  font-medium
```

### 3.3 Color System

**Base Palette:** Slate (neutral with subtle blue undertone)
**Accent:** Electric Blue — **used exclusively for primary actions**

| Status | Light Mode | Dark Mode | Border Style |
|--------|------------|-----------|--------------|
| **Draft** | `bg-slate-100 text-slate-600` | `bg-slate-800 text-slate-400` | `border-dashed` |
| **Pending** | `bg-amber-50 text-amber-700` | `bg-amber-950 text-amber-400` | Solid |
| **Paid** | `bg-emerald-50 text-emerald-700` | `bg-emerald-950 text-emerald-400` | Solid |
| **Overdue** | `bg-rose-50 text-rose-700` | `bg-rose-950 text-rose-400` | Solid |

### 3.4 Spacing & Layout Constants

```css
Container:     max-w-7xl (1280px)
Page Padding:  px-4 sm:px-6 lg:px-8

Gap Scale:
├── gap-1 (4px)   → Inline icon + text
├── gap-2 (8px)   → Form label to input
├── gap-4 (16px)  → Standard element spacing
└── gap-8 (32px)  → Major page sections
```

### 3.5 Responsive Breakpoint Strategy

| Breakpoint | Width | Prefix | Layout Behavior |
|------------|-------|--------|-----------------|
| **Mobile** | < 640px | default | Single column, Sheet nav, Card lists |
| **Tablet** | ≥ 640px | `sm:` | 2-column metrics, icon-only sidebar |
| **Desktop** | ≥ 1024px | `lg:` | Full sidebar (240px), data tables |
| **Wide** | ≥ 1280px | `xl:` | Max-width constraints apply |

**Key Responsive Patterns:**
```tsx
// Table → Card transformation
<div className="hidden md:block"><DataTable /></div>
<div className="md:hidden"><CardStack /></div>

// Grid progression
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### 3.6 Directory Architecture

```
app/frontend/
├── components/
│   ├── ui/               # ShadCN primitives (Button, Card, Input...)
│   ├── layout/           # AppShell, Sidebar, MobileNav, Logo, ThemeToggle
│   ├── dashboard/        # MetricCard, ActivityFeed
│   ├── clients/          # ClientTable, ClientForm, ClientAvatar
│   ├── invoices/         # InvoiceTable, LineItemEditor, StatusBadge
│   └── shared/           # PageHeader, StatusBadge
├── layouts/
│   ├── AppLayout.tsx     # Main authenticated layout
│   └── PublicLayout.tsx  # Shareable invoice layout (minimal)
├── lib/
│   ├── utils.ts          # cn(), formatCurrency(), formatDate()
│   ├── types.ts          # TypeScript interfaces
│   └── mock-data.ts      # Phase 1 stub data
├── pages/
│   ├── Dashboard.tsx
│   ├── Clients/Index.tsx
│   ├── Invoices/Index.tsx, New.tsx, Edit.tsx
│   └── PublicInvoice/Show.tsx
├── hooks/
│   └── useTheme.ts       # Theme management hook
└── entrypoints/
    └── inertia.tsx       # Inertia app initialization
```

### 3.7 Motion & Interaction Philosophy

> **"One well-orchestrated moment is better than scattered micro-interactions."**

| Interaction | Duration | Easing | Effect |
|-------------|----------|--------|--------|
| Button hover | 150ms | ease-in-out | Color shift only |
| Card hover | 150ms | ease-in-out | Border color change (no movement) |
| Modal open | 200ms | — | Fade + scale (0.95 → 1) |
| Dropdown open | 150ms | — | Fade + translate-y (-4px → 0) |
| List items | 50ms stagger | — | Opacity + y-translate per item |

### 3.8 Accessibility Requirements (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| **Contrast** | 4.5:1 minimum (text-slate-600 on bg-slate-50 passes) |
| **Keyboard** | Full tab navigation, Enter/Space activation, Esc to close |
| **Focus** | Visible focus rings on all interactive elements |
| **Screen Readers** | aria-label on icon buttons, sr-only text on status badges |
| **Labels** | All form inputs have associated labels with htmlFor |

### 3.9 Print Optimization

The `/i/:token` shareable invoice must print cleanly on A4:

```css
@media print {
  .no-print, nav, footer, button, .sidebar { display: none !important; }
  body { background: white !important; color: black !important; }
  .invoice-container { 
    box-shadow: none !important; 
    page-break-inside: avoid; 
  }
}
```

---

## 4. Implementation Roadmap Understanding

### 4.1 Phase 1 — 7-Day Sprint

| Day | Focus | Key Deliverables |
|-----|-------|------------------|
| **Day 1** | Environment & Shell | Rails 8 + Inertia + Tailwind v4, ShadCN init, AppLayout, Sidebar, MobileNav, ThemeToggle, Logo |
| **Day 2** | Dashboard | MetricCard, ActivityFeed, Dashboard grid with mock data |
| **Day 3** | Clients | ClientTable (desktop), ClientCard (mobile), ClientAvatar, "New Client" Sheet form |
| **Day 4** | Invoices List | FilterTabs, InvoiceTable, StatusBadge, Row Actions menu |
| **Day 5** | Invoice Editor | LineItemEditor, calculateTotals logic, InvoiceSummary, Sticky Footer, ClientSelector |
| **Day 6** | Public Invoice | PublicLayout, Print styles, PaymentModal mockup |
| **Day 7** | Polish & QA | Accessibility audit, dark mode verification, 375px viewport check |

### 4.2 Validation Checkpoints

| Checkpoint | Criteria |
|------------|----------|
| **CP1: Shell Complete** | Navigation works (SPA), theme persists, mobile Sheet functional |
| **CP2: Views Render** | All 5 routes load, mock data populates correctly |
| **CP3: Responsive Pass** | No horizontal scroll on mobile, tables → cards, sidebar collapses |
| **CP4: Accessibility Pass** | Focus rings visible, SR-only text present, aria-labels on icons |
| **CP5: Print Ready** | Invoice fits 1 page, buttons hidden, backgrounds adjusted |

---

## 5. Key Technical Patterns to Apply

### 5.1 Utility Functions (lib/utils.ts)

```typescript
// Class name merger (ShadCN standard)
cn(...inputs: ClassValue[]) → string

// Currency formatting (SGD)
formatCurrency(1234.56) → "S$1,234.56"

// Date formatting
formatDate("2025-01-20") → "20 Jan 2025"

// Invoice number generation
generateInvoiceNumber(2025, 1) → "2025-0001"

// Status calculation
calculateInvoiceStatus(invoice) → 'draft' | 'pending' | 'paid' | 'overdue'
```

### 5.2 Invoice Calculation Logic

```typescript
const calculateTotals = (lineItems: LineItem[]) => {
  const items = lineItems.filter(li => li.type === 'item');
  const discounts = lineItems.filter(li => li.type === 'discount');
  
  const subtotal = items.reduce((sum, item) => 
    sum + (item.quantity ?? 0) * (item.unitPrice ?? 0), 0);
  
  const totalDiscount = Math.abs(
    discounts.reduce((sum, d) => sum + (d.unitPrice ?? 0), 0));
  
  return { subtotal, totalDiscount, total: subtotal - totalDiscount };
};
```

### 5.3 Component Style Patterns

**Primary Button:**
```tsx
className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
```

**Card Container:**
```tsx
className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6"
```

---

## 6. Summary: My Understanding

### What I Now Know:

1. **Product**: InvoiceForge is a Swift, Confident, Trustworthy invoicing SPA for Singapore freelancers

2. **Design Language**: "Neo-Editorial Precision" — Swiss grid discipline meets editorial boldness

3. **Tech Stack**: Rails 8 + Inertia.js + React 18 + TailwindCSS v4 + ShadCN UI

4. **Views**: Dashboard, Clients, Invoices, Invoice Editor, Public Invoice (5 total)

5. **Data Model**: Clients → Invoices → LineItems (with section headers and discounts)

6. **Typography**: Instrument Serif (display) + Geist (UI) + Geist Mono (data)

7. **Color**: Slate base, Blue-500 accent (actions only), semantic status colors

8. **Responsive**: Mobile-first with table→card transformations

9. **Accessibility**: WCAG 2.1 AA, full keyboard nav, screen reader support

10. **Print**: A4-optimized public invoice with hidden UI elements

---

## Ready for Implementation

I have fully internalized the InvoiceForge requirements. I understand:
- The **business goals** (speed for admin, trust for clients)
- The **design philosophy** (Neo-Editorial Precision)
- The **technical constraints** (Rails 8, Inertia, React, Tailwind v4)
- The **implementation patterns** (components, utilities, styling)
- The **quality gates** (accessibility, responsiveness, print)

**What would you like to build first?**

I recommend starting with **Day 1: Environment & Shell** — establishing the Rails + Inertia + React foundation, configuring Tailwind v4 with the custom typography, and building the AppLayout with Sidebar, MobileNav, Logo, and ThemeToggle.

Shall I proceed with a detailed execution plan for Day 1?
