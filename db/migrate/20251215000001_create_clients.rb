# db/migrate/20251215000001_create_clients.rb
class CreateClients < ActiveRecord::Migration[8.0]
  def change
    create_table :clients do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :company
      t.text :address
      t.string :phone
      t.string :city
      t.string :country
      t.string :postal_code
      t.text :notes

      t.timestamps
    end

    add_index :clients, :email
    add_index :clients, :name
  end
end
