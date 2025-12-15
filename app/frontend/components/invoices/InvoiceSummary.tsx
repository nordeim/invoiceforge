// app/frontend/components/invoices/InvoiceSummary.tsx
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import type { LineItem } from "@/lib/types"

interface InvoiceSummaryProps {
  subtotal: number
  totalDiscount: number
  total: number
  className?: string
}

/**
 * Calculates invoice totals from line items
 * Exported for use by PublicInvoiceTotals
 */
export function calculateTotals(lineItems: LineItem[]): {
  subtotal: number
  totalDiscount: number
  total: number
} {
  const subtotal = lineItems
    .filter((item) => item.type === "item")
    .reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0)

  const totalDiscount = lineItems
    .filter((item) => item.type === "discount")
    .reduce((sum, item) => sum + Math.abs(item.unitPrice || 0), 0)

  const total = subtotal - totalDiscount

  return { subtotal, totalDiscount, total }
}

/**
 * InvoiceSummary — Displays invoice totals
 * 
 * Layout (v4.2):
 * - Right-aligned values
 * - Subtotal, Discount (if any), Total
 * - Total is prominent with larger font
 */
export function InvoiceSummary({
  subtotal,
  totalDiscount,
  total,
  className,
}: InvoiceSummaryProps) {
  return (
    <div className={cn("flex justify-end", className)}>
      <div className="w-full max-w-xs space-y-2">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
          <span className="font-mono font-medium text-slate-900 dark:text-slate-50">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Discount (only show if there is one) */}
        {totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Discount</span>
            <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
              -{formatCurrency(totalDiscount)}
            </span>
          </div>
        )}

        <Separator className="my-2" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Total
          </span>
          <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * InvoiceSummaryCompact — Compact version for table rows
 */
export function InvoiceSummaryCompact({
  subtotal,
  totalDiscount,
  total,
  className,
}: InvoiceSummaryProps) {
  return (
    <div className={cn("text-right", className)}>
      <div className="text-sm text-slate-500">
        Subtotal: {formatCurrency(subtotal)}
        {totalDiscount > 0 && ` • Discount: -${formatCurrency(totalDiscount)}`}
      </div>
      <div className="font-mono font-semibold text-slate-900 dark:text-slate-50">
        {formatCurrency(total)}
      </div>
    </div>
  )
}

