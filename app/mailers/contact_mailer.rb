
class ContactMailer < ApplicationMailer
  def inquiry(name:, email:, phone:, subject:, message:)
    @name = name
    @email = email
    @phone = phone
    @subject = subject
    @message = message

    mail(
      from: ENV.fetch(
        "CONTACT_EMAIL_FROM",
        "jimmy.lagattuta@gmail.com"
      ),
      to: ENV.fetch(
        "CONTACT_EMAIL_TO",
        "garibaldosnursery@gmail.com"
      ),
      cc: ENV.fetch(
        "CONTACT_EMAIL_CC",
        "jimmy.lagattuta@gmail.com"
      ),
      reply_to: @email,
      subject: "Garibaldo's Nursery Inquiry: #{@subject}",
      body: <<~BODY
        NEW WEBSITE INQUIRY
        Garibaldo's Nursery
        ----------------------------------------

        Customer Name:
        #{@name}

        Email:
        #{@email}

        Phone:
        #{@phone.presence || "Not provided"}

        Inquiry Type:
        #{@subject}

        Message:
        #{@message}

        ----------------------------------------

        This inquiry was submitted through
        Garibaldo's Nursery's website.

        Click Reply to respond directly
        to the customer.
      BODY
    )
  end
end
