
export const nurseryLocations = [
  {
    id: "bellflower",
    name: "Garibaldo's Nursery",
    city: "Bellflower",
    address: "8834 Rose Street",
    cityState: "Bellflower, CA 90706",
    country: "USA",

    // Contact information
    phone: "(562) 630-6240",
    phoneHref: "tel:+15626306240",

    officePhone: "(562) 630-6240",
    officePhoneHref: "tel:+15626306240",

    cellPhone: "(562) 382-7956",
    cellPhoneHref: "tel:+15623827956",

    // Confirmed business hours
    hours: [
      {
        days: "Monday",
        time: "Closed",
      },
      {
        days: "Tuesday – Friday",
        time: "7:30 AM – 4:00 PM",
      },
      {
        days: "Saturday",
        time: "7:30 AM – 2:00 PM",
      },
      {
        days: "Sunday",
        time: "12:00 PM – 4:00 PM",
      },
    ],

    hoursNote: null,
    visitNote: null,
    directionsEnabled: true,
  },
];

// Format the full address for Google Maps
export function getLocationAddress(location) {
  return [
    location.address,
    location.cityState,
    location.country,
  ].join(", ");
}

// Embedded Google Map for each location
export function getGoogleMapsEmbedUrl(location) {
  return (
    "https://www.google.com/maps?q=" +
    encodeURIComponent(getLocationAddress(location)) +
    "&output=embed"
  );
}

// Open the location in Google Maps
export function getGoogleMapsUrl(location) {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(getLocationAddress(location))
  );
}

// Open driving directions in Google Maps
export function getGoogleMapsDirectionsUrl(location) {
  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(getLocationAddress(location)) +
    "&travelmode=driving"
  );
}

// Shared contact information for the website
export const nurseryContact = {
  office: "(562) 630-6240",
  officeHref: "tel:+15626306240",

  cell: "(562) 382-7956",
  cellHref: "tel:+15623827956",
};
