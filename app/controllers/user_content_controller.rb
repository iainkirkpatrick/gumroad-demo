class UserContentController < ApplicationController
  layout "user_content"

  def index
    # example user data, including all products
    @user = {
      name: "testuser",
      products: Product.all
    }
  end

  def show
    purchase = Purchase.find_by!(public_id: params[:public_id])
    @product = purchase.product
  end
end