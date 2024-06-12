class ProductsController < ApplicationController
  before_action :ensure_json_request, only: :update
  layout :select_layout

  def index
    @products_by_native_type = Product.includes(:variants).all.group_by(&:native_type)
  end


  def edit
    @product = Product.includes(:variants).find_by!(public_id: params[:public_id])
  end

  def update
    @product = Product.find_by!(public_id: params[:public_id])
    if @product.update(update_product_params)
      update_variants
      render json: @product, include: :variants, status: :ok
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def new
  end

  def create
    @product = Product.new(new_product_params)
    if @product.save
      update_variants
      redirect_to edit_product_path(@product.public_id)
    else
      render :new
    end
  end

  # show route used when viewing product under user subdomain
  def show
    @product = Product.find_by!(public_id: params[:public_id])
    # example user data, including all products
    @user = {
      name: "testuser",
      products: Product.all
    }
    # demo: find the first cart record (or create one) that is shared by all demo users
    @cart = Cart.first_or_create
  end

  private

  def ensure_json_request
    return if request.format.json?
    render nothing: true, status: :not_acceptable
  end

  def new_product_params
    product_params = params.require(:product).permit(:name, :description, :native_type, :price_currency_type, :price_range, :is_physical, :is_recurring_billing, :thanks_message, tiers: [:public_id, :name, :price])
    product_params.except(:tiers)
  end

  def update_product_params
    product_params = params.require(:product).permit(:id, :name, :description, :native_type, :price_currency_type, :price_range, :is_physical, :is_recurring_billing, :is_published, :rich_content, :thanks_message, :call_link, tiers: [:public_id, :name, :price])
    # handle permitting rich_content as an unspecified hash
    product_params[:rich_content] = params[:product][:rich_content].permit! if params[:product][:rich_content].is_a?(ActionController::Parameters)
    product_params.except(:tiers)
  end

  def update_variants
    variants_data = params[:product][:tiers] ||= []

    # params to array
    if variants_data.is_a?(ActionController::Parameters)
      variants_data = variants_data.values
    end
    
    variants_data.each do |variant_data|
      puts "variant_data: #{variant_data}"
      variant = @product.variants.find_or_initialize_by(public_id: variant_data[:public_id])
      variant.update(variant_data.permit(:public_id, :name, :price))
    end
  end

  def select_layout
    case action_name
    when "show"
      "user_content"
    else
      "application"
    end
  end
end
