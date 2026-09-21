class Api::UploadsController < Api::BaseController
  before_action :authenticate_user!
  before_action :require_admin!

  def signature
    timestamp = Time.now.to_i

    params_to_sign = {
      timestamp: timestamp,
      folder: "garibaldos/products"
    }

    signature = Cloudinary::Utils.api_sign_request(
      params_to_sign,
      ENV.fetch("CLOUDINARY_API_SECRET")
    )

    render json: {
      timestamp: timestamp,
      signature: signature,
      api_key: ENV.fetch("CLOUDINARY_API_KEY"),
      cloud_name: ENV.fetch("CLOUDINARY_CLOUD_NAME"),
      folder: "garibaldos/products"
    }
  end
end