class PurchasesController < ApplicationController
  def create
    product_public_ids = purchase_params[:product_public_ids]
    purchases = []

    Product.transaction do
      product_public_ids.each do |public_id|
        product = Product.find_by(public_id: public_id)
        if product
          purchases << Purchase.create!(product: product)
        else
          raise ActiveRecord::RecordNotFound, "Product with public_id #{public_id} not found"
        end
      end
    end

    
    render json: purchases, status: :ok
  end

  private

  def purchase_params
    params.require(:purchase).permit(product_public_ids: [])
  end
end
