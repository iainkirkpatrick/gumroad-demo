require "test_helper"

class CartItemTest < ActiveSupport::TestCase
  def setup
    @cart = carts(:one)
    @product = products(:one)
    @cart_item = CartItem.new(cart: @cart, product: @product)
  end

  test 'should be valid with valid attributes' do
    assert @cart_item.valid?
  end

  test 'should require a cart_id' do
    @cart_item.cart_id = nil
    assert_not @cart_item.valid?
    assert_includes @cart_item.errors[:cart_id], "can't be blank"
  end

  test 'should require a product_id' do
    @cart_item.product_id = nil
    assert_not @cart_item.valid?
    assert_includes @cart_item.errors[:product_id], "can't be blank"
  end

  test 'should belong to a cart' do
    assert_equal @cart, @cart_item.cart
  end

  test 'should belong to a product' do
    assert_equal @product, @cart_item.product
  end
end
