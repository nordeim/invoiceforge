# 📄 Project Requirements Document
## InvoiceForge — Personal Invoicing Application
**Version:** 4.0.0 (Unified Master)
**Phase:** 1 — Frontend Design & Prototyping
**Status:** Final — Ready for Implementation
**Last Updated:** January 2025

---

## Table of Contents
1. Product Vision & Philosophy
2. Design System
3. Technical Architecture
4. Data Models
5. Application Shell
6. View Specifications
7. Component Library
8. Responsive Design
9. Accessibility Requirements
10. Theme System
11. Print Optimization
12. Implementation Roadmap
13. Quality Assurance & Validation
14. Appendices

---

## 1. Product Vision & Philosophy

### 1.1 Purpose Statement
InvoiceForge is a single-user invoicing application designed for freelancers and solo professionals who demand speed, clarity, and a polished client-facing presentation. The application prioritizes:
*   **Frictionless Workflow:** Rapid invoice creation with intelligent defaults.
*   **Professional Presentation:** Client-facing invoices that inspire trust and prompt payment.
*   **Data Clarity:** Dashboard and lists that surface financial insights at a glance.

### 1.2 Core Philosophy
**"Precision is the ultimate sophistication."**

Every pixel, interaction, and typographic choice serves a purpose. The interface must feel:
*   **Swift:** Inertia/React SPA architecture ensures instant navigation.
*   **Confident:** Bold typography and deliberate spacing project competence.
*   **Trustworthy:** Clean financial presentation that clients take seriously.

### 1.3 Design Manifesto: "Neo-Editorial Precision"
We merge Swiss International Style foundations with Neo-Editorial boldness:

| Swiss Foundation | Neo-Editorial Execution |
| :--- | :--- |
| Rigid grid systems | Asymmetric tension within the grid |
| Purposeful whitespace | Generous margins that breathe |
| Typographic hierarchy | Dramatic scale contrasts |
| Functional minimalism | Singular bold accent for focus |
| Data-forward layouts | Editorial typography treatments |

**The Unforgettable Element:** The invoice number treatment — oversized, typographically distinctive, positioned with editorial confidence. When clients see `2025-0001`, it's not just a reference — it's a statement.

### 1.4 Currency & Locale
*   **Primary Currency:** SGD (Singapore Dollar)
*   **Format:** S$1,234.56 with locale-aware thousand separators
*   **Decimal Precision:** 2 decimal places for all monetary values

### 1.5 Anti-Patterns (What We Avoid)
To maintain the "Neo-Editorial" aesthetic, strictly avoid the following:

| ❌ Avoid | ✅ Instead |
| :--- | :--- |
| Soft diffuse shadows (`shadow-lg`) | Sharp, shallow shadows (`shadow-sm`) or distinct borders |
| Rounded-everything (`rounded-xl`) | Precise corners (`rounded-md` or `rounded-lg` max) |
| Generic icons everywhere | Purposeful iconography with typographic alternatives |
| Gradient backgrounds | Solid, intentional color blocks (Slate/White) |
| Decorative illustrations | Data visualization and typography as decoration |
| System fonts (San Francisco/Segoe) | Distinctive pairing: Instrument Serif + Geist |

---

## 2. Design System

### 2.1 Typography
**Font Selection Rationale:**
We employ a distinctive serif + modern sans-serif pairing that balances editorial sophistication with technical precision.

| Role | Font Family | Weight Range | Rationale |
| :--- | :--- | :--- | :--- |
| **Display/Headlines** | Instrument Serif | 400 (Regular) | Elegant, modern serif with subtle contrast. Projects financial credibility. |
| **UI/Body** | Geist | 400-700 | Precision-crafted sans-serif. Excellent legibility at small sizes, technical character. |
| **Monospace** | Geist Mono | 400-500 | Tabular numerals for perfect financial alignment. |

**Tailwind v4 Configuration:**
```css
/* app/assets/stylesheets/application.css */
@import "tailwindcss";

@theme {
  --font-display: "Instrument Serif", Georgia, serif;
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}
```

### 2.2 Color System
**Base:** Slate (neutral with subtle blue undertone).
**Accent:** Electric Blue (exclusive for primary actions).

**CSS Variables (Tailwind v4):**
```css
@theme {
  /* Primary Action */
  --color-accent: var(--color-blue-500);
  --color-accent-hover: var(--color-blue-600);
  --color-accent-subtle: var(--color-blue-50);
  
  /* Status Colors */
  --color-status-draft: var(--color-slate-400);
  --color-status-pending: var(--color-amber-500);
  --color-status-paid: var(--color-emerald-500);
  --color-status-overdue: var(--color-rose-500);
}
```

