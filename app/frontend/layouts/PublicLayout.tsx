// app/frontend/layouts/PublicLayout.tsx
import { cn } from "@/lib/utils"

interface PublicLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * PublicLayout — Minimal layout for public-facing pages
 * 
 * Features:
 * - No navigation
 * - Centered content
 * - Print-optimized
 */
export function PublicLayout({ children, className }: PublicLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-slate-100 dark:bg-slate-950",
      "print:bg-white print:min-h-0",
      className
    )}>
      <main className="mx-auto max-w-4xl px-4 py-8 print:p-0 print:max-w-none">
        {children}
      </main>
    </div>
  )
}
