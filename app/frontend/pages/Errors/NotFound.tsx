// app/frontend/pages/Errors/NotFound.tsx
import { Head, Link } from "@inertiajs/react"
import { PublicLayout } from "@/layouts/PublicLayout"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"

interface NotFoundProps {
    message?: string
}

/**
 * NotFound Error Page
 * 
 * Used for:
 * - Invalid invoice tokens
 * - Draft invoices accessed publicly
 * - General 404 errors
 */
export default function NotFound({ message }: NotFoundProps) {
    return (
        <>
            <Head title="Not Found" />

            <PublicLayout>
                <div className="text-center py-16">
                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                        <FileQuestion className="h-10 w-10 text-slate-400" />
                    </div>

                    {/* Message */}
                    <h1 className="text-2xl font-semibold text-slate-900 mb-3">
                        Invoice Not Found
                    </h1>
                    <p className="text-slate-600 max-w-md mx-auto mb-8">
                        {message || "The invoice you're looking for doesn't exist or may have been removed."}
                    </p>

                    {/* Action */}
                    <Link href="/">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </PublicLayout>
        </>
    )
}
