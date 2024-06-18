class Variant < ApplicationRecord
  belongs_to :product

  validates :public_id, presence: true
  validates :product_id, presence: true

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
end
