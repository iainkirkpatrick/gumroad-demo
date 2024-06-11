class UserContentController < ApplicationController
  layout "user_content"

  def index
    # example user data, including all products
    @user = {
      name: "testuser",
      products: Product.all
    }
  end
end