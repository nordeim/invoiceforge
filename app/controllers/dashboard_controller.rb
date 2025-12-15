# app/controllers/dashboard_controller.rb
class DashboardController < ApplicationController
  def index
    # Calculate metrics from real data
    metrics = calculate_metrics
    
    # Get recent invoices
    recent_invoices = Invoice.includes(:client)
                             .recent
                             .limit(5)
                             .map { |invoice| serialize_invoice(invoice) }
    
    # Get recent activity
    recent_activity = build_recent_activity

    render inertia: 'Dashboard', props: {
      metrics: metrics,
      invoices: recent_invoices,
      activities: recent_activity
    }
  end

  private

  def calculate_metrics
    # Outstanding = pending + overdue totals
    outstanding = Invoice.outstanding.sum(:total)
    
    # Paid this month
    paid_this_month = Invoice.paid
                             .where(updated_at: Time.current.beginning_of_month..Time.current.end_of_month)
                             .sum(:total)
    
    # Paid year to date
    paid_ytd = Invoice.paid
                      .where(updated_at: Time.current.beginning_of_year..Time.current.end_of_year)
                      .sum(:total)
    
    # Overdue stats
    overdue_invoices = Invoice.where(status: 'pending').where('due_date < ?', Date.today)
    
    {
      totalOutstanding: outstanding.to_f,
      totalPaidThisMonth: paid_this_month.to_f,
      totalPaidYTD: paid_ytd.to_f,
      overdueAmount: overdue_invoices.sum(:total).to_f,
      overdueCount: overdue_invoices.count
    }
  end

  def serialize_invoice(invoice)
    {
      id: invoice.id.to_s,
      invoiceNumber: invoice.invoice_number,
      clientId: invoice.client_id.to_s,
      client: invoice.client ? {
        id: invoice.client.id.to_s,
        name: invoice.client.name,
        email: invoice.client.email,
        company: invoice.client.company,
        address: invoice.client.address,
        phone: invoice.client.phone
      } : nil,
      status: invoice.calculated_status,
      issueDate: invoice.issue_date.iso8601,
      dueDate: invoice.due_date.iso8601,
      notes: invoice.notes,
      total: invoice.total.to_f,
      subtotal: invoice.subtotal.to_f,
      totalDiscount: invoice.total_discount.to_f,
      token: invoice.token,
      lineItems: [],  # Not needed for dashboard display
      createdAt: invoice.created_at.iso8601,
      updatedAt: invoice.updated_at.iso8601
    }
  end

  def build_recent_activity
    activities = []
    
    # Get recent invoices and clients for activity feed
    recent_invoices = Invoice.includes(:client).order(updated_at: :desc).limit(10)
    recent_clients = Client.order(created_at: :desc).limit(5)
    
    recent_invoices.each do |invoice|
      activities << {
        id: "inv_#{invoice.id}",
        type: activity_type_for_invoice(invoice),
        description: activity_description_for_invoice(invoice),
        timestamp: invoice.updated_at.iso8601,
        relatedId: invoice.id.to_s,
        relatedType: 'invoice'
      }
    end
    
    recent_clients.each do |client|
      activities << {
        id: "cli_#{client.id}",
        type: 'client_created',
        description: "New client added: #{client.name}",
        timestamp: client.created_at.iso8601,
        relatedId: client.id.to_s,
        relatedType: 'client'
      }
    end
    
    # Sort by timestamp and limit
    activities.sort_by { |a| a[:timestamp] }.reverse.first(10)
  end

  def activity_type_for_invoice(invoice)
    case invoice.status
    when 'draft' then 'invoice_created'
    when 'pending' then 'invoice_sent'
    when 'paid' then 'invoice_paid'
    when 'overdue' then 'invoice_overdue'
    else 'invoice_created'
    end
  end

  def activity_description_for_invoice(invoice)
    client_name = invoice.client&.name || 'Unknown Client'
    case invoice.status
    when 'draft' then "Invoice ##{invoice.invoice_number} created for #{client_name}"
    when 'pending' then "Invoice ##{invoice.invoice_number} sent to #{client_name}"
    when 'paid' then "Invoice ##{invoice.invoice_number} paid by #{client_name}"
    when 'overdue' then "Invoice ##{invoice.invoice_number} is overdue from #{client_name}"
    else "Invoice ##{invoice.invoice_number} updated"
    end
  end
end
