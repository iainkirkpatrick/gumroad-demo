class CreatePurchases < ActiveRecord::Migration[7.1]
  def change
    create_table :purchases do |t|
      t.string :public_id, null: false
      t.references :product, null: false, foreign_key: true
      t.timestamps
    end
  end
end
