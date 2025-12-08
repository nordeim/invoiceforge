// app/frontend/components/public-invoice/PublicInvoiceBilledTo.tsx

import { cn } from "@/lib/utils"

interface PublicInvoiceBilledToProps {
    /** Client information */
    client: {
        name: string
        company?: string
        email?: string
        address?: string
        phone?: string
    }
    /** Additional CSS classes */
    className?: string
}

/**
 * PublicInvoiceBilledTo — Client billing details
 * 
 * Displays:
 * - Client name and company
 * - Address
 * - Contact information
 */
export function PublicInvoiceBilledTo({
    client,
    className,
}: PublicInvoiceBilledToProps) {
    return (
        <section className={cn("mb-8", className)}>
            <h2 className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-3">
                Billed To
            </h2>
            <div className="space-y-1">
                {/* Company/Name */}
                <p className="text-lg font-semibold text-slate-900">
                    {client.company || client.name}
                </p>

                {/* Name (if different from company) */}
                {client.company && client.name !== client.company && (
                    <p className="text-slate-700">
                        {client.name}
                    </p>
                )}

                {/* Address */}
                {client.address && (
                    <p className="text-slate-600 whitespace-pre-line">
                        {client.address}
                    </p>
                )}

                {/* Email */}
                {client.email && (
                    <p className="text-slate-600">
                        {client.email}
                    </p>
                )}

                {/* Phone */}
                {client.phone && (
                    <p className="text-slate-600">
                        {client.phone}
                    </p>
                )}
            </div>
        </section>
    )
}