**Status Badge Specifications:**
| Status | Light Mode | Dark Mode | Border Style |
| :--- | :--- | :--- | :--- |
| **Draft** | `bg-slate-100` `text-slate-600` | `bg-slate-800` `text-slate-400` | Dashed (`border-dashed`) |
| **Pending** | `bg-amber-50` `text-amber-700` | `bg-amber-950` `text-amber-400` | Solid |
| **Paid** | `bg-emerald-50` `text-emerald-700` | `bg-emerald-950` `text-emerald-400` | Solid |
| **Overdue** | `bg-rose-50` `text-rose-700` | `bg-rose-950` `text-rose-400` | Solid |

### 2.3 Spacing & Layout
*   **Container:** `max-w-7xl` (1280px) standard; `max-w-5xl` for focused views.
*   **Page Padding:** `px-4 sm:px-6 lg:px-8`
*   **Gap Scale:**
    *   `gap-1` (4px): Inline icon + text
    *   `gap-4` (16px): Standard element spacing
    *   `gap-8` (32px): Major page sections

### 2.4 Effects & Treatments
**Shadows (Brutalist Precision):**
Shallow, harsh shadows suggesting elevation without softness.
*   **Card:** `shadow-sm`
*   **Dropdown:** `shadow-md`
*   **Modal:** `shadow-lg`

**Border Radius:**
*   **Cards:** `rounded-lg` (Standard container)
*   **Buttons/Inputs:** `rounded-md` (Precision)
*   **Badges:** `rounded-full` (Pill shape)

### 2.5 Iconography
**Library:** Lucide React
**Standard Sizes:** 16px (`size-4`) for inline; 20px (`size-5`) for nav.
**Stroke Width:** 2px (Default); 1.5px (Large empty states).

### 2.6 Motion & Interactions
**Philosophy:** Restrained, purposeful motion. One well-orchestrated moment is better than scattered micro-interactions. Interactions should feel "snappy" rather than "floaty."

**Transition Defaults:**
```css
/* Standard transition for interactive elements */
transition-colors duration-200 ease-in-out
/* Page transitions (Inertia) */
transition-opacity duration-300
```

**Key Patterns:**
*   **Button Hover:** Immediate color shift (200ms).
*   **Dropdown/Modal:** Fast fade + subtle Y-axis translation (`-4px` -> `0`).
*   **Staggered List:** When loading lists (Invoices/Clients), items fade in sequentially (25ms stagger) to create a "waterfall" effect of data availability.

---

## 3. Technical Architecture

### 3.1 Stack Overview
*   **Backend:** Ruby on Rails 8.x
*   **Frontend Adapter:** Inertia.js (Rails Adapter)
*   **View Layer:** React 18+
*   **Styling:** TailwindCSS v4
*   **Components:** ShadCN UI (Radix Primitives)
*   **Icons:** Lucide React

### 3.2 Directory Structure
```text
app/
├── controllers/
│   ├── dashboard_controller.rb
│   ├── clients_controller.rb
│   ├── invoices_controller.rb
│   └── public_invoices_controller.rb
├── frontend/
│   ├── components/
│   │   ├── ui/               # ShadCN components
│   │   ├── layout/           # Shell, Nav, Footer
│   │   ├── dashboard/        # Dashboard-specific
│   │   ├── clients/          # Client-specific
│   │   ├── invoices/         # Invoice-specific
│   │   └── shared/           # Reusable
│   ├── layouts/
│   │   ├── AppLayout.tsx     # Main authenticated layout
│   │   └── PublicLayout.tsx  # Shareable invoice layout
│   ├── lib/
│   │   ├── utils.ts          # cn(), formatters
│   │   └── mock-data.ts      # Phase 1 stub data
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Clients/Index.tsx
│   │   ├── Invoices/Index.tsx
│   │   ├── Invoices/New.tsx
│   │   └── PublicInvoice/Show.tsx
│   └── entrypoints/
│       └── inertia.tsx
└── assets/stylesheets/application.css
```

### 3.3 Routing Configuration
**Rails Routes (`config/routes.rb`):**
*   `root "dashboard#index"`
*   `resources :clients`
*   `resources :invoices` (with member actions: `send`, `mark_paid`)
*   `get "i/:token", to: "public_invoices#show"` (Public route)

---

## 4. Data Models

### 4.1 TypeScript Interfaces (`types.ts`)

