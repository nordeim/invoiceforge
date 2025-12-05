// app/frontend/lib/types.ts

/* ═══════════════════════════════════════════════════════════════════════════
   INVOICEFORGE TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS / UNION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue'
export type LineItemType = 'item' | 'section' | 'discount'
export type UnitType = 'hours' | 'days' | 'items' | 'units' | 'fixed'
export type ActivityType = 'invoice_created' | 'invoice_sent' | 'invoice_paid' | 'client_created'

// ─────────────────────────────────────────────────────────────────────────────
// ENTITIES
// ─────────────────────────────────────────────────────────────────────────────

export interface Client {
  id: string
  name: string
  email: string
  company?: string
  address?: string
  phone?: string
  notes?: string
  createdAt: string
  updatedAt: string
  // Computed (for list views)
  totalBilled?: number
  lastInvoiceDate?: string
}

export interface LineItem {
  id: string
  invoiceId: string
  type: LineItemType
  description: string
  quantity?: number       // null for section headers
  unitType?: UnitType     // null for section headers
  unitPrice?: number      // Negative for discounts
  position: number
  // Computed
  lineTotal?: number
}

export interface Invoice {
  id: string
  invoiceNumber: string   // Format: "2025-0001"
  clientId: string
  client?: Client         // Expanded relation
  status: InvoiceStatus
  issueDate: string       // ISO date string
  dueDate: string         // ISO date string
  notes?: string
  lineItems: LineItem[]
  token: string           // For public URL
  createdAt: string
  updatedAt: string
  // Computed
  subtotal?: number
  totalDiscount?: number
  total?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalOutstanding: number
  totalPaidThisMonth: number
  totalPaidYTD: number
  overdueAmount: number
  overdueCount: number
}

export interface RecentActivity {
  id: string
  type: ActivityType
  description: string
  timestamp: string
  relatedId?: string
  relatedType?: 'invoice' | 'client'
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}
