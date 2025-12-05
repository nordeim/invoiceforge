// app/frontend/lib/mock-data.ts
import type { 
  Client, 
  Invoice, 
  DashboardMetrics, 
  RecentActivity 
} from './types'

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA — Phase 1 Stub Data
   Note: This data must match the PRD v4.2 specification exactly
   ═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

export const mockClients: Client[] = [
  {
    id: 'cli_001',
    name: 'Acme Corporation',
    email: 'billing@acme.corp',
    company: 'Acme Corporation Pte Ltd',
    address: '123 Business Park, #10-01, Singapore 123456',
    phone: '+65 6123 4567',
    notes: 'Net 30 payment terms preferred',
    totalBilled: 15750.00,
    lastInvoiceDate: '2025-01-15',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'cli_002',
    name: 'Startup Labs',
    email: 'finance@startuplabs.io',
    company: 'Startup Labs Pte Ltd',
    address: '456 Innovation Drive, Singapore 654321',
    phone: '+65 6987 6543',
    totalBilled: 8400.00,
    lastInvoiceDate: '2025-01-10',
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'cli_003',
    name: 'Global Ventures',
    email: 'accounts@globalventures.com',
    company: 'Global Ventures Holdings',
    address: '789 Commerce Tower, Singapore 789012',
    totalBilled: 32000.00,
    lastInvoiceDate: '2024-12-20',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────────────────────

export const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: '2025-0001',
    clientId: 'cli_001',
    client: mockClients[0],
    status: 'pending',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    token: 'abc123xyz',
    lineItems: [
      {
        id: 'li_001',
        invoiceId: 'inv_001',
        type: 'section',
        description: 'Development Services',
        position: 1,
      },
      {
        id: 'li_002',
        invoiceId: 'inv_001',
        type: 'item',
        description: 'Frontend Development - Dashboard Module',
        quantity: 24,
        unitType: 'hours',
        unitPrice: 150.00,
        position: 2,
        lineTotal: 3600.00,
      },
      {
        id: 'li_003',
        invoiceId: 'inv_001',
        type: 'item',
        description: 'API Integration',
        quantity: 16,
        unitType: 'hours',
        unitPrice: 150.00,
        position: 3,
        lineTotal: 2400.00,
      },
      {
        id: 'li_004',
        invoiceId: 'inv_001',
        type: 'section',
        description: 'Additional Services',
        position: 4,
      },
      {
        id: 'li_005',
        invoiceId: 'inv_001',
        type: 'item',
        description: 'Technical Consultation',
        quantity: 2,
        unitType: 'hours',
        unitPrice: 200.00,
        position: 5,
        lineTotal: 400.00,
      },
      {
        id: 'li_006',
        invoiceId: 'inv_001',
        type: 'discount',
        description: 'Loyalty Discount (5%)',
        quantity: 1,
        unitType: 'fixed',
        unitPrice: -320.00,
        position: 6,
        lineTotal: -320.00,
      },
    ],
    subtotal: 6400.00,
    totalDiscount: 320.00,
    total: 6080.00,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'inv_002',
    invoiceNumber: '2025-0002',
    clientId: 'cli_002',
    client: mockClients[1],
    status: 'draft',
    issueDate: '2025-01-20',
    dueDate: '2025-02-19',
    token: 'def456uvw',
    lineItems: [
      {
        id: 'li_007',
        invoiceId: 'inv_002',
        type: 'item',
        description: 'UI/UX Design - Mobile App',
        quantity: 3,
        unitType: 'days',
        unitPrice: 800.00,
        position: 1,
        lineTotal: 2400.00,
      },
    ],
    subtotal: 2400.00,
    totalDiscount: 0,
    total: 2400.00,
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-20T09:00:00Z',
  },
  {
    id: 'inv_003',
    invoiceNumber: '2024-0012',
    clientId: 'cli_003',
    client: mockClients[2],
    status: 'paid',
    issueDate: '2024-12-20',
    dueDate: '2025-01-19',
    token: 'ghi789rst',
    lineItems: [
      {
        id: 'li_008',
        invoiceId: 'inv_003',
        type: 'item',
        description: 'Annual Retainer - Q4 2024',
        quantity: 1,
        unitType: 'fixed',
        unitPrice: 8000.00,
        position: 1,
        lineTotal: 8000.00,
      },
    ],
    subtotal: 8000.00,
    totalDiscount: 0,
    total: 8000.00,
    createdAt: '2024-12-20T08:00:00Z',
    updatedAt: '2025-01-05T14:00:00Z',
  },
  {
    id: 'inv_004',
    invoiceNumber: '2024-0010',
    clientId: 'cli_001',
    client: mockClients[0],
    status: 'overdue',
    issueDate: '2024-11-15',
    dueDate: '2024-12-15',
    token: 'jkl012mno',
    lineItems: [
      {
        id: 'li_009',
        invoiceId: 'inv_004',
        type: 'item',
        description: 'Maintenance & Support - November',
        quantity: 10,
        unitType: 'hours',
        unitPrice: 120.00,
        position: 1,
        lineTotal: 1200.00,
      },
    ],
    subtotal: 1200.00,
    totalDiscount: 0,
    total: 1200.00,
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD METRICS
// ─────────────────────────────────────────────────────────────────────────────

export const mockDashboardMetrics: DashboardMetrics = {
  totalOutstanding: 7280.00,   // pending + overdue totals
  totalPaidThisMonth: 8000.00,
  totalPaidYTD: 56150.00,
  overdueAmount: 1200.00,
  overdueCount: 1,
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITY
// ─────────────────────────────────────────────────────────────────────────────

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'act_001',
    type: 'invoice_created',
    description: 'Invoice #2025-0002 created for Startup Labs',
    timestamp: '2025-01-20T09:00:00Z',
    relatedId: 'inv_002',
    relatedType: 'invoice',
  },
  {
    id: 'act_002',
    type: 'invoice_sent',
    description: 'Invoice #2025-0001 sent to Acme Corporation',
    timestamp: '2025-01-15T10:30:00Z',
    relatedId: 'inv_001',
    relatedType: 'invoice',
  },
  {
    id: 'act_003',
    type: 'invoice_paid',
    description: 'Invoice #2024-0012 paid by Global Ventures',
    timestamp: '2025-01-05T14:00:00Z',
    relatedId: 'inv_003',
    relatedType: 'invoice',
  },
  {
    id: 'act_004',
    type: 'client_created',
    description: 'New client added: Startup Labs',
    timestamp: '2024-09-15T11:00:00Z',
    relatedId: 'cli_002',
    relatedType: 'client',
  },
]
