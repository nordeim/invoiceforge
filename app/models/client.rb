# app/models/client.rb
class Client < ApplicationRecord
  # ═══════════════════════════════════════════════════════════════════════════
  # ASSOCIATIONS
  # ═══════════════════════════════════════════════════════════════════════════
  has_many :invoices, dependent: :restrict_with_error

  # ═══════════════════════════════════════════════════════════════════════════
  # VALIDATIONS
  # ═══════════════════════════════════════════════════════════════════════════
  validates :name, presence: true, length: { maximum: 255 }
  validates :email, presence: true, 
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: 'must be a valid email address' },
                    length: { maximum: 255 }
  validates :company, length: { maximum: 255 }, allow_blank: true
  validates :phone, length: { maximum: 50 }, allow_blank: true

  # ═══════════════════════════════════════════════════════════════════════════
  # SCOPES
  # ═══════════════════════════════════════════════════════════════════════════
  scope :ordered, -> { order(:name) }
  scope :with_recent_invoice, -> { includes(:invoices).order('invoices.created_at DESC') }

  # ═══════════════════════════════════════════════════════════════════════════
  # COMPUTED FIELDS (for list views)
  # ═══════════════════════════════════════════════════════════════════════════
  
  # Total amount billed from paid invoices
  def total_billed
    invoices.where(status: 'paid').sum(:total)
  end

  # Date of most recent invoice
  def last_invoice_date
    invoices.maximum(:issue_date)
  end

  # Total number of invoices
  def invoice_count
    invoices.count
  end
end
