class UserContentController < ApplicationController
  layout :select_layout
  
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

  private

  def select_layout
    case action_name
    when "index"
      "user_home"
    else
      "user_content"
    end
  end
end