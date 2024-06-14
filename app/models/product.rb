class Product < ApplicationRecord
  validates :name, presence: true, length: { maximum: 255 }
  validates :public_id, presence: true
  validates :native_type, presence: true

  before_validation :set_public_id, on: :create

  has_many :variants, dependent: :destroy

  enum native_type: { digital: 0, course: 1, ebook: 2, membership: 3, physical: 4, bundle: 5, coffee: 6, commissions: 7, calls: 8 }

  def rich_content=(value)
    if value.nil?
      super('{}')
    elsif value.is_a?(String)
      super(value)
    else
      super(value.to_json)
    end
  end

  def rich_content
    raw_content = super
    raw_content.present? ? JSON.parse(raw_content) : {}
  end


  def to_product_with_tiers
    product_json = self.as_json(include: :variants)
    product_json['tiers'] = product_json['variants']
    product_json.delete('variants')
    product_json
  end

  private

  # N.B. would check against existing public product ids associated with a user
  def set_public_id
    self.public_id = SecureRandom.alphanumeric(6)
  end
end
