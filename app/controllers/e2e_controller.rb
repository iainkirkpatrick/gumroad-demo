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
    Product.create!(native_type: "coffee", name: "Coffee Product", price_range: '5')
    Product.create!(native_type: "commissions", name: "Commissions Product", price_range: '500')
    Product.create!(native_type: "calls", name: "Calls Product", price_range: '20')
    
    render plain: "Products created"
  end
end