```typescript
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';
export type LineItemType = 'item' | 'section' | 'discount';
export type UnitType = 'hours' | 'days' | 'items' | 'units' | 'fixed';

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  address?: string;
  totalBilled?: number; // Computed
  lastInvoiceDate?: string; // Computed
}

export interface LineItem {
  id: string;
  type: LineItemType;
  description: string;
  quantity?: number;
  unitType?: UnitType;
  unitPrice?: number;
  position: number;
  lineTotal?: number; // Computed
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // "2025-0001"
  clientId: string;
  client?: Client;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal?: number; // Computed
  total?: number; // Computed
  token: string; // Public UUID
}
```

### 4.2 Entity Relationships
*   **Client** `1:N` **Invoice**
*   **Invoice** `1:N` **LineItem**

---

## 5. Application Shell

### 5.1 Layout Architecture
**Desktop:** Fixed Sidebar (240px).
**Mobile:** Header with Hamburger Menu -> Slide-out Sheet.

### 5.2 Navigation
| Label | Icon | Route | Active State |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `LayoutDashboard` | `/dashboard` | `bg-slate-100` `text-blue-600` |
| **Clients** | `Users` | `/clients` | `bg-slate-100` `text-blue-600` |
| **Invoices** | `FileText` | `/invoices` | `bg-slate-100` `text-blue-600` |

### 5.3 Branding (Logo)
**Concept:** Typographic mark using the font pairing.
**Visual:** "INV" (Instrument Serif) + Horizontal Rule + "FORGE" (Geist Mono).

---

## 6. View Specifications

### 6.1 Dashboard (`/dashboard`)
**Purpose:** High-level pulse check.
*   **Header:** Title (Instrument Serif) + Date + "New Invoice" CTA.
*   **Metrics Grid:**
    *   **Outstanding:** Amount + Count.
    *   **Paid (Month/YTD):** Amount + Trend.
    *   **Overdue:** Amount (Red highlight) + Count.
*   **Activity Feed:** Vertical timeline of recent actions (Invoice Created, Sent, Paid).

### 6.2 Clients List (`/clients`)
**Purpose:** Directory and billing history.
*   **Layout:** Data Table (Desktop) / Cards (Mobile).
*   **Columns:** Avatar (Initials), Name/Company, Total Billed, Last Invoice, Actions.
*   **Avatar Logic:** Deterministic background color based on client name hash.

### 6.3 Invoices List (`/invoices`)
**Purpose:** Billing command center.
*   **Filters:** Tabs (All, Draft, Pending, Paid, Overdue) with count badges.
*   **Table:** Invoice #, Client, Amount, Due Date, Status Badge, Actions.
*   **Row Actions:**
    *   *Edit* (All)
    *   *Send* (Draft only)
    *   *Mark Paid* (Pending/Overdue)
    *   *View Public* (Non-draft)

### 6.4 Invoice Editor (`/invoices/new`)
**Purpose:** High-speed creation.
*   **Logic:** Real-time subtotal/total calculation on frontend.
*   **Line Items:**
    *   **Type Selector:** Item, Section Header, Discount.
    *   **Section Header:** Full width, bold, gray background.
    *   **Discount:** Negative value, red text.
*   **Sticky Footer:** "Save Draft" vs "Save & Send" actions.

### 6.5 Shareable Invoice (`/i/:token`)
**Purpose:** The client product.
*   **Layout:** Minimal, focused, print-optimized.
*   **Hero:** Invoice Number in huge `font-mono`.
*   **Actions:** "Pay Now" (primary), "Print/Download".
*   **Payment Modal:** Mockup of Credit Card form (Stripe-like UI) with mobile responsiveness.

---

## 7. Component Library

### 7.1 ShadCN Installation
**Required:** Button, Input, Card, Sheet, Table, DropdownMenu, Dialog, Select, Badge, Avatar, Separator, Tabs, Calendar, Popover.

### 7.2 Custom Components
*   `ClientAvatar.tsx`: Initials generation + color logic.
*   `StatusBadge.tsx`: Maps `InvoiceStatus` to design tokens.
*   `LineItemEditor.tsx`: Complex row component with internal state for math.
*   `ThemeToggle.tsx`: Animated Sun/Moon switch.

---

## 8. Responsive Design

### 8.1 Breakpoints
*   **Mobile (<640px):** Single column, Sheet navigation, Card-based lists.
*   **Tablet (640px-1024px):** 2-column metrics, collapsed sidebar (optional).
*   **Desktop (>1024px):** Full tables, fixed sidebar.

### 8.2 Strategy
*   **Mobile First:** Use `grid-cols-1` by default, expanding to `md:grid-cols-2`, `lg:grid-cols-4`.
*   **Table Transformation:** On mobile, hide `Table` component and show a stack of `Card` components iterating over the same data.

---

## 9. Accessibility Requirements

