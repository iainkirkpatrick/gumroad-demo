class CreateCarts < ActiveRecord::Migration[7.1]
  def change
    create_table :carts do |t|
      # no sessions etc for the demo, just a single cart
      t.timestamps
    end
  end
end
