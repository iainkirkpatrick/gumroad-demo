class Product < ApplicationRecord
  before_create :generate_public_id
  validates :name, presence: true, length: { maximum: 255 }

  has_many :variants, dependent: :destroy

  def rich_content=(value)
    super(value.is_a?(String) ? value : value.to_json)
  end

  def rich_content
    JSON.parse(super || '{}')
  end

  def to_product_with_tiers
    product_json = self.as_json(include: :variants)
    product_json['tiers'] = product_json['variants']
    product_json.delete('variants')
    product_json
  end

  private

  # N.B. would check against existing public product ids associated with a user
  def generate_public_id
    self.public_id = SecureRandom.alphanumeric(6)
  end
end
