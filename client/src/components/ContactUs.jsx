
import { useState } from "react";

import { apiRequest } from "../lib/api";

const INITIAL_FORM = {
  name: "",
  email: "",
  message: "",
  website: "",
};

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactUs() {
  const [form, setForm] = useState(INITIAL_FORM);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] = useState(null);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (status) {
      setStatus(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setStatus(null);

    // Basic bot filtering.
    // Server-side rate limiting is still required.
    if (form.website.trim()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: "",
      subject: "General Inquiry",
      message: form.message.trim(),
      website: form.website,
    };

    if (
      !payload.name ||
      !payload.email ||
      payload.message.length < 10
    ) {
      setStatus({
        type: "error",
        message:
          "Please enter your name, email, and a message of at least 10 characters.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage =
          "We couldn't send your message. Please try again.";

        try {
          const data = await response.json();

          if (
            typeof data.error === "string" &&
            data.error
          ) {
            errorMessage = data.error;
          }
        } catch {
          // Use the general error message.
        }

        throw new Error(errorMessage);
      }

      setStatus({
        type: "success",
        message:
          "Thank you! Your message has been sent successfully. We'll get back to you as soon as possible.",
      });

      setForm({ ...INITIAL_FORM });
    } catch (error) {
      console.error(
        "Contact form submission failed:",
        error
      );

      setStatus({
        type: "error",
        message:
          error.message ||
          "We couldn't send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full min-h-12 rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-red-800 focus:ring-2 focus:ring-red-800/10";

  const labelClasses =
    "mb-2 block text-sm font-semibold text-stone-800";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-[#fffdf8] px-6 py-20 sm:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[900px]">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-800">
            We&apos;re Here to Help
          </p>

          <h2
            id="contact-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl"
          >
            Get in Touch
          </h2>

          <p className="mt-5 text-base leading-relaxed text-stone-600 md:text-lg">
            Looking for a specific plant? Have a question
            about pricing, availability, or your next
            gardening project? Send us a message.
            We&apos;d love to hear from you!
          </p>
        </div>

        {/* Centered contact form */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg shadow-stone-900/5 sm:mt-12">
          {/* Form heading */}
          <div className="border-b border-stone-100 bg-[#faf7ef] px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-800">
                <MailIcon />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-900 sm:text-2xl">
                  Send Us a Message
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-stone-600">
                  Fill out the form below and
                  we&apos;ll be in touch.
                </p>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-8 sm:px-10 sm:py-10"
          >
            {/* Honeypot field */}
            <div
              className="absolute -left-[9999px]"
              aria-hidden="true"
            >
              <label htmlFor="contact-website">
                Website
              </label>

              <input
                id="contact-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) =>
                  updateField(
                    "website",
                    event.target.value
                  )
                }
              />
            </div>

            {/* Name and email */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className={labelClasses}
                >
                  Your Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Full name"
                  className={inputClasses}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className={labelClasses}
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className={inputClasses}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className={labelClasses}
              >
                Your Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                value={form.message}
                onChange={(event) =>
                  updateField(
                    "message",
                    event.target.value
                  )
                }
                placeholder="Tell us what you're looking for or how we can help..."
                className={`${inputClasses} min-h-[180px] resize-y`}
                disabled={isSubmitting}
              />
            </div>

            {/* Submission status */}
            {status && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl border px-5 py-4 text-sm leading-6 ${
                  status.type === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {status.message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-red-800 px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-red-900 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />

                  Sending Message...
                </>
              ) : (
                <>
                  Send Message
                  <ArrowIcon />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-relaxed text-stone-500">
              Your information is used only to respond
              to your inquiry. Please don&apos;t include
              sensitive personal information.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
