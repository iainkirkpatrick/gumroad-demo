class ProductsController < ApplicationController
  before_action :ensure_json_request, only: :update

  def index
    @products_by_native_type = Product.all.group_by(&:native_type)
  end

  def show
    @product = Product.find_by!(public_id: params[:public_id])
  end

  def edit
    @product = Product.includes(:variants).find_by!(public_id: params[:public_id])
    puts "Product: #{@product.inspect}"
    puts "Variants: #{@product.variants.inspect}"
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

  private

  def ensure_json_request
    return if request.format.json?
    render nothing: true, status: :not_acceptable
  end

  def new_product_params
    product_params = params.require(:product).permit(:name, :description, :native_type, :price_currency_type, :price_range, :is_physical, :is_recurring_billing, tiers: [:public_id, :name, :price])
    product_params.except(:tiers)
  end

  def update_product_params
    product_params = params.require(:product).permit(:name, :description, :native_type, :price_currency_type, :price_range, :is_physical, :is_recurring_billing, :is_published, tiers: [:public_id, :name, :price])
    # handle permitting rich_content as an unspecified hash
    product_params[:rich_content] = params[:product][:rich_content].permit! if params[:product][:rich_content].is_a?(ActionController::Parameters)
    product_params.except(:tiers)
  end

  def update_variants
    variants_data = params[:product][:tiers] ||= []
    variants_data.each do |_, variant_data|
      puts "variant_data, #{variant_data.inspect}"
      variant = @product.variants.find_or_initialize_by(public_id: variant_data[:public_id])
      variant.update(variant_data.permit(:public_id, :name, :price))
    end
  end
end
