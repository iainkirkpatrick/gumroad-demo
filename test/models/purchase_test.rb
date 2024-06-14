require "test_helper"

class PurchaseTest < ActiveSupport::TestCase
  def setup
    @product = products(:one)
    @purchase = Purchase.new(product: @product)
  end

  test 'should generate a public_id before creating' do
    assert_nil @purchase.public_id
    @purchase.save
    assert_match(/\A\w{6}\z/, @purchase.public_id)
  end
end
