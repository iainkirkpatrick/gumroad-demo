class ProductSerializer < ActiveModel::Serializer
  attributes :name, :public_id, :native_type, :description, :price_range, :price_currency_type, :rich_content, :is_physical, :is_published, :created_at, :updated_at, :call_link, :thanks_message

  has_many :tiers, serializer: VariantSerializer

  def tiers
    object.variants
  end
end