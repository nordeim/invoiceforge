# Codebase Architecture & Implementation Plan

## Executive Summary
Based on user feedback, we will build a high-precision tool for a Singaporean SMB. The design will reflect "Swiss Utility"—minimal, grid-based, and highly legible.

**Key Adjustments from Feedback:**
*   **Currency:** All monetary values formatted as `SGD` (S$) with locale-aware formatting.
*   **Metrics:** Dashboard will prioritize **MRR (Monthly Recurring Revenue)** visualization alongside Invoiced Totals.
*   **Complexity:** Removal of Tax/VAT logic simplifies the `InvoiceTotal` calculation components.
*   **Client Data:** Added support for a "Notes" text area in the Client interfaces.

---

## 1. Architectural Blueprint

### Directory Structure Strategy
We will utilize a **Feature-First** organization within the standard Inertia/Rails structure. This prevents the "junk drawer" effect in the components folder.

```text
app/
├── controllers/              # Rails Controllers (Data Providers)
│   ├── dashboard_controller.rb
│   ├── clients_controller.rb
│   └── invoices_controller.rb
│
└── javascript/
    ├── entrypoints/
    │   └── application.jsx   # Inertia App Initialization
    │
    ├── layouts/
    │   ├── AppLayout.jsx     # Authenticated Shell (Sidebar, Nav)
    │   └── PublicLayout.jsx  # Customer View Shell (Minimal, Centered)
    │
    ├── lib/
    │   ├── utils.js          # cn(), currency formatter (SGD)
    │   └── constants.js      # Nav links, Status enums
    │
    ├── components/
    │   ├── ui/               # ShadCN Atoms (Button, Input, Card)
    │   └── shared/           # App-wide molecules (StatusBadge, EmptyState)
    │
    ├── features/             # Domain-specific logic
    │   ├── clients/
    │   │   ├── ClientForm.jsx
    │   │   └── ClientTable.jsx
    │   ├── invoices/
    │   │   ├── InvoiceLineItemEditor.jsx
    │   │   ├── InvoiceSummary.jsx
    │   │   └── PaymentModal.jsx
    │   └── dashboard/
    │       ├── MetricCard.jsx
    │       └── ActivityFeed.jsx
    │
    └── pages/                # Inertia Views (Route Targets)
        ├── Dashboard.jsx
        ├── Clients/
        │   └── Index.jsx
        ├── Invoices/
        │   ├── Index.jsx
        │   ├── New.jsx
        │   ├── Edit.jsx
        │   └── Show.jsx      # The Shareable View
        └── Error.jsx
```

### Aesthetic System ("The Swiss Utility")
*   **Font Stack:**
    *   *Headings:* `font-sans` (Inter Tight or Space Grotesk) - Tight tracking.
    *   *Body:* `font-serif` (Merriweather) - For Invoice letters/descriptions.
    *   *Data/Numbers:* `font-mono` (JetBrains Mono) - Tabular figures for pricing.
*   **Palette (Tailwind v4):**
    *   *Surface:* `bg-zinc-50` (Light) / `bg-zinc-950` (Dark).
    *   *Primary Action:* `text-orange-600` (International Orange).
    *   *Borders:* `border-zinc-200` (Light) / `border-zinc-800` (Dark).

---

## 2. Phased Implementation Plan

### Phase 1: Foundation & Shell
**Objective:** Establish the design system, layouts, and routing structure.
**Est. Effort:** Low complexity, High impact.

| File / Component | Description | Feature Checklist |
| :--- | :--- | :--- |
| `lib/utils.js` | Helper functions. | - [ ] `formatCurrency(amount)` (SGD)<br>- [ ] `cn()` (Class merger) |
| `components/ui/*` | Base ShadCN components. | - [ ] Button, Input, Card, Table, Badge, Dialog, DropdownMenu<br>- [ ] *Style Tweak:* Remove rounded corners (radius-0) for Swiss look. |
| `layouts/AppLayout.jsx` | Main Admin Wrapper. | - [ ] Sidebar Navigation (Dashboard, Clients, Invoices)<br>- [ ] Dark Mode Toggle<br>- [ ] Mobile Responsive Menu (Sheet) |
| `pages/Dashboard.jsx` | Placeholder View. | - [ ] Basic "Welcome" stub to verify routing. |

**Validation:**
*   Navigating between routes changes the URL without full page reload.
*   Dark mode toggle persists preference.

