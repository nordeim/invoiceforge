// app/frontend/pages/Invoices/New.tsx
import { useState, useMemo, useCallback } from "react"
import { router, Link } from "@inertiajs/react"
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ClientSelector, 
  DatePicker, 
  LineItemsEditor, 
  InvoiceSummary 
} from "@/components/invoices"
import { mockClients } from "@/lib/mock-data"
import { generateInvoiceNumber, formatCurrency } from "@/lib/utils"
import { calculateTotals, createBlankItem } from "@/lib/invoice-utils"
import { ArrowLeft, Save, Send } from "lucide-react"
import type { LineItem } from "@/lib/types"

/**
 * New Invoice Page — Full invoice editor
 * 
 * Layout (v4.2):
 * - Sticky header with back button and actions
 * - Client selector + date pickers
 * - Line items editor
 * - Invoice summary (right-aligned)
 * - Sticky footer on mobile
 */
export default function InvoicesNew() {
  // Generate invoice number
  const invoiceNumber = useMemo(() => {
    const year = new Date().getFullYear()
    const sequence = 3 // Would come from backend in real app
    return generateInvoiceNumber(year, sequence)
  }, [])

  // Form state
  const [clientId, setClientId] = useState<string | null>(null)
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30) // Default to 30 days from now
    return date
  })
  const [lineItems, setLineItems] = useState<LineItem[]>([
    createBlankItem(1, ''),
  ])

  // Calculate totals
  const totals = useMemo(() => calculateTotals(lineItems), [lineItems])

  // Find selected client
  const selectedClient = clientId ? mockClients.find(c => c.id === clientId) : null

  // Handle save
  const handleSave = useCallback((send: boolean = false) => {
    const invoiceData = {
      invoiceNumber,
      clientId,
      issueDate: issueDate?.toISOString(),
      dueDate: dueDate?.toISOString(),
      lineItems,
      ...totals,
      status: send ? 'pending' : 'draft',
    }
    
    console.log('Saving invoice:', invoiceData)
    
    // In real app, would POST to server
    alert(`Invoice ${invoiceNumber} ${send ? 'sent' : 'saved as draft'}!`)
    
    // Navigate back to invoices list
    router.visit('/invoices')
  }, [invoiceNumber, clientId, issueDate, dueDate, lineItems, totals])

  const handleSaveDraft = () => handleSave(false)
  const handleSaveAndSend = () => handleSave(true)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/invoices" aria-label="Back to invoices">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-display text-xl tracking-tight text-slate-900 dark:text-slate-50">
                  New Invoice
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  #{invoiceNumber}
                </p>
              </div>
            </div>

            {/* Right: Actions (hidden on mobile, shown in footer) */}
            <div className="hidden sm:flex items-center gap-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSaveAndSend}>
                <Send className="h-4 w-4 mr-2" />
                Save & Send
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
          {/* Client & Dates Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Client Selector */}
              <div className="sm:col-span-1">
                <Label htmlFor="client" className="mb-2 block">
                  Client <span className="text-rose-500">*</span>
                </Label>
                <ClientSelector
                  clients={mockClients}
                  selectedClientId={clientId}
                  onSelect={setClientId}
                  placeholder="Select client..."
                />
              </div>

              {/* Issue Date */}
              <div>
                <Label htmlFor="issueDate" className="mb-2 block">
                  Issue Date
                </Label>
                <DatePicker
                  date={issueDate}
                  onSelect={setIssueDate}
                  placeholder="Select date"
                />
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor="dueDate" className="mb-2 block">
                  Due Date
                </Label>
                <DatePicker
                  date={dueDate}
                  onSelect={setDueDate}
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <LineItemsEditor
              lineItems={lineItems}
              onChange={setLineItems}
            />
          </div>

          {/* Summary Section */}
          <div className="p-6">
            <InvoiceSummary
              subtotal={totals.subtotal}
              totalDiscount={totals.totalDiscount}
              total={totals.total}
            />
          </div>
        </div>
      </main>

      {/* Sticky Footer (Mobile) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            <p className="font-mono text-lg font-bold text-slate-900 dark:text-slate-50">
              {formatCurrency(totals.total)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button size="sm" onClick={handleSaveAndSend}>
              Save & Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
