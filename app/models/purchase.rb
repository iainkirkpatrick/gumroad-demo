class Purchase < ApplicationRecord
  belongs_to :product

  before_validation :set_public_id, on: :create

  def set_public_id
    self.public_id ||= SecureRandom.uuid
  end
end
