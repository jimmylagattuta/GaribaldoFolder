class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :category, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :quantity, null: false, default: 0
      t.text :description
      t.boolean :active, null: false, default: true
      t.string :image_url
      t.string :image_public_id

      t.timestamps
    end

    add_index :products, :name
    add_index :products, :category
    add_index :products, :active
  end
end