// app/frontend/components/public-invoice/PublicInvoiceNotes.tsx
import { cn } from "@/lib/utils"

interface PublicInvoiceNotesProps {
    /** Invoice notes */
    notes?: string | null
    /** Additional CSS classes */
    className?: string
}

/**
 * PublicInvoiceNotes — Invoice notes/terms display
 */
export function PublicInvoiceNotes({
    notes,
    className,
}: PublicInvoiceNotesProps) {
    if (!notes?.trim()) return null

    return (
        <section className={cn("mt-8 pt-6 border-t border-slate-200", className)}>
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-3">
                Notes
            </h2>
            <p className="text-sm text-slate-600 whitespace-pre-line">
                {notes}
            </p>
        </section>
    )
}
