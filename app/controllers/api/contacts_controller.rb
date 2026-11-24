
# app/controllers/contacts_controller.rb
class Api::ContactsController < Api::BaseController
  # Limit how frequently an IP address can
  # submit the contact form.
  #
  # Requires Rails 8+ for rate_limit.
  # For Rails 7, use Rack::Attack instead.

  if respond_to?(:rate_limit)
    rate_limit to: 5,
               within: 1.hour,
               only: :create,
               by: -> { request.remote_ip },
               with: -> {
                 render json: {
                   error: "Too many messages. Please try again later."
                 }, status: :too_many_requests
               }
  end

  def create
    # Basic honeypot spam protection.
    # Legitimate visitors never fill this field.
    if params[:website].present?
      return render json: {
        success: true
      }, status: :ok
    end

    name = params[:name].to_s.strip
    email = params[:email].to_s.strip
    phone = params[:phone].to_s.strip
    subject = params[:subject].presence || "General Inquiry"
    message = params[:message].to_s.strip

    # Validate the submitted contact information.
    if name.blank? ||
       name.length > 120 ||
       email.blank? ||
       email.length > 254 ||
       !URI::MailTo::EMAIL_REGEXP.match?(email) ||
       phone.length > 30 ||
       subject != "General Inquiry" ||
       message.blank? ||
       message.length > 5000

      return render json: {
        success: false,
        error: "Please check your information and try again."
      }, status: :unprocessable_entity
    end

    # Deliver notification using the existing
    # ContactMailer and production Gmail SMTP.
    ContactMailer.inquiry(
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message
    ).deliver_now

    render json: {
      success: true,
      message: "Your message was sent successfully."
    }, status: :ok

  rescue StandardError => error
    Rails.logger.error(
      "[Contact Form] Delivery failed: #{error.class}"
    )

    render json: {
      success: false,
      error: "We couldn't send your message. Please try again later."
    }, status: :service_unavailable
  end
end
