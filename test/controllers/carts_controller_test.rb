require "test_helper"

class CartsControllerTest < ActionDispatch::IntegrationTest
  setup do
    # cart has digital product in it
    @cart = carts(:one)
    # digital
    @digital_product = products(:one)
    # coffee
    @coffee_product = products(:two)
    @coffee_variant = variants(:one)
  end

  test 'should update cart and add product' do
    assert_difference('@cart.cart_items.count', 1) do
      patch cart_url(@cart), params: { cart: { product_public_id: @coffee_product.public_id, variant_id: @coffee_variant.id, add_product: true, redirect_after_update: false } }
    end
    assert_response :success
    assert_includes @cart.cart_items.map(&:product_id), @coffee_product.id
  end

  test 'should update cart and remove product' do
    assert_difference('@cart.cart_items.count', -1) do
      patch cart_url(@cart), params: { cart: { product_public_id: @digital_product.public_id, redirect_after_update: false } }
    end
    assert_response :success
    assert_not_includes @cart.cart_items.map(&:product_id), @digital_product.id
  end

  test 'should add a coffee product to cart if another product is added to cart' do
    # create a new cart, only one allowed as per demo design
    Cart.destroy_all
    @cart = Cart.new(public_id: 'cart22')
    @cart.save!
    assert_difference('@cart.cart_items.count', 2) do
      patch cart_url(@cart), params: { cart: { product_public_id: @digital_product.public_id, add_product: true, redirect_after_update: false } }
    end
    assert_response :success
    assert_includes @cart.cart_items.map(&:product_id), @digital_product.id
    assert_includes @cart.cart_items.map(&:product_id), @coffee_product.id
  end

  private

  def cart_url(cart)
    "/carts/#{cart.public_id}"
  end
end
