class Api::AuthController < Api::BaseController
  before_action :authenticate_user!, only: [:me]

  def register
    user = User.new(register_params)
    user.role = "user"

    if user.save
      render json: {
        token: JsonWebToken.encode(user_id: user.id),
        user: serialize_user(user)
      }, status: :created
    else
      render json: {
        code: "VALIDATION_ERROR",
        errors: user.errors.to_hash(true)
      }, status: :unprocessable_entity
    end
  end

  def login
    login_value = params[:login].to_s.strip.downcase
    password = params[:password].to_s

    if login_value.blank?
      render json: {
        code: "LOGIN_REQUIRED",
        error: "Username or email is required."
      }, status: :unprocessable_entity

      return
    end

    if password.blank?
      render json: {
        code: "PASSWORD_REQUIRED",
        error: "Password is required."
      }, status: :unprocessable_entity

      return
    end

    user = User.find_by("LOWER(username) = ? OR LOWER(email) = ?", login_value, login_value)

    unless user
      render json: {
        code: "USER_NOT_FOUND",
        error: "We couldn't find an account with that username or email."
      }, status: :unauthorized

      return
    end

    unless user.authenticate(password)
      render json: {
        code: "INVALID_PASSWORD",
        error: "That password is incorrect."
      }, status: :unauthorized

      return
    end

    expiration =
      if ActiveModel::Type::Boolean.new.cast(params[:remember_me])
        30.days.from_now
      else
        24.hours.from_now
      end

    token = JsonWebToken.encode(
      { user_id: user.id },
      expiration
    )

    render json: {
      token: token,
      user: serialize_user(user)
    }
  end

  def me
    render json: {
      user: serialize_user(current_user)
    }
  end

  def logout
    render json: {
      message: "Signed out successfully."
    }
  end

  private

  def register_params
    params.permit(
      :first_name,
      :last_name,
      :username,
      :email,
      :password,
      :password_confirmation
    )
  end

  def serialize_user(user)
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role
    }
  end
end