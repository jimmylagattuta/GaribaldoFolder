
import { useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../lib/api";
import { nurseryContact } from "../data/locations";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "General Inquiry",
  message: "",
  website: "",
};

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Plant Availability",
  "Pricing & Products",
  "Landscaping & Projects",
  "Other",
];

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M6.5 3.5 10 7l-2 3a15 15 0 0 0 6 6l3-2 3.5 3.5-2 3c-.5.8-1.5 1.2-2.4 1C9.1 20 4 14.9 2.5 7.9c-.2-.9.2-1.9 1-2.4l3-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function ContactPhoneCard({
  label,
  number,
  href,
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm transition hover:border-red-800/30 hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-800">
        <PhoneIcon />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
          {label}
        </span>

        <span className="mt-1 block text-lg font-bold text-stone-900 sm:text-xl">
          {number}
        </span>
      </span>

      <span className="shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-red-800">
        <ArrowIcon />
      </span>
    </a>
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

    // Honeypot field for simple bot filtering.
    // The backend must also enforce spam protections.
    if (form.website.trim()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject,
      message: form.message.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.message
    ) {
      setStatus({
        type: "error",
        message: "Please complete all required fields.",
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
          "We couldn't send your message. Please try again or give us a call.";

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
          "Thank you! Your message has been submitted successfully. We'll be in touch soon.",
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
          "We couldn't send your message. Please try again or give us a call.",
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
      <div className="mx-auto max-w-[1200px]">
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
            Have a question about plants, pricing,
            availability, or your next gardening project?
            We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact details and form */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Left column */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-800">
                Call Our Team
              </p>

              <h3 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
                Let&apos;s Talk Plants.
              </h3>

              <p className="mt-4 leading-7 text-stone-600">
                Whether you&apos;re looking for a
                specific plant or planning a larger
                project, our team is happy to help.
              </p>
            </div>

            {/* Office number */}
            <ContactPhoneCard
              label="Office Phone"
              number={nurseryContact.office}
              href={nurseryContact.officeHref}
            />

            {/* Cell number */}
            <ContactPhoneCard
              label="Cell Phone"
              number={nurseryContact.cell}
              href={nurseryContact.cellHref}
            />

            {/* Visit locations */}
            <div className="rounded-2xl border border-red-900/10 bg-[#f7f2e8] px-6 py-6">
              <h3 className="text-lg font-bold text-stone-900">
                Prefer to Visit in Person?
              </h3>

              <p className="mt-3 text-sm leading-7 text-stone-600">
                Stop by one of our nursery locations
                in Bellflower or Lakewood to explore
                our selection.
              </p>

              <Link
                to="/locations"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-red-800 transition hover:text-red-950"
              >
                View Our Locations
                <ArrowIcon />
              </Link>
            </div>
          </div>

          {/* Right column: contact form */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-800">
                <MailIcon />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-stone-900">
                  Send Us a Message
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  We&apos;ll get back to you as soon as we can.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Honeypot: invisible to actual visitors */}
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
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className={labelClasses}
                  >
                    Full Name *
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
                    placeholder="Your full name"
                    className={inputClasses}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className={labelClasses}
                  >
                    Email Address *
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

              {/* Phone */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className={labelClasses}
                >
                  Phone Number{" "}
                  <span className="font-normal text-stone-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  maxLength={30}
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="(555) 123-4567"
                  className={inputClasses}
                  disabled={isSubmitting}
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className={labelClasses}
                >
                  What Can We Help With?
                </label>

                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={(event) =>
                    updateField(
                      "subject",
                      event.target.value
                    )
                  }
                  className={inputClasses}
                  disabled={isSubmitting}
                >
                  {SUBJECT_OPTIONS.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className={labelClasses}
                >
                  Your Message *
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value
                    )
                  }
                  placeholder="Tell us what you're looking for or how we can help..."
                  className={`${inputClasses} min-h-[150px] resize-y`}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submission status */}
              {status && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
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
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowIcon />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-stone-500">
                Please don&apos;t include sensitive
                personal information in your message.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
