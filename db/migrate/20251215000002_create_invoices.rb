# db/migrate/20251215000002_create_invoices.rb
class CreateInvoices < ActiveRecord::Migration[8.0]
  def change
    create_table :invoices do |t|
      t.references :client, null: false, foreign_key: true
      t.string :invoice_number, null: false
      t.string :status, null: false, default: 'draft'
      t.date :issue_date, null: false
      t.date :due_date, null: false
      t.text :notes
      t.string :token, null: false
      t.decimal :subtotal, precision: 10, scale: 2, default: 0
      t.decimal :total_discount, precision: 10, scale: 2, default: 0
      t.decimal :total, precision: 10, scale: 2, default: 0

      t.timestamps
    end

    add_index :invoices, :invoice_number, unique: true
    add_index :invoices, :token, unique: true
    add_index :invoices, :status
    add_index :invoices, :due_date
  end
end
