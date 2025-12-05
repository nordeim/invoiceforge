// app/frontend/components/layout/NavItem.tsx
import { Link, usePage } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

export function NavItem({ href, icon: Icon, label }: NavItemProps) {
  const { url } = usePage()
  
  // Check if current route matches (handle both exact and prefix matching)
  const isActive = url === href || url.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  )
}