### 9.1 Standards (WCAG 2.1 AA)
*   **Contrast:** Ensure text meets 4.5:1 ratio (Slate-600+ on Slate-50/100).
*   **Focus Visible:** All interactive elements must have `focus:ring-2 focus:ring-blue-500`.
*   **Keyboard Nav:** Full tab navigability for forms and menus.

### 9.2 Implementation Checklist
*   **Forms:** All inputs must have associated `<Label>` or `aria-label`.
*   **Icons:** Interactive icons (e.g., "Delete") must have `aria-label="Delete invoice"`.
*   **Status Badges:** Include screen-reader only text if color conveys meaning.
    ```tsx
    <Badge variant="overdue">
      Overdue <span className="sr-only">Payment is past due date</span>
    </Badge>
    ```
*   **Semantic HTML:** Use `<main>`, `<nav>`, `<header>`, `<table>` appropriately.

---

## 10. Theme System

**Implementation:** Class-based (`.dark`) on `<html>` tag.
**Hook:** `useTheme` reads/writes to `localStorage` and `matchMedia`.
**Behavior:** Instant toggle, no flash of wrong theme (FOUC).

---

## 11. Print Optimization

**Strategy:** Specific CSS for the Shareable Invoice view.
**Styles:**
```css
@media print {
  /* Hide UI elements */
  .no-print, button, nav, footer { display: none !important; }
  /* Reset layout */
  body { background: white; color: black; }
  .invoice-container { box-shadow: none; border: 1px solid #ccc; width: 100%; }
  /* Typography */
  h1, h2 { color: black !important; }
}
```
**Tailwind Classes:** Use `print:hidden`, `print:block`, `print:text-black`.

---

## 12. Implementation Roadmap

### Phase 1: Frontend Design (7-Day Sprint)

*   **Day 1: Foundation**
    *   Setup Rails 8 + Inertia + Tailwind v4.
    *   Install ShadCN & Lucide.
    *   Build `AppShell` (Sidebar/MobileNav).
    *   Implement `ThemeToggle`.

*   **Day 2: Dashboard**
    *   Create `MetricCard` & `ActivityFeed`.
    *   Build responsive Grid layout.

*   **Day 3: Clients**
    *   Build `ClientTable` (Desktop) & `ClientCard` (Mobile).
    *   Implement `NewClient` Sheet form.

*   **Day 4: Invoices List**
    *   Implement `FilterTabs` & `StatusBadge`.
    *   Build `InvoiceTable` with Row Actions dropdown.

*   **Day 5: Invoice Editor (Logic Core)**
    *   Build `LineItemEditor` with math logic.
    *   Implement `TotalsDisplay`.
    *   Create sticky footer actions.

*   **Day 6: Public View**
    *   Build `PublicInvoice` layout (Print optimized).
    *   Create `PaymentModal` mockup.

*   **Day 7: Polish & QA**
    *   Execute Accessibility Audit.
    *   Verify Dark Mode across all views.
    *   Finalize Animations.

---

## 13. Quality Assurance & Validation

### 13.1 Validation Checkpoints (Exit Gates)
These gates must be passed to consider a feature "Complete".

*   **CP1: Shell Complete**
    *   [ ] Navigation routes work without page reload (SPA).
    *   [ ] Theme toggle persists on refresh.
    *   [ ] Mobile menu opens/closes smoothly.
*   **CP2: Views Render**
    *   [ ] All 5 core pages load with mock data.
    *   [ ] No console errors on initial load.
*   **CP3: Responsive Pass**
    *   [ ] No horizontal scrolling on Mobile (375px).
    *   [ ] Tables transform to cards on Mobile.
*   **CP4: Accessibility Pass**
    *   [ ] Keyboard focus ring visible on all inputs/buttons.
    *   [ ] Screen reader announces status changes.
*   **CP5: Print Ready**
    *   [ ] "Pay Now" button hidden in Print Preview.
    *   [ ] Invoice fits on single A4 page.

### 13.2 Visual QA
*   **Typography:** Confirm Instrument Serif loads for headers.
*   **Colors:** Verify "Electric Blue" usage is limited to primary actions.
*   **Dark Mode:** Ensure no "dark text on dark background" issues.

---

## 14. Appendices

### A. Mock Data Imports
Located in `app/frontend/lib/mock-data.ts`. Includes:
*   `mockClients` (3 records)
*   `mockInvoices` (4 records: Draft, Pending, Paid, Overdue)
*   `mockMetrics` (Aggregated totals)

### B. Command Reference
```bash
# Start Dev Server
bin/dev

# Add ShadCN Component
npx shadcn@latest add [component-name]
```
