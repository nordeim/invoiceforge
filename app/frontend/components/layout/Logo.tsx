// app/frontend/components/layout/Logo.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className }: LogoProps) {
  if (collapsed) {
    // Compact version for collapsed sidebar (if needed later)
    return (
      <div className={cn("flex items-center", className)}>
        <span className="font-display text-xl font-bold leading-none text-slate-900 dark:text-slate-50">
          IF
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex flex-col">
        {/* INV in Instrument Serif */}
        <span className="font-display text-xl font-bold leading-none tracking-tight text-slate-900 dark:text-slate-50">
          INV
        </span>
        {/* Horizontal rule */}
        <div className="h-px bg-slate-900 dark:bg-slate-100 w-full my-0.5" />
        {/* FORGE in Geist Mono */}
        <span className="font-mono text-xs leading-none tracking-widest text-slate-900 dark:text-slate-50">
          FORGE
        </span>
      </div>
    </div>
  )
}
