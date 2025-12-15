# app/controllers/public_invoices_controller.rb
class PublicInvoicesController < ApplicationController
  # Skip authentication for public invoice views
  skip_before_action :authenticate_user!

  # GET /i/:token
  def show
    @invoice = Invoice.includes(:client, :line_items).find_by!(token: params[:token])

    # Don't show draft or cancelled invoices publicly
    if @invoice.status == 'draft'
      render inertia: 'Errors/NotFound', props: {
        message: 'This invoice is not available for viewing.'
      }, status: :not_found
      return
    end

    render inertia: 'PublicInvoice/Show', props: {
      invoice: serialize_public_invoice(@invoice)
    }
  rescue ActiveRecord::RecordNotFound
    render inertia: 'Errors/NotFound', props: {
      message: 'Invoice not found. Please check the link and try again.'
    }, status: :not_found
  end

  # GET /i/:token/download
  def download_pdf
    @invoice = Invoice.includes(:client, :line_items).find_by!(token: params[:token])

    # Don't allow PDF download for draft invoices
    if @invoice.status == 'draft'
      redirect_to public_invoice_path(params[:token]), alert: 'Invoice not available for download'
      return
    end

    generator = InvoicePdfGenerator.new(@invoice)
    send_data generator.generate,
              filename: generator.filename,
              type: 'application/pdf',
              disposition: 'attachment'
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, alert: 'Invoice not found'
  end

  private

  def serialize_public_invoice(invoice)
    {
      token: invoice.token,
      invoiceNumber: invoice.invoice_number,
      status: calculate_status(invoice),
      issueDate: invoice.issue_date.iso8601,
      dueDate: invoice.due_date.iso8601,
      subtotal: invoice.subtotal.to_f,
      totalDiscount: invoice.total_discount.to_f,
      total: invoice.total.to_f,
      notes: invoice.notes,
      # Client info (flattened for simplicity)
      clientName: invoice.client&.name || 'Unknown Client',
      clientCompany: invoice.client&.company,
      clientEmail: invoice.client&.email,
      clientAddress: invoice.client&.address,
      clientPhone: invoice.client&.phone,
      # Line items
      lineItems: serialize_line_items(invoice.line_items)
    }
  end

  def serialize_line_items(line_items)
    line_items.order(:position).map do |item|
      {
        id: item.id.to_s,
        type: item.item_type,
        description: item.description,
        quantity: item.quantity&.to_f,
        unitType: item.unit_type,
        unitPrice: item.unit_price&.to_f,
        position: item.position
      }
    end
  end

  # Calculate real-time status (handles overdue)
  def calculate_status(invoice)
    return invoice.status if ['paid', 'cancelled', 'draft'].include?(invoice.status)
    return 'overdue' if invoice.due_date < Date.today && invoice.status == 'pending'
    invoice.status
  end
end
