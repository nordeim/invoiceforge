# app/models/line_item.rb
class LineItem < ApplicationRecord
  # ═══════════════════════════════════════════════════════════════════════════
  # CONSTANTS
  # ═══════════════════════════════════════════════════════════════════════════
  ITEM_TYPES = %w[item section discount].freeze
  UNIT_TYPES = %w[hours days items units fixed].freeze

  # ═══════════════════════════════════════════════════════════════════════════
  # ASSOCIATIONS
  # ═══════════════════════════════════════════════════════════════════════════
  belongs_to :invoice

  # ═══════════════════════════════════════════════════════════════════════════
  # VALIDATIONS
  # ═══════════════════════════════════════════════════════════════════════════
  validates :item_type, presence: true, inclusion: { in: ITEM_TYPES }
  validates :description, presence: true, length: { maximum: 1000 }
  validates :position, presence: true, 
                       numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  
  # Conditional validations for billable items
  validates :quantity, presence: true, numericality: { greater_than: 0 }, if: :billable?
  validates :unit_price, presence: true, numericality: true, if: :billable?
  validates :unit_type, inclusion: { in: UNIT_TYPES }, allow_blank: true

  # ═══════════════════════════════════════════════════════════════════════════
  # CALLBACKS
  # ═══════════════════════════════════════════════════════════════════════════
  after_save :update_invoice_totals
  after_destroy :update_invoice_totals

  # ═══════════════════════════════════════════════════════════════════════════
  # SCOPES
  # ═══════════════════════════════════════════════════════════════════════════
  scope :ordered, -> { order(:position) }
  scope :billable, -> { where(item_type: 'item') }
  scope :sections, -> { where(item_type: 'section') }
  scope :discounts, -> { where(item_type: 'discount') }

  # ═══════════════════════════════════════════════════════════════════════════
  # INSTANCE METHODS
  # ═══════════════════════════════════════════════════════════════════════════

  # Is this a billable item (not a section header)?
  def billable?
    item_type == 'item'
  end

  # Is this a section header?
  def section?
    item_type == 'section'
  end

  # Is this a discount?
  def discount?
    item_type == 'discount'
  end

  # Calculate line total
  def line_total
    return 0 if section?
    (quantity || 0) * (unit_price || 0)
  end

  private

  def update_invoice_totals
    invoice&.recalculate_totals!
  end
end
