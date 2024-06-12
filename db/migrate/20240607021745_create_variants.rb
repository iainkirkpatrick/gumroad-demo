class CreateVariants < ActiveRecord::Migration[7.1]
  def change
    create_table :variants do |t|
      t.references :product, null: false, foreign_key: true
      t.string :public_id, null: false
      t.string :name
      t.string :price
      t.string :description

      t.timestamps
    end
  end
end
