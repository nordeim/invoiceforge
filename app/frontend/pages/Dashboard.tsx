// app/frontend/pages/Dashboard.tsx
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { mockDashboardMetrics } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl tracking-tight leading-none text-slate-900 dark:text-slate-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {today}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Outstanding */}
        <MetricCard
          label="Outstanding"
          value={formatCurrency(mockDashboardMetrics.totalOutstanding)}
          subtext="2 invoices"
        />
        
        {/* Paid This Month */}
        <MetricCard
          label="Paid (Month)"
          value={formatCurrency(mockDashboardMetrics.totalPaidThisMonth)}
        />
        
        {/* Paid YTD */}
        <MetricCard
          label="Paid (YTD)"
          value={formatCurrency(mockDashboardMetrics.totalPaidYTD)}
        />
        
        {/* Overdue */}
        <MetricCard
          label="Overdue"
          value={formatCurrency(mockDashboardMetrics.overdueAmount)}
          subtext={`${mockDashboardMetrics.overdueCount} invoice`}
          variant="danger"
        />
      </div>

      {/* Two Column Layout Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Invoices Placeholder */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            Recent Invoices
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Invoice list will be implemented on Day 2
          </p>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Activity feed will be implemented on Day 2
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MetricCard Component (inline for Day 1, will move to separate file on Day 2)
// ─────────────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string
  subtext?: string
  variant?: 'default' | 'danger'
}

function MetricCard({ label, value, subtext, variant = 'default' }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
      {/* Label */}
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      
      {/* Value */}
      <p className={`font-mono text-3xl font-medium mt-2 ${
        variant === 'danger' 
          ? 'text-rose-600 dark:text-rose-400' 
          : 'text-slate-900 dark:text-slate-50'
      }`}>
        {value}
      </p>
      
      {/* Subtext */}
      {subtext && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {subtext}
        </p>
      )}
    </div>
  )
}
