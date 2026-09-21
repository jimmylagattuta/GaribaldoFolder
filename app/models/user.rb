class User < ApplicationRecord
  has_secure_password

  ROLES = %w[user admin].freeze

  validates :first_name, presence: true

  validates :username,
            presence: true,
            uniqueness: { case_sensitive: false },
            length: { minimum: 3, maximum: 30 },
            format: {
              with: /\A[a-zA-Z0-9_.-]+\z/,
              message: "can only contain letters, numbers, periods, underscores, and hyphens"
            }

  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: {
              with: URI::MailTo::EMAIL_REGEXP,
              message: "is not valid"
            }

  validates :role,
            presence: true,
            inclusion: { in: ROLES }

  before_validation :normalize_username
  before_validation :normalize_email
  before_validation :set_default_role, on: :create

  def admin?
    role == "admin"
  end

  def user?
    role == "user"
  end

  def full_name
    [first_name, last_name].compact_blank.join(" ")
  end

  private

  def normalize_username
    self.username = username.to_s.strip.downcase
  end

  def normalize_email
    self.email = email.to_s.strip.downcase
  end

  def set_default_role
    self.role ||= "user"
  end
end