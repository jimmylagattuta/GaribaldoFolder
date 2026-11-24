
import { nurseryLocations } from "../../data/locations";

const SITE_URL = "https://www.garibaldosnursery.com";

export default function HomeSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Garibaldo's Nursery",
        url: SITE_URL,
        description:
          "Garibaldo's Nursery provides quality plants, nursery products, and gardening essentials in Bellflower and Lakewood, California.",
        email: "garibaldosnursery@gmail.com",
        telephone: "+15626306240",
        location: nurseryLocations.map((location) => ({
          "@id": `${SITE_URL}/locations#${location.id}`,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Garibaldo's Nursery",
        url: SITE_URL,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name:
          "Garibaldo's Nursery | Plants & Garden Supplies",
        description:
          "Explore quality plants and gardening essentials at Garibaldo's Nursery in Bellflower and Lakewood, California.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: "en-US",
      },
    ],
  };

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