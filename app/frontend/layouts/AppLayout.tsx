// app/frontend/layouts/AppLayout.tsx
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { TooltipProvider } from "@/components/ui/tooltip"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <TooltipProvider>
      {/* Canvas background - the "well" that cards sit in */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Header */}
        <MobileNav />

        {/* Main Content Area */}
        <main className="lg:pl-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
