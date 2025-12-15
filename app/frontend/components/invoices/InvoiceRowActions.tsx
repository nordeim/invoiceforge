// app/frontend/components/invoices/InvoiceRowActions.tsx
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Send,
  CheckCircle,
  Trash2,
  ExternalLink,
  Copy,
  Download,
} from "lucide-react"
import type { Invoice } from "@/lib/types"

interface InvoiceRowActionsProps {
  invoice: Invoice
  onEdit?: (invoice: Invoice) => void
  onView?: (invoice: Invoice) => void
  onSend?: (invoice: Invoice) => void
  onMarkPaid?: (invoice: Invoice) => void
  onDelete?: (invoice: Invoice) => void
  onCopyLink?: (invoice: Invoice) => void
}

/**
 * InvoiceRowActions — Contextual actions menu for invoice rows
 * 
 * Actions vary by status:
 * - Draft: Edit, Send, Delete
 * - Pending: Edit, View Public, Mark Paid, Copy Link
 * - Paid: Edit, View Public, Copy Link
 * - Overdue: Edit, View Public, Mark Paid, Copy Link
 */
export function InvoiceRowActions({
  invoice,
  onEdit,
  onView,
  onSend,
  onMarkPaid,
  onDelete,
  onCopyLink,
}: InvoiceRowActionsProps) {
  const { status } = invoice

  const isDraft = status === 'draft'
  const canMarkPaid = status === 'pending' || status === 'overdue'
  const hasPublicLink = status !== 'draft'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={`Actions for invoice ${invoice.invoiceNumber}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Edit — Available for all statuses */}
        <DropdownMenuItem onClick={() => onEdit?.(invoice)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Invoice
        </DropdownMenuItem>

        {/* View Public — Not available for drafts */}
        {hasPublicLink && (
          <DropdownMenuItem onClick={() => onView?.(invoice)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Public
          </DropdownMenuItem>
        )}

        {/* Copy Link — Not available for drafts */}
        {hasPublicLink && (
          <DropdownMenuItem onClick={() => onCopyLink?.(invoice)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
        )}

        {/* Download PDF — Available for all invoices */}
        <DropdownMenuItem asChild>
          <a href={`/invoices/${invoice.id}/download_pdf`} download>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Send — Only for drafts */}
        {isDraft && (
          <DropdownMenuItem onClick={() => onSend?.(invoice)}>
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </DropdownMenuItem>
        )}

        {/* Mark Paid — For pending and overdue */}
        {canMarkPaid && (
          <DropdownMenuItem onClick={() => onMarkPaid?.(invoice)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Paid
          </DropdownMenuItem>
        )}

        {/* Delete — Only for drafts */}
        {isDraft && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(invoice)}
              className="text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Invoice
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
