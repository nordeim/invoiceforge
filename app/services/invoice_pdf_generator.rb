# app/services/invoice_pdf_generator.rb
# PDF Invoice Generator using Prawn
# Matches the "Neo-Editorial Precision" design language

require 'prawn'
require 'prawn/table'

class InvoicePdfGenerator
  include ActionView::Helpers::NumberHelper

  COLORS = {
    primary: '1E293B',      # slate-800
    secondary: '64748B',    # slate-500
    accent: '3B82F6',       # blue-500
    light: 'F1F5F9',        # slate-100
    white: 'FFFFFF',
    success: '22C55E',      # green-500
    warning: 'EAB308',      # yellow-500
    danger: 'EF4444'        # red-500
  }.freeze

  STATUS_COLORS = {
    'draft' => '64748B',
    'pending' => 'EAB308',
    'paid' => '22C55E',
    'overdue' => 'EF4444',
    'cancelled' => '6B7280'
  }.freeze

  def initialize(invoice)
    @invoice = invoice
    @client = invoice.client
    @line_items = invoice.line_items.order(:position)
  end

  def generate
    Prawn::Document.new(page_size: 'A4', margin: [40, 40, 40, 40]) do |pdf|
      setup_fonts(pdf)
      render_header(pdf)
      render_invoice_meta(pdf)
      render_billing_info(pdf)
      render_line_items(pdf)
      render_totals(pdf)
      render_notes(pdf)
      render_footer(pdf)
    end.render
  end

  def filename
    "invoice-#{@invoice.invoice_number}.pdf"
  end

  private

  def setup_fonts(pdf)
    # Use built-in Helvetica for now (Prawn default)
    # For custom fonts, you'd add: pdf.font_families.update(...)
    pdf.font 'Helvetica'
  end

  def render_header(pdf)
    pdf.bounding_box([0, pdf.cursor], width: pdf.bounds.width, height: 80) do
      # Company name (left side)
      pdf.text_box 'INVOICEFORGE',
                   at: [0, pdf.cursor],
                   size: 24,
                   style: :bold,
                   color: COLORS[:primary]

      # Invoice number (right side, large)
      pdf.text_box @invoice.invoice_number,
                   at: [pdf.bounds.width - 200, pdf.cursor],
                   width: 200,
                   size: 28,
                   style: :bold,
                   align: :right,
                   color: COLORS[:primary]

      # Status badge
      status = @invoice.calculated_status
      status_color = STATUS_COLORS[status] || COLORS[:secondary]
      
      pdf.text_box status.upcase,
                   at: [pdf.bounds.width - 200, pdf.cursor - 35],
                   width: 200,
                   size: 10,
                   align: :right,
                   color: status_color,
                   style: :bold
    end

    pdf.move_down 20
  end

  def render_invoice_meta(pdf)
    pdf.bounding_box([0, pdf.cursor], width: pdf.bounds.width, height: 50) do
      # Issue date
      pdf.text_box "Issue Date: #{format_date(@invoice.issue_date)}",
                   at: [0, pdf.cursor],
                   size: 10,
                   color: COLORS[:secondary]

      # Due date
      pdf.text_box "Due Date: #{format_date(@invoice.due_date)}",
                   at: [150, pdf.cursor],
                   size: 10,
                   color: COLORS[:secondary]
    end

    pdf.move_down 10
    pdf.stroke_horizontal_rule
    pdf.move_down 20
  end

  def render_billing_info(pdf)
    pdf.bounding_box([0, pdf.cursor], width: pdf.bounds.width, height: 100) do
      # Bill To section
      pdf.text 'BILL TO', size: 8, color: COLORS[:secondary], style: :bold
      pdf.move_down 8
      
      pdf.text @client.name, size: 12, style: :bold, color: COLORS[:primary]
      
      if @client.company.present?
        pdf.text @client.company, size: 10, color: COLORS[:secondary]
      end
      
      if @client.address.present?
        pdf.move_down 4
        pdf.text @client.address, size: 10, color: COLORS[:secondary]
      end
      
      if @client.email.present?
        pdf.move_down 4
        pdf.text @client.email, size: 10, color: COLORS[:accent]
      end
    end

    pdf.move_down 20
  end

  def render_line_items(pdf)
    # Build table data
    table_data = [['Description', 'Qty', 'Unit', 'Rate', 'Amount']]
    
    @line_items.each do |item|
      case item.item_type
      when 'section'
        table_data << [{ content: item.description, colspan: 5, font_style: :bold }]
      when 'item'
        table_data << [
          item.description,
          format_quantity(item.quantity),
          item.unit_type&.titleize || '-',
          format_currency(item.unit_price),
          format_currency(item.line_total)
        ]
      when 'discount'
        table_data << [
          { content: item.description, colspan: 4, font_style: :italic },
          { content: format_currency(item.unit_price), align: :right }
        ]
      end
    end

    # Render table
    pdf.table(table_data, width: pdf.bounds.width) do |table|
      table.cells.padding = [8, 10, 8, 10]
      table.cells.borders = [:bottom]
      table.cells.border_color = 'E2E8F0'
      
      # Header row styling
      table.row(0).font_style = :bold
      table.row(0).background_color = COLORS[:light]
      table.row(0).text_color = COLORS[:primary]
      
      # Column widths
      table.column(0).width = 250
      table.column(1).width = 50
      table.column(1).align = :center
      table.column(2).width = 60
      table.column(2).align = :center
      table.column(3).width = 80
      table.column(3).align = :right
      table.column(4).width = 80
      table.column(4).align = :right
    end

    pdf.move_down 20
  end

  def render_totals(pdf)
    totals_width = 200
    x_position = pdf.bounds.width - totals_width

    pdf.bounding_box([x_position, pdf.cursor], width: totals_width, height: 100) do
      # Subtotal
      pdf.text_box 'Subtotal:', at: [0, pdf.cursor], size: 10, color: COLORS[:secondary]
      pdf.text_box format_currency(@invoice.subtotal),
                   at: [0, pdf.cursor], width: totals_width, align: :right,
                   size: 10, color: COLORS[:primary]
      pdf.move_down 20

      # Discount (if any)
      if @invoice.total_discount > 0
        pdf.text_box 'Discount:', at: [0, pdf.cursor], size: 10, color: COLORS[:secondary]
        pdf.text_box "-#{format_currency(@invoice.total_discount)}",
                     at: [0, pdf.cursor], width: totals_width, align: :right,
                     size: 10, color: COLORS[:danger]
        pdf.move_down 20
      end

      # Total
      pdf.stroke_horizontal_rule
      pdf.move_down 10
      
      pdf.text_box 'Total Due:', at: [0, pdf.cursor], size: 12, style: :bold, color: COLORS[:primary]
      pdf.text_box format_currency(@invoice.total),
                   at: [0, pdf.cursor], width: totals_width, align: :right,
                   size: 16, style: :bold, color: COLORS[:primary]
    end

    pdf.move_down 40
  end

  def render_notes(pdf)
    return unless @invoice.notes.present?

    pdf.text 'Notes', size: 10, style: :bold, color: COLORS[:secondary]
    pdf.move_down 8
    pdf.text @invoice.notes, size: 10, color: COLORS[:primary]
    pdf.move_down 20
  end

  def render_footer(pdf)
    pdf.bounding_box([0, 50], width: pdf.bounds.width, height: 40) do
      pdf.stroke_horizontal_rule
      pdf.move_down 10
      
      pdf.text "Generated by InvoiceForge • #{format_date(Date.today)}",
               size: 8, color: COLORS[:secondary], align: :center
    end
  end

  # Formatting helpers
  def format_currency(amount)
    number_to_currency(amount || 0, unit: 'S$', precision: 2)
  end

  def format_quantity(qty)
    return '-' if qty.nil?
    qty == qty.to_i ? qty.to_i.to_s : qty.to_s
  end

  def format_date(date)
    date&.strftime('%d %b %Y') || '-'
  end
end
