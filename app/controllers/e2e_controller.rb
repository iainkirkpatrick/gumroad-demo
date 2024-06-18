class E2eController < ApplicationController
  skip_before_action :verify_authenticity_token

  def reset_database
    # Truncate all tables except schema_migrations and ar_internal_metadata
    ActiveRecord::Base.connection.tables.each do |table|
      unless ["schema_migrations", "ar_internal_metadata"].include?(table)
        ActiveRecord::Base.connection.execute("TRUNCATE TABLE #{table} RESTART IDENTITY CASCADE")
      end
    end
    render plain: "Database reset"
  end

  def create_sample_products
    # create a product of each kind
    Product.create!(native_type: "digital", name: "Digital Product", price_range: '10')
    coffee = Product.create!(native_type: "coffee", name: "Coffee Product", thanks_message: 'Thanks for supporting my work!')
    commissions = Product.create!(native_type: "commissions", name: "Commissions Product", price_range: '500')
    Product.create!(native_type: "calls", name: "Calls Product", price_range: '200', call_link: 'https://calendly.com/iain-oxlc/test-gumroad-meeting')
    
    coffee.variants.create!([
      { product_id: coffee.id, public_id: 'cof001', name: "Coffee", price: 5 },
      { product_id: coffee.id, public_id: 'cof002', name: "Cocktail", price: 10 },
      { product_id: coffee.id, public_id: 'cof003', name: "Pizza", price: 15 }
    ])

    commissions.variants.create!([
      { product_id: commissions.id, public_id: 'com001', name: "Small Canvas", price: 500, description: "This is the small canvas tier", rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content for small canvas."}]}]}' },
      { product_id: commissions.id, public_id: 'com002', name: "Large Canvas", price: 1000, description: "This is the large canvas tier", rich_content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content for large canvas."}]}]}' }
    ])

    render plain: "Products created"
  end
end