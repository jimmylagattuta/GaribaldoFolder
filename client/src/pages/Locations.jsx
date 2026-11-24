
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  nurseryLocations,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
  getGoogleMapsDirectionsUrl,
} from "../data/locations";

// Replace with a Garibaldo's Cloudinary image when ready.
const LOCATIONS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=85";

const GOOGLE_MAPS_ICON =
  "https://www.gstatic.com/images/branding/product/2x/maps_96dp.png";

function PinIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7v5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
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

// Mount each Google Map only when the visitor scrolls near it.
function LazyLocationMap({ location }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const element = containerRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "150px 0px",
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#eae8df] sm:aspect-[16/9]"
    >
      {shouldLoad ? (
        <iframe
          title={`Google Map of Garibaldo's Nursery in ${location.city}`}
          src={getGoogleMapsEmbedUrl(location)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <PinIcon className="h-10 w-10 text-red-800" />
          <span className="text-sm font-medium text-stone-500">
            Map loads as you scroll
          </span>
        </div>
      )}
    </div>
  );
}

function LocationSection({ location, index }) {
  const mapsUrl = getGoogleMapsUrl(location);
  const directionsUrl =
    getGoogleMapsDirectionsUrl(location);

  return (
    <article
      id={location.id}
      className="scroll-mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Large interactive map */}
        <div className="p-4 sm:p-6">
          <LazyLocationMap location={location} />

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 transition hover:border-red-800/30 hover:bg-red-50"
          >
            <img
              src={GOOGLE_MAPS_ICON}
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              alt=""
              className="h-12 w-12 shrink-0 object-contain"
            />

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stone-900">
                Open in Google Maps
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Explore the neighborhood and location
              </p>
            </div>

            <ArrowIcon />
          </a>
        </div>

        {/* Store information */}
        <div className="flex flex-col p-6 sm:p-8 lg:py-10 lg:pr-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">
            Location {String(index + 1).padStart(2, "0")}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {location.city}
          </h2>

          <p className="mt-2 text-stone-600">
            Garibaldo&apos;s Nursery
          </p>

          {/* Address */}
          <div className="mt-8 flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-red-800">
              <PinIcon />
            </span>

            <div>
              <h3 className="font-bold text-stone-900">
                Address
              </h3>

              <p className="mt-1 text-stone-600">
                {location.address}
              </p>

              <p className="text-stone-600">
                {location.cityState}
              </p>
            </div>
          </div>

          {/* Business hours */}
          <div className="mt-7 flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-red-800">
              <ClockIcon />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-stone-900">
                Business Hours
              </h3>

              {location.hours?.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {location.hours.map((entry) => (
                    <div
                      key={entry.days}
                      className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm text-stone-600"
                    >
                      <span>{entry.days}</span>
                      <span className="font-medium text-stone-800">
                        {entry.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-stone-600">
                  {location.hoursNote ||
                    "Call to confirm current hours."}
                </p>
              )}
            </div>
          </div>

          {/* Office and cell phone numbers */}
          <div className="mt-7 border-t border-stone-100 pt-6">
            <h3 className="font-bold text-stone-900">
              Contact This Nursery
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {location.officePhoneHref && (
                <a
                  href={location.officePhoneHref}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#faf7ef] px-4 py-4 transition hover:border-red-800/30 hover:bg-red-50"
                  aria-label={`Call office at ${location.officePhone}`}
                >
                  <span className="shrink-0 text-red-800">
                    <PhoneIcon />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Office
                    </span>
                    <span className="block text-sm font-bold text-stone-900">
                      {location.officePhone}
                    </span>
                  </span>
                </a>
              )}

              {location.cellPhoneHref && (
                <a
                  href={location.cellPhoneHref}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#faf7ef] px-4 py-4 transition hover:border-red-800/30 hover:bg-red-50"
                  aria-label={`Call cell phone at ${location.cellPhone}`}
                >
                  <span className="shrink-0 text-red-800">
                    <PhoneIcon />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Cell
                    </span>
                    <span className="block text-sm font-bold text-stone-900">
                      {location.cellPhone}
                    </span>
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Visiting note */}
          {location.visitNote && (
            <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              {location.visitNote}
            </p>
          )}

          {/* Driving directions */}
          <div className="mt-auto pt-9">
            {location.directionsEnabled ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-lg"
              >
                <NavigationIcon />
                Get Driving Directions
              </a>
            ) : (
              <p className="rounded-xl bg-stone-100 p-4 text-center text-sm text-stone-600">
                Please confirm visiting access before requesting directions.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Locations() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Nursery Locations & Directions | Garibaldo's Nursery";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      {/* Photo hero */}
      <section className="relative isolate flex min-h-[420px] items-center justify-center overflow-hidden bg-stone-900 px-6 py-20 text-center sm:min-h-[480px] md:min-h-[560px]">
        {/* Background photograph */}
        <img
          src={LOCATIONS_HERO_IMAGE}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />

        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/90">
            Come Visit Us
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">
            Our Locations
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/95 drop-shadow-sm">
            Find Garibaldo&apos;s Nursery, explore our
            locations on Google Maps, and get driving
            directions for your next visit.
          </p>

          {/* Quick location navigation */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {nurseryLocations.map((location) => (
              <a
                key={location.id}
                href={`#${location.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/60 bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <PinIcon />
                {location.city}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Individual nursery locations */}
      <section className="px-6 py-14 sm:px-10 md:py-20">
        <div className="mx-auto flex max-w-[1250px] flex-col gap-10">
          {nurseryLocations.map((location, index) => (
            <LocationSection
              key={location.id}
              location={location}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="bg-[#fffdf8] px-6 py-16 text-center sm:px-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Ready to Find Your Next Favorite Plant?
          </h2>

          <p className="mt-4 leading-relaxed text-stone-600">
            Browse our nursery offerings and discover
            something beautiful for your home or garden.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-red-800 px-8 py-3.5 font-semibold text-white transition hover:bg-red-900"
          >
            Explore Our Plants
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