### Phase 2: Client Management (The Data Layer)
**Objective:** Allow creation and listing of the entities that receive invoices.
**Est. Effort:** Medium complexity.

| File / Component | Description | Feature Checklist |
| :--- | :--- | :--- |
| `features/clients/ClientTable.jsx` | Data grid for clients. | - [ ] Columns: Name, Notes (truncate), Total Billed<br>- [ ] Action: Edit/Delete buttons |
| `features/clients/ClientForm.jsx` | Create/Edit drawer. | - [ ] Fields: Name, Email, Notes (Textarea)<br>- [ ] Validation: Required Name/Email |
| `pages/Clients/Index.jsx` | Main Clients Page. | - [ ] Integrates Table + "New Client" Header Action |

**Validation:**
*   Can create a client with notes.
*   Client appears in the list immediately (Optimistic UI).

### Phase 3: Invoice Engine (The Core)
**Objective:** Build the complex editor and list views for invoicing.
**Est. Effort:** High complexity.

| File / Component | Description | Feature Checklist |
| :--- | :--- | :--- |
| `features/invoices/InvoiceLineItemEditor.jsx` | Dynamic row editor. | - [ ] Add/Remove rows<br>- [ ] Inputs: Description, Qty, Rate<br>- [ ] Auto-calc: `Qty * Rate` per row |
| `features/invoices/InvoiceSummary.jsx` | Bottom totals calculation. | - [ ] Sum of all rows<br>- [ ] No Tax logic (Simple Sum)<br>- [ ] Large Total Display (SGD) |
| `pages/Invoices/New.jsx` | Creation Page. | - [ ] Client Selector (Combobox)<br>- [ ] Date Pickers (Issue/Due)<br>- [ ] Status defaults to "Draft" |
| `pages/Invoices/Index.jsx` | List Page. | - [ ] Filter Tabs: All, Paid, Pending, Overdue<br>- [ ] Status Badges (Color coded) |

**Validation:**
*   Adding a line item updates the Total instantly.
*   Saving an invoice redirects to the Invoice List.

### Phase 4: Public View & Payment
**Objective:** The customer-facing experience.
**Est. Effort:** Medium complexity (Design heavy).

| File / Component | Description | Feature Checklist |
| :--- | :--- | :--- |
| `layouts/PublicLayout.jsx` | Distraction-free shell. | - [ ] Centered generic container<br>- [ ] No sidebar/admin nav |
| `features/invoices/PaymentModal.jsx` | Mock Payment UI. | - [ ] Card Input (Visual only)<br>- [ ] "Pay SGD [Amount]" Button<br>- [ ] Success State animation |
| `pages/Invoices/Show.jsx` | The Invoice Paper UI. | - [ ] "Paper" visual effect (Shadow-lg)<br>- [ ] Print CSS (`@media print`)<br>- [ ] Download PDF button (window.print) |

**Validation:**
*   Page looks perfect on mobile (responsive table).
*   "Pay Now" opens the modal.

### Phase 5: Dashboard & Intelligence
**Objective:** Visualize the MRR and activity.
**Est. Effort:** Medium complexity.

| File / Component | Description | Feature Checklist |
| :--- | :--- | :--- |
| `features/dashboard/MetricCard.jsx` | Reusable stat block. | - [ ] Props: Title, Value, Trend (up/down)<br>- [ ] Visual: Large Typography |
| `features/dashboard/ActivityFeed.jsx` | List of recent events. | - [ ] Icons for "Invoice Sent" vs "Client Added" |
| `pages/Dashboard.jsx` | Refined Dashboard. | - [ ] Calculate MRR (Avg of last 3 months)<br>- [ ] Show "Outstanding Debt" |

**Validation:**
*   Dashboard numbers match the data created in Phases 2 & 3.

---

## 3. Review & Validation Strategy

To ensure this implementation plan succeeds, you will perform the following checks at the end of each phase:

1.  **The "SGD" Check:** Verify every dollar sign is effectively an `S$` and formatting handles commas (e.g., `S$ 1,200.00`).
2.  **The Mobile Check:** Open Chrome DevTools in "iPhone SE" mode. Tables must scroll horizontally or stack; they cannot break the layout.
3.  **The "Swiss" Check:** Verify the design rigor. Are margins consistent? Is the font hierarchy clear? No soft shadows?
