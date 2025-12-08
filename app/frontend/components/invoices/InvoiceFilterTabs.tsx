// app/frontend/components/invoices/InvoiceFilterTabs.tsx
import { cn } from "@/lib/utils"
import type { InvoiceStatus, Invoice } from "@/lib/types"

type FilterValue = InvoiceStatus | 'all'

interface InvoiceFilterTabsProps {
  /** All invoices (for counting) */
  invoices: Invoice[]
  /** Currently active filter */
  activeFilter: FilterValue
  /** Called when filter changes */
  onFilterChange: (filter: FilterValue) => void
  /** Additional class names */
  className?: string
}

/**
 * InvoiceFilterTabs — Status-based filter tabs
 * 
 * Layout (v4.2):
 * - Horizontal tabs with counts
 * - "All" tab plus one per status
 * - Active state with solid background
 * - Subtle status color indicators
 */
export function InvoiceFilterTabs({
  invoices,
  activeFilter,
  onFilterChange,
  className,
}: InvoiceFilterTabsProps) {
  // Calculate counts for all statuses
  const counts: Record<FilterValue, number> = {
    all: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    cancelled: invoices.filter(inv => inv.status === 'cancelled').length,
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
      role="tablist"
      aria-label="Filter invoices by status"
    >
      {filterOptions.map(option => (
        <FilterTab
          key={option.value}
          value={option.value}
          label={option.label}
          count={counts[option.value]}
          isActive={activeFilter === option.value}
          onClick={() => onFilterChange(option.value)}
          colorClass={option.colorClass}
        />
      ))}
    </div>
  )
}

/**
 * Filter tab options configuration
 */
const filterOptions: Array<{
  value: FilterValue
  label: string
  colorClass?: string
}> = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft', colorClass: 'data-[active=true]:border-slate-400' },
    { value: 'pending', label: 'Pending', colorClass: 'data-[active=true]:border-amber-500' },
    { value: 'paid', label: 'Paid', colorClass: 'data-[active=true]:border-emerald-500' },
    { value: 'overdue', label: 'Overdue', colorClass: 'data-[active=true]:border-rose-500' },
    { value: 'cancelled', label: 'Cancelled', colorClass: 'data-[active=true]:border-slate-400' },
  ]

/**
 * Individual filter tab button
 */
interface FilterTabProps {
  value: FilterValue
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  colorClass?: string
}

function FilterTab({
  value,
  label,
  count,
  isActive,
  onClick,
  colorClass,
}: FilterTabProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`${value}-panel`}
      data-active={isActive}
      onClick={onClick}
      className={cn(
        // Base styles
        "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
        "border-2 transition-colors",
        // Inactive state
        "border-transparent",
        "text-slate-600 dark:text-slate-400",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        // Active state
        "data-[active=true]:bg-white dark:data-[active=true]:bg-slate-900",
        "data-[active=true]:text-slate-900 dark:data-[active=true]:text-slate-50",
        "data-[active=true]:border-blue-500",
        "data-[active=true]:shadow-sm",
        // Focus state
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        // Status-specific border color when active
        colorClass
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs",
          isActive
            ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        )}
      >
        {count}
      </span>
    </button>
  )
}

export type { FilterValue }
