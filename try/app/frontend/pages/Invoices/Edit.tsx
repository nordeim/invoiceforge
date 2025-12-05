// app/frontend/pages/Invoices/Edit.tsx
import { useState, useMemo, useCallback, useEffect } from "react"
import { router, Link } from "@inertiajs/react"
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { 
  ClientSelector, 
  DatePicker, 
  LineItemEditor,
  InvoiceSummary 
} from "@/components/invoices"
import { mockClients, mockInvoices } from "@/lib/mock-data"
import { calculateInvoiceTotals } from "@/lib/invoice-calculations"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Save, Send, ExternalLink } from "lucide-react"
import type { LineItem, Invoice } from "@/lib/types"

interface EditInvoiceProps {
  id: string
}

/**
 * Edit Invoice Page — Edit existing invoice
 */
export default function InvoicesEdit({ id }: EditInvoiceProps) {
  // Find the invoice from mock data
  const invoice = mockInvoices.find(inv => inv.id === id)

  // Form state
  const [clientId, setClientId] = useState<string>(invoice?.clientId || '')
  const [issueDate, setIssueDate] = useState<Date>(
    invoice?.issueDate ? new Date(invoice.issueDate) : new Date()
  )
  const [dueDate, setDueDate] = useState<Date>(
    invoice?.dueDate ? new Date(invoice.dueDate) : new Date()
  )
  const [lineItems, setLineItems] = useState<LineItem[]>(invoice?.lineItems || [])
  const [notes, setNotes] = useState(invoice?.notes || '')
  const [isSaving, setIsSaving] = useState(false)

  // Calculate totals
  const totals = useMemo(() => calculateInvoiceTotals(lineItems), [lineItems])

  // Get selected client
  const selectedClient = mockClients.find(c => c.id === clientId)

  // Invoice status
  const status = invoice?.status || 'draft'
  const isDraft = status === 'draft'
  const canEdit = isDraft || status === 'pending'

  // Validation
  const isValid = clientId && lineItems.length > 0 && lineItems.some(li => li.type === 'item')

  // Handle save
  const handleSave = useCallback(() => {
    if (!isValid) {
      alert('Please select a client and add at least one item.')
      return
    }

    setIsSaving(true)
    console.log('Save Invoice:', {
      id,
      clientId,
      issueDate,
      dueDate,
      lineItems,
      notes,
    })
    
    setTimeout(() => {
      setIsSaving(false)
      alert('Invoice saved!')
      router.visit('/invoices')
    }, 500)
  }, [id, clientId, issueDate, dueDate, lineItems, notes, isValid])

  // Handle send
  const handleSend = useCallback(() => {
    if (!isValid) {
      alert('Please select a client and add at least one item.')
      return
    }

    setIsSaving(true)
    console.log('Send Invoice:', { id })
    
    setTimeout(() => {
      setIsSaving(false)
      alert(`Invoice sent to ${selectedClient?.email}!`)
      router.visit('/invoices')
    }, 500)
  }, [id, isValid, selectedClient])

  // Handle view public
  const handleViewPublic = useCallback(() => {
    window.open(`/i/${invoice?.token}`, '_blank')
  }, [invoice])

  if (!invoice) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-slate-500">Invoice not found</p>
          <Button className="mt-4" asChild>
            <Link href="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/invoices" aria-label="Back to invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-display text-2xl tracking-tight leading-none text-slate-900 dark:text-slate-50">
                  Edit Invoice
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  #{invoice.invoiceNumber}
                </p>
              </div>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {!isDraft && (
              <Button variant="outline" onClick={handleViewPublic}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public
              </Button>
            )}
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                {isDraft && (
                  <Button onClick={handleSend} disabled={isSaving}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto space-y-6 pb-24 sm:pb-8">
        {/* Client & Dates Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Client Selector */}
              <div className="md:col-span-1 space-y-2">
                <Label>Client</Label>
                <ClientSelector
                  clients={mockClients}
                  selectedClientId={clientId}
                  onSelect={setClientId}
                  placeholder="Select a client"
                  disabled={!canEdit}
                />
              </div>

              {/* Issue Date */}
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <DatePicker
                  date={issueDate}
                  onDateChange={(date) => date && setIssueDate(date)}
                  disabled={!canEdit}
                />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                <DatePicker
                  date={dueDate}
                  onDateChange={(date) => date && setDueDate(date)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items Card */}
        <Card>
          <CardContent className="pt-6">
            <LineItemEditor items={lineItems} onChange={setLineItems} />
          </CardContent>
        </Card>

        {/* Notes & Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Notes */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, thank you message, etc."
                rows={4}
                className="mt-2"
                disabled={!canEdit}
              />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Summary
              </h3>
              <InvoiceSummary totals={totals} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            <p className="font-mono text-xl font-bold text-slate-900 dark:text-slate-50">
              {formatCurrency(totals.total)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  Save
                </Button>
                {isDraft && (
                  <Button size="sm" onClick={handleSend} disabled={isSaving}>
                    Send
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
