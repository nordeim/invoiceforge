// app/frontend/components/public-invoice/PublicInvoiceHeader.tsx
import { Logo } from "@/components/layout/Logo"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate } from "@/lib/utils"
import type { Invoice, Client } from "@/lib/types"

interface PublicInvoiceHeaderProps {
  invoice: Invoice
  client: Client
}

/**
 * PublicInvoiceHeader — Header section of public invoice
 * 
 * Layout:
 * - Left: Business logo and details
 * - Right: INVOICE title and number
 */
export function PublicInvoiceHeader({ invoice, client }: PublicInvoiceHeaderProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 pb-8 mb-8 print:border-slate-300">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
        {/* Left: Business Info */}
        <div>
          <Logo />
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
            <p className="font-medium text-slate-900 dark:text-slate-50 print:text-black">
              Your Business Name
            </p>
            <p>123 Business Street</p>
            <p>Singapore 123456</p>
            <p>contact@yourbusiness.com</p>
          </div>
        </div>

        {/* Right: Invoice Info */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-3 mb-2">
            <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-slate-50 print:text-black">
              INVOICE
            </h1>
            <StatusBadge status={invoice.status} className="no-print" />
          </div>
          
          {/* Invoice Number — The Hero Element */}
          <p className="font-mono text-4xl sm:text-5xl tracking-tighter font-medium text-slate-900 dark:text-slate-50 print:text-black">
            #{invoice.invoiceNumber}
          </p>

          {/* Dates */}
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700 space-y-1">
            <p>
              <span className="text-slate-500 dark:text-slate-500">Issue Date: </span>
              <span className="font-medium">{formatDate(invoice.issueDate)}</span>
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-500">Due Date: </span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 print:border-slate-300">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Bill To
        </p>
        <div className="text-sm text-slate-900 dark:text-slate-50 print:text-black">
          <p className="font-semibold">{client.name}</p>
          {client.company && <p>{client.company}</p>}
          {client.address && <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">{client.address}</p>}
          <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">{client.email}</p>
        </div>
      </div>
    </div>
  )
}
