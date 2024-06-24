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
    SeedHelper.create_products_and_variants
    render plain: "Products created"
  end
end