class AddCallLinkToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :call_link, :string
  end
end
