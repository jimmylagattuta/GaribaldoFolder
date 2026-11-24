
import { nurseryLocations } from "../../data/locations";

const SITE_URL = "https://www.garibaldosnursery.com";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Convert "Tuesday – Sunday" into individual day names.
function parseDays(value) {
  const normalized = value
    .replace(/[–—]/g, "-")
    .trim();

  const parts = normalized
    .split("-")
    .map((part) => part.trim());

  if (parts.length === 1) {
    return DAYS.includes(parts[0])
      ? [parts[0]]
      : [];
  }

  if (parts.length !== 2) return [];

  const start = DAYS.indexOf(parts[0]);
  const end = DAYS.indexOf(parts[1]);

  if (start === -1 || end === -1) return [];

  const result = [];
  let index = start;

  do {
    result.push(DAYS[index]);

    if (index === end) break;

    index = (index + 1) % DAYS.length;
  } while (index !== start);

  return result;
}

// Convert 8:00 AM into 08:00.
function to24Hour(hour, minute, period) {
  let hours = Number(hour);

  if (period.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minute}`;
}

// Convert displayed hours to Schema.org hours.
function getOpeningHours(location) {
  return (location.hours || []).flatMap((entry) => {
    if (/closed/i.test(entry.time)) {
      return [];
    }

    const match = entry.time.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)\s*[-–—]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );

    if (!match) return [];

    const days = parseDays(entry.days);

    if (!days.length) return [];

    return [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens: to24Hour(match[1], match[2], match[3]),
      closes: to24Hour(match[4], match[5], match[6]),
    }];
  });
}

// Extract city, state and ZIP from existing cityState.
function getPostalAddress(location) {
  const match = location.cityState.match(
    /^(.+?),\s*([A-Z]{2})\s+(\d{5})(?:-\d{4})?$/
  );

  return {
    "@type": "PostalAddress",
    streetAddress: location.address,
    addressLocality: match?.[1] || location.city,
    addressRegion: match?.[2] || "CA",
    postalCode: match?.[3],
    addressCountry: "US",
  };
}

function buildLocationSchema(location) {
  const locationUrl =
    `${SITE_URL}/locations#${location.id}`;

  return {
    "@type": "Store",
    "@id": locationUrl,
    name: `${location.name} - ${location.city}`,
    url: locationUrl,
    description:
      `Garibaldo's Nursery in ${location.city}, California. ` +
      "Plants, nursery products, and gardening essentials.",
    telephone: location.phoneHref
      ? location.phoneHref.replace(/^tel:/, "")
      : location.phone,
    address: getPostalAddress(location),
    openingHoursSpecification: getOpeningHours(location),
    hasMap:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        [
          location.address,
          location.cityState,
          location.country,
        ].join(", ")
      ),
  };
}

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": nurseryLocations.map(buildLocationSchema),
  };

  // Escape "<" to prevent JSON-LD content from
  // being interpreted as HTML.
  const json = JSON.stringify(schema).replace(
    /</g,
    "\\u003c"
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
