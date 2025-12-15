# db/migrate/20251215000003_create_line_items.rb
class CreateLineItems < ActiveRecord::Migration[8.0]
  def change
    create_table :line_items do |t|
      t.references :invoice, null: false, foreign_key: true
      t.string :item_type, null: false  # 'item', 'section', 'discount'
      t.text :description, null: false
      t.decimal :quantity, precision: 10, scale: 2
      t.string :unit_type  # 'hours', 'days', 'items', 'units', 'fixed'
      t.decimal :unit_price, precision: 10, scale: 2
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :line_items, [:invoice_id, :position]
    add_index :line_items, :item_type
  end
end
