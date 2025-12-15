// app/frontend/pages/Invoices/Index.tsx
import { useState, useMemo, useCallback } from "react"
import { router } from "@inertiajs/react"
import { AppLayout } from "@/layouts/AppLayout"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import {
  InvoiceFilterTabs,
  InvoiceList,
  type FilterValue
} from "@/components/invoices"
import { mockInvoices } from "@/lib/mock-data"
import { Plus } from "lucide-react"
import type { Invoice } from "@/lib/types"

interface InvoicesIndexProps {
  /** Invoices from backend (optional - falls back to mock) */
  invoices?: Invoice[]
}

/**
 * Invoices Page — Command center for all invoices
 * 
 * Features:
 * - PageHeader with count and "New Invoice" button
 * - Filter tabs by status
 * - Responsive table (desktop) / cards (mobile)
 * - Contextual row actions
 */
export default function InvoicesIndex({ invoices: propsInvoices }: InvoicesIndexProps) {
  // Use props if provided, otherwise fall back to mock data
  const allInvoices = propsInvoices || mockInvoices

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  // Filter invoices based on active filter
  const filteredInvoices = useMemo(() => {
    if (activeFilter === 'all') {
      return allInvoices
    }
    return allInvoices.filter(invoice => invoice.status === activeFilter)
  }, [activeFilter, allInvoices])

  // Sort by most recent first
  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort(
      (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    )
  }, [filteredInvoices])

  // ─────────────────────────────────────────────────────────────────────────
  // Action Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleEdit = useCallback((invoice: Invoice) => {
    // Navigate to invoice editor
    router.visit(`/invoices/${invoice.id}/edit`)
  }, [])

  const handleView = useCallback((invoice: Invoice) => {
    // Open public invoice in new tab
    window.open(`/i/${invoice.token}`, '_blank')
  }, [])

  const handleSend = useCallback((invoice: Invoice) => {
    // In a real app, this would call an API to send the invoice
    console.log('Send invoice:', invoice.invoiceNumber)
    alert(`Invoice ${invoice.invoiceNumber} would be sent to ${invoice.client?.email}`)
    // After sending, status would change to 'pending'
  }, [])

  const handleMarkPaid = useCallback((invoice: Invoice) => {
    // In a real app, this would call an API to mark as paid
    console.log('Mark paid:', invoice.invoiceNumber)
    alert(`Invoice ${invoice.invoiceNumber} marked as paid`)
    // After marking paid, status would change to 'paid'
  }, [])

  const handleDelete = useCallback((invoice: Invoice) => {
    // In a real app, this would show a confirmation dialog then call API
    console.log('Delete invoice:', invoice.invoiceNumber)
    const confirmed = window.confirm(
      `Delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`
    )
    if (confirmed) {
      console.log('Confirmed delete')
      // Would refresh the list after deletion
    }
  }, [])

  const handleCopyLink = useCallback((invoice: Invoice) => {
    const url = `${window.location.origin}/i/${invoice.token}`
    navigator.clipboard.writeText(url).then(() => {
      alert('Invoice link copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      prompt('Copy this link:', url)
    })
  }, [])

  const handleNewInvoice = useCallback(() => {
    router.visit('/invoices/new')
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      {/* Page Header */}
      <PageHeader
        title="Invoices"
        subtitle={`${allInvoices.length} total invoice${allInvoices.length !== 1 ? 's' : ''}`}
        actions={
          <Button onClick={handleNewInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-6">
        <InvoiceFilterTabs
          invoices={allInvoices}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Invoice List (responsive table/cards) */}
      <InvoiceList
        invoices={sortedInvoices}
        isFiltered={activeFilter !== 'all'}
        onEdit={handleEdit}
        onView={handleView}
        onSend={handleSend}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDelete}
        onCopyLink={handleCopyLink}
      />

      {/* Filter Result Count */}
      {activeFilter !== 'all' && filteredInvoices.length > 0 && (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredInvoices.length} of {allInvoices.length} invoices
        </p>
      )}
    </AppLayout>
  )
}
