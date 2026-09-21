class Product < ApplicationRecord
  validates :name, presence: true
  validates :category, presence: true

  validates :price,
            presence: true,
            numericality: { greater_than_or_equal_to: 0 }

  validates :quantity,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }

  scope :active, -> { where(active: true) }
  scope :newest_first, -> { order(created_at: :desc) }
end