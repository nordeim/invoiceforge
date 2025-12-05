// app/frontend/pages/Clients/Index.tsx
import { AppLayout } from "@/layouts/AppLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ClientsIndex() {
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl tracking-tight leading-none text-slate-900 dark:text-slate-50">
            Clients
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            3 total clients
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Client list will be implemented on Day 3
        </p>
      </div>
    </AppLayout>
  )
}
