# app/mailers/invoice_mailer.rb
class InvoiceMailer < ApplicationMailer
  # Send invoice to client
  def send_invoice(invoice, options = {})
    @invoice = invoice
    @client = invoice.client
    @public_url = public_invoice_url(token: invoice.token)
    @include_pdf = options.fetch(:include_pdf, true)
    
    # Attach PDF if requested
    if @include_pdf
      generator = InvoicePdfGenerator.new(@invoice)
      attachments[generator.filename] = {
        mime_type: 'application/pdf',
        content: generator.generate
      }
    end

    mail(
      to: @client.email,
      subject: "Invoice #{@invoice.invoice_number} from InvoiceForge"
    )
  end

  # Payment reminder for overdue invoices
  def payment_reminder(invoice)
    @invoice = invoice
    @client = invoice.client
    @public_url = public_invoice_url(token: invoice.token)
    @days_overdue = (Date.today - invoice.due_date).to_i

    mail(
      to: @client.email,
      subject: "Payment Reminder: Invoice #{@invoice.invoice_number} is overdue"
    )
  end

  # Payment confirmation
  def payment_received(invoice)
    @invoice = invoice
    @client = invoice.client

    mail(
      to: @client.email,
      subject: "Payment Received: Invoice #{@invoice.invoice_number}"
    )
  end
end
