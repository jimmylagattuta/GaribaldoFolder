class Api::BaseController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :set_current_user

  attr_reader :current_user

  private

  def set_current_user
    @current_user = nil

    token = bearer_token
    return if token.blank?

    payload = JsonWebToken.decode(token)
    return if payload.blank?

    @current_user = User.find_by(id: payload[:user_id])
  end

  def authenticate_user!
    return if current_user.present?

    render json: {
      code: "UNAUTHORIZED",
      error: "You must be signed in."
    }, status: :unauthorized
  end

  def require_admin!
    return if current_user&.admin?

    render json: {
      code: "FORBIDDEN",
      error: "Admin access required."
    }, status: :forbidden
  end

  def bearer_token
    header = request.headers["Authorization"]
    return if header.blank?

    scheme, token = header.split(" ", 2)

    return unless scheme&.casecmp("Bearer")&.zero?

    token
  end
end