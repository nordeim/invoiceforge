// app/frontend/components/invoices/InvoiceSummary.tsx
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface InvoiceSummaryProps {
  subtotal: number
  totalDiscount: number
  total: number
  className?: string
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
