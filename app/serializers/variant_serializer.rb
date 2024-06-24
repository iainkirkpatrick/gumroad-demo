class VariantSerializer < ActiveModel::Serializer
  attributes :public_id, :name, :price, :description, :rich_content, :created_at, :updated_at, :product_public_id

  def product_public_id
    object.product.public_id
  end
end
