# app/models/invoice.rb
class Invoice < ApplicationRecord
  # ═══════════════════════════════════════════════════════════════════════════
  # CONSTANTS
  # ═══════════════════════════════════════════════════════════════════════════
  STATUSES = %w[draft pending paid overdue cancelled].freeze

  # ═══════════════════════════════════════════════════════════════════════════
  # ASSOCIATIONS
  # ═══════════════════════════════════════════════════════════════════════════
  belongs_to :client
  has_many :line_items, dependent: :destroy
  
  accepts_nested_attributes_for :line_items, allow_destroy: true

  # ═══════════════════════════════════════════════════════════════════════════
  # VALIDATIONS
  # ═══════════════════════════════════════════════════════════════════════════
  validates :invoice_number, presence: true, 
                             uniqueness: { case_sensitive: false },
                             length: { maximum: 50 }
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :issue_date, presence: true
  validates :due_date, presence: true
  validates :token, presence: true, uniqueness: true
  
  validate :due_date_after_issue_date

  # ═══════════════════════════════════════════════════════════════════════════
  # CALLBACKS
  # ═══════════════════════════════════════════════════════════════════════════
  before_validation :generate_token, on: :create
  after_save :recalculate_totals, if: :should_recalculate?

  # ═══════════════════════════════════════════════════════════════════════════
  # SCOPES
  # ═══════════════════════════════════════════════════════════════════════════
  scope :by_status, ->(status) { status.present? && status != 'all' ? where(status: status) : all }
  scope :draft, -> { where(status: 'draft') }
  scope :pending, -> { where(status: 'pending') }
  scope :paid, -> { where(status: 'paid') }
  scope :overdue, -> { where(status: 'overdue') }
  scope :cancelled, -> { where(status: 'cancelled') }
  scope :recent, -> { order(created_at: :desc) }
  scope :outstanding, -> { where(status: %w[pending overdue]) }

  # ═══════════════════════════════════════════════════════════════════════════
  # INSTANCE METHODS
  # ═══════════════════════════════════════════════════════════════════════════

  # Check if invoice is past due date
  def overdue?
    status == 'pending' && due_date < Date.today
  end

  # Get calculated status (handles overdue detection)
  def calculated_status
    return status unless status == 'pending'
    overdue? ? 'overdue' : 'pending'
  end

  # Can this invoice be edited?
  def editable?
    status == 'draft'
  end

  # Can this invoice be sent?
  def sendable?
    status == 'draft' && line_items.any?
  end

  # Can this invoice be marked as paid?
  def payable?
    %w[pending overdue].include?(status)
  end

  # Mark invoice as sent (draft → pending)
  def mark_sent!
    update!(status: 'pending') if sendable?
  end

  # Mark invoice as paid
  def mark_paid!
    update!(status: 'paid') if payable?
  end

  # Cancel invoice
  def cancel!
    update!(status: 'cancelled') unless status == 'paid'
  end

  # Recalculate and persist totals from line items
  def recalculate_totals!
    items = line_items.where(item_type: 'item')
    discounts = line_items.where(item_type: 'discount')

    calculated_subtotal = items.sum { |i| (i.quantity || 0) * (i.unit_price || 0) }
    calculated_discount = discounts.sum { |d| (d.unit_price || 0).abs }
    calculated_total = calculated_subtotal - calculated_discount

    update_columns(
      subtotal: calculated_subtotal,
      total_discount: calculated_discount,
      total: calculated_total
    )
  end

  # Public URL path
  def public_url_path
    "/i/#{token}"
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(16)
  end

  def recalculate_totals
    recalculate_totals!
  end

  def should_recalculate?
    saved_change_to_id? # Only on create, line items handle updates
  end

  def due_date_after_issue_date
    return unless issue_date.present? && due_date.present?
    
    if due_date < issue_date
      errors.add(:due_date, 'must be on or after issue date')
    end
  end
end
