# AGENT BRIEFING: InvoiceForge (Phase 1)

**Date:** 2025-12-08
**Status:** Phase 1 (Frontend Design & Prototyping) - Days 1-8 Complete ✅
**Stack:** Rails 8 + Inertia.js + React 18 + TailwindCSS v4

## 1. Executive Summary
InvoiceForge is a single-user invoicing application prioritizing "Neo-Editorial Precision". The project has completed **Phase 1**, achieving a pixel-perfect, static frontend with mock data.

**Current State**:
- **Shell/Layouts**: ✅ Complete (Sidebar, MobileNav, ThemeToggle, PublicLayout).
- **Dashboard**: ✅ Complete (Metrics, ActivityFeed, RecentInvoices).
- **Clients**: ✅ Complete (Index, Table/Cards, Sheet Form, Avatar).
- **Invoices List**: ✅ Complete (Index, FilterTabs, StatusBadge, RowActions).
- **Invoice Editor**: ✅ Complete (New.tsx, Edit.tsx, LineItemsEditor, ClientSelector, DatePicker, InvoiceSummary).
- **Public Invoice**: ✅ Complete (Show.tsx, Header, LineItems, Totals, BilledTo, Notes, PaymentModal).
- **Accessibility**: ✅ Complete (SkipLink, VisuallyHidden, LiveRegion, StatusBadge with sr-only).
- **Backend Controllers**: Full CRUD routes for invoices, public invoice view.

## 2. Technical Architecture & Standards

### Design System ("Neo-Editorial Precision")
**Strict Adherence Required**:
*   **Typography**: `font-display` (Instrument Serif), `font-sans` (Geist), `font-mono` (Geist Mono).
*   **Tension**: Use `tracking-tight` on all headers.
*   **Shadows**: Use `shadow-brutal` (Hard 4px offset) for popovers/dropdowns. Use `shadow-sm` for cards.
*   **Colors**: `bg-slate-50` (Canvas) vs `bg-white` (Card).

### Code Patterns
*   **Frontend**: Inertia.js pages in `app/frontend/pages`. Components in `app/frontend/components`.
*   **Styling**: Tailwind v4. Configuration is in `app/assets/stylesheets/application.css` via `@theme`.
*   **Data**: Currently uses `app/frontend/lib/mock-data.ts`. All frontend pages fall back to this if props are missing.
*   **Icons**: `lucide-react`.
*   **Accessibility**: Use components from `shared/` for skip links, announcements, and sr-only text.

## 3. Detailed Component Status

| Feature | Component/File | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Shell** | `AppLayout` | ✅ Done | Correct "well" background structure. |
| | `Sidebar` / `MobileNav` | ✅ Done | Responsive logic works. |
| | `ThemeToggle` | ✅ Done | Light/dark with persistence. |
| | `PublicLayout` | ✅ Done | Minimal layout for public pages. |
| **Dashboard** | `MetricCard`, `ActivityFeed`, `RecentInvoices` | ✅ Done | |
| | `Dashboard.tsx` | ✅ Done | Fully implemented. |
| **Clients** | `ClientTable`, `ClientCard`, `ClientAvatar` | ✅ Done | Responsive switch. |
| | `ClientForm` | ✅ Done | Sheet-based form. |
| **Invoices** | `Invoices/Index.tsx` | ✅ Done | Filters, Table/Cards. |
| | `Invoices/New.tsx` | ✅ Done | Full invoice creation form. |
| | `Invoices/Edit.tsx` | ✅ Done | Status-aware editing. |
| | `LineItemsEditor` | ✅ Done | Items, sections, discounts. |
| | `ClientSelector`, `DatePicker` | ✅ Done | |
| | `InvoiceSummary` | ✅ Done | Real-time totals. |
| **Public Invoice** | `PublicInvoice/Show.tsx` | ✅ Done | Client-facing view. |
| | `PublicInvoiceHeader`, `BilledTo`, `LineItems`, `Totals`, `Notes` | ✅ Done | Modular components. |
| | `PaymentModal` | ✅ Done | Mock Stripe payment. |
| | `Errors/NotFound.tsx` | ✅ Done | 404 page. |
| **Accessibility** | `SkipLink`, `VisuallyHidden`, `LiveRegion` | ✅ Done | WCAG AA support. |
| **Dev Tools** | `AccessibilityChecklist`, `FontLoadingStatus` | ✅ Done | Development debugging. |

## 4. Key Files Reference

*   **Design Tokens**: `app/assets/stylesheets/application.css`
*   **Mock Data**: `app/frontend/lib/mock-data.ts`
*   **Type Definitions**: `app/frontend/lib/types.ts`
*   **Invoice Utilities**: `app/frontend/lib/invoice-utils.ts`
*   **Accessibility Utilities**: `app/frontend/lib/accessibility-utils.ts`
*   **Controllers**: `app/controllers/invoices_controller.rb`, `app/controllers/public_invoices_controller.rb`
*   **Routes**: `config/routes.rb` (full CRUD + custom actions)

## 5. Next Steps (Phase 2)

Phase 1 is complete. Phase 2 will focus on:
1. **Backend Integration**: Replace mock data with PostgreSQL/SQLite.
2. **User Authentication**: Session-based auth with Devise or custom.
3. **Real Payment Integration**: Stripe Elements.
4. **PDF Generation**: Invoice exports.
5. **Email Notifications**: Send invoices via Action Mailer.
