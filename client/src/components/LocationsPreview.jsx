
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  nurseryLocations,
  getLocationAddress,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
  getGoogleMapsDirectionsUrl,
} from "../data/locations";

// =============================================
// NATIVE MAPS SUPPORT
//
// iOS     = Apple Maps
// Android = Installed maps app
// Desktop = Google Maps browser fallback
// =============================================

function getPreferredMapsUrl(location, directions = false) {
  const address = encodeURIComponent(
    getLocationAddress(location)
  );

  if (typeof navigator === "undefined") {
    return directions
      ? getGoogleMapsDirectionsUrl(location)
      : getGoogleMapsUrl(location);
  }

  const userAgent = navigator.userAgent;

  const isIOS =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1);

  const isAndroid = /Android/i.test(userAgent);

  // Apple Maps opens natively on supported iOS devices.
  if (isIOS) {
    return directions
      ? `https://maps.apple.com/?daddr=${address}&dirflg=d`
      : `https://maps.apple.com/?q=${address}`;
  }

  // Android geo: links let the device resolve
  // which installed Maps application to open.
  if (isAndroid) {
    return `geo:0,0?q=${address}`;
  }

  // Desktop fallback.
  return directions
    ? getGoogleMapsDirectionsUrl(location)
    : getGoogleMapsUrl(location);
}

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

// Google Maps stays embedded for the preview.
// It is only mounted after the map becomes visible.
function LazyGoogleMap({ location }) {
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
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden bg-[#eae8df] sm:aspect-[16/10]"
    >
      {shouldLoad ? (
        <iframe
          title={`Google Map of Garibaldo's Nursery in ${location.city}`}
          src={getGoogleMapsEmbedUrl(location)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <PinIcon className="h-9 w-9 text-red-800" />

          <span className="text-sm font-medium text-stone-500">
            Map loads when visible
          </span>
        </div>
      )}
    </div>
  );
}

function LocationCard({ location }) {
  const mapsUrl = getPreferredMapsUrl(location);
  const directionsUrl = getPreferredMapsUrl(
    location,
    true
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
      {/* Location heading */}
      <div className="flex items-center justify-between gap-4 bg-[#faf7ef] px-6 py-6 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-red-800">
            Garibaldo&apos;s Nursery
          </p>

          <h3 className="mt-1 text-2xl font-bold text-stone-900">
            {location.city}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-800 text-white">
          <PinIcon className="h-6 w-6" />
        </div>
      </div>

      {/* Lazy-loaded interactive Google Map */}
      <LazyGoogleMap location={location} />

      <div className="flex flex-1 flex-col px-6 py-7 sm:px-8">
        {/* Address */}
        <div>
          <p className="text-lg font-bold text-stone-900">
            {location.address}
          </p>

          <p className="mt-1 text-sm text-stone-600">
            {location.cityState}
          </p>
        </div>

        {/* Open in the visitor's Maps application */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 transition hover:border-red-800/30 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-800">
            <PinIcon className="h-7 w-7" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-stone-900">
              Open in Maps
            </p>

            <p className="mt-0.5 text-xs text-stone-500">
              View this nursery in your Maps app
            </p>
          </div>

          <ArrowIcon />
        </a>

        {/* Business hours */}
        <div className="mt-7 flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-red-800">
            <ClockIcon />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-stone-900">
              Business Hours
            </p>

            {location.hours?.length > 0 ? (
              <div className="mt-3 space-y-2">
                {location.hours.map((entry) => (
                  <div
                    key={entry.days}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-stone-600"
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
          <p className="mb-4 font-semibold text-stone-900">
            Contact This Nursery
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {location.officePhoneHref && (
              <a
                href={location.officePhoneHref}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#faf7ef] p-4 transition hover:border-red-800/30 hover:bg-red-50"
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
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-[#faf7ef] p-4 transition hover:border-red-800/30 hover:bg-red-50"
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

        {/* Visiting information */}
        {location.visitNote && (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
            {location.visitNote}
          </p>
        )}

        {/* Native Maps directions */}
        <div className="mt-auto pt-8">
          {location.directionsEnabled ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            >
              <NavigationIcon />
              Get Directions
            </a>
          ) : (
            <p className="rounded-xl bg-stone-100 px-4 py-3 text-center text-sm text-stone-600">
              Confirm public visiting access before
              requesting directions.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function LocationsPreview() {
  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="bg-[#f7f2e8] px-6 py-20 sm:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-800">
            Come Visit Us
          </p>

          <h2
            id="locations-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl"
          >
            Find Your Way to Garibaldo&apos;s
          </h2>

          <p className="mt-5 text-base leading-relaxed text-stone-600 md:text-lg">
            Discover beautiful plants, gardening supplies,
            and everything you need for your next project.
            Find our locations and plan your visit.
          </p>
        </div>

        {/* Two Google Maps previews */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {nurseryLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
            />
          ))}
        </div>

        {/* Dedicated locations page */}
        <div className="mt-12 text-center">
          <Link
            to="/locations"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 border-red-800 px-8 py-3 font-semibold text-red-800 transition hover:bg-red-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800"
          >
            View All Locations
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
