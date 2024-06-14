class Purchase < ApplicationRecord
  belongs_to :product

  validates :public_id, presence: true
  validates :product_id, presence: true

  before_validation :set_public_id, on: :create

  def set_public_id
    self.public_id = SecureRandom.alphanumeric(6)
  end
end
