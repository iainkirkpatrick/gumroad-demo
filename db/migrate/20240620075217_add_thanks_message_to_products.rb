class AddThanksMessageToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :thanks_message, :string
  end
end
