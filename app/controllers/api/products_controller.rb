class Api::ProductsController < Api::BaseController
  before_action :authenticate_user!,
                only: [:create, :update, :destroy]

  before_action :require_admin!,
                only: [:create, :update, :destroy]

  before_action :set_product,
                only: [:show, :update, :destroy]

  def index
    products =
      if current_user&.admin?
        Product.newest_first
      else
        Product.active.newest_first
      end

    render json: {
      products: products.map { |product| serialize_product(product) }
    }
  end

  def show
    if !@product.active? && !current_user&.admin?
      render json: {
        code: "PRODUCT_NOT_FOUND",
        error: "Product not found."
      }, status: :not_found

      return
    end

    render json: {
      product: serialize_product(@product)
    }
  end

  def create
    product = Product.new(product_params)

    if product.save
      render json: {
        message: "Product created successfully.",
        product: serialize_product(product)
      }, status: :created
    else
      render json: {
        code: "VALIDATION_ERROR",
        errors: product.errors.to_hash(true)
      }, status: :unprocessable_entity
    end
  end

  def update
    old_image_public_id = @product.image_public_id

    if @product.update(product_params)
      remove_replaced_cloudinary_image(
        old_image_public_id,
        @product.image_public_id
      )

      render json: {
        message: "Product updated successfully.",
        product: serialize_product(@product)
      }
    else
      render json: {
        code: "VALIDATION_ERROR",
        errors: @product.errors.to_hash(true)
      }, status: :unprocessable_entity
    end
  end

  def destroy
    image_public_id = @product.image_public_id

    @product.destroy!

    remove_cloudinary_image(image_public_id)

    render json: {
      message: "Product deleted successfully."
    }
  rescue ActiveRecord::RecordNotDestroyed
    render json: {
      code: "DELETE_FAILED",
      error: "The product could not be deleted."
    }, status: :unprocessable_entity
  end

  private

  def set_product
    @product = Product.find_by(id: params[:id])

    return if @product.present?

    render json: {
      code: "PRODUCT_NOT_FOUND",
      error: "Product not found."
    }, status: :not_found
  end

  def product_params
    params.permit(
      :name,
      :category,
      :price,
      :quantity,
      :description,
      :active,
      :image_url,
      :image_public_id
    )
  end

  def remove_replaced_cloudinary_image(
    old_public_id,
    new_public_id
  )
    return if old_public_id.blank?
    return if old_public_id == new_public_id

    remove_cloudinary_image(old_public_id)
  end

  def remove_cloudinary_image(public_id)
    return if public_id.blank?

    Cloudinary::Uploader.destroy(
      public_id,
      resource_type: "image",
      invalidate: true
    )
  rescue StandardError => error
    Rails.logger.error(
      "Cloudinary image deletion failed for #{public_id}: #{error.message}"
    )
  end

  def serialize_product(product)
    {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.to_s,
      quantity: product.quantity,
      description: product.description,
      active: product.active,
      image_url: product.image_url,
      image_public_id: product.image_public_id,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
  end
end