class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :public_id, null: false
      t.string :native_type, null: false
      t.string :description
      t.string :price_range
      t.string :price_currency_type
      t.string :rich_content
      t.string :thanks_message
      t.boolean :is_physical
      t.boolean :is_recurring_billing
      t.boolean :is_published
      
      t.timestamps
    end
  end
end
