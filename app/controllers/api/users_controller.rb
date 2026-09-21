class Api::UsersController < Api::BaseController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update]
  before_action :authorize_user_access!, only: [:show, :update]

  def show
    render json: {
      user: serialize_user(@user)
    }
  end

  def update
    if @user.update(user_update_params)
      render json: {
        message: "Account updated successfully.",
        user: serialize_user(@user)
      }
    else
      render json: {
        code: "VALIDATION_ERROR",
        errors: @user.errors.to_hash(true)
      }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])

    return if @user.present?

    render json: {
      code: "USER_NOT_FOUND",
      error: "User not found."
    }, status: :not_found
  end

  def authorize_user_access!
    return if performed?
    return if current_user.admin?
    return if current_user.id == @user.id

    render json: {
      code: "FORBIDDEN",
      error: "You do not have permission to access this account."
    }, status: :forbidden
  end

  def user_update_params
    permitted = params.permit(
      :first_name,
      :last_name,
      :username,
      :email,
      :password,
      :password_confirmation
    )

    if current_user.admin?
      permitted[:role] = params[:role] if params[:role].present?
    end

    permitted
  end

  def serialize_user(user)
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  end
end