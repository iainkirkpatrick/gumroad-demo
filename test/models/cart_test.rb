require "test_helper"

class CartTest < ActiveSupport::TestCase
  def setup
    @cart = Cart.create
    @product = products(:one)
    @cart_item = @cart.cart_items.create(product: @product)
  end

  test 'should have many cart_items' do
    assert_equal 1, @cart.cart_items.count
  end

  test 'should destroy associated cart_items when destroyed' do
    assert_difference('CartItem.count', -1) do
      @cart.destroy
    end
  end

  test 'should be valid without any attributes' do
    cart = Cart.new
    assert cart.valid?
  end
end
