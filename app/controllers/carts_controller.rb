class CartsController < ApplicationController
  layout 'checkout'

  def show
    # demo: find the first cart record (or create one) that is shared by all demo users
    @cart = Cart.includes(cart_items: :product).first_or_create
  end

  def update
    # demo: find the first cart record that is shared by all demo users
    @cart = Cart.first
    product_public_id = cart_params[:product_public_id]
    add_product = cart_params[:add_product]
    redirect_after_update = cart_params[:redirect_after_update]

    product_id = Product.find_by(public_id: product_public_id).id

    if add_product
      @cart.cart_items.create(product_id: product_id, variant_id: cart_params[:variant_id])

      # COFFEE: if a coffee product is published, add that coffee product to the cart if not already present
      # add the first variant
      coffee_product = Product.find_by(native_type: 'coffee')
      if coffee_product && !@cart.cart_items.find_by(product_id: coffee_product.id)
        @cart.cart_items.create(product_id: coffee_product.id, variant_id: coffee_product.variants.first.id)
      end
    else
      @cart.cart_items.find_by(product_id: product_id).destroy
    end

    if redirect_after_update
      port = ":#{request.port}" unless Rails.env.production? || Rails.env.staging?
      root_url = "#{request.protocol}#{root_domain}#{port}/checkout"
      render json: { redirect_url: root_url }, status: :ok
    else
      render json: @cart, include: { cart_items: { include: :product } }, status: :ok
    end
  end

  private

  def cart_params
    params.require(:cart).permit(:product_public_id, :variant_id, :add_product, :redirect_after_update)
  end
end
