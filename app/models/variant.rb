class Variant < ApplicationRecord
  belongs_to :product

  validates :public_id, presence: true
  validates :product_id, presence: true
end
