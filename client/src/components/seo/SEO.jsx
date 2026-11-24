
import { useEffect } from "react";

const SITE_URL = "https://www.garibaldosnursery.com";
const SITE_NAME = "Garibaldo's Nursery";

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(url) {
  const existing = document.head.querySelectorAll(
    'link[rel="canonical"]'
  );

  let canonical = existing[0];

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", url);

  // A page should have only one canonical tag.
  existing.forEach((element, index) => {
    if (index > 0) element.remove();
  });
}

export default function SEO({
  title,
  description,
  path = "/",
  image = null,
  type = "website",
  noindex = false,
}) {
  useEffect(() => {
    const normalizedPath =
      path === "/" ? "/" : `/${path.replace(/^\/|\/$/g, "")}`;

    const url = `${SITE_URL}${normalizedPath}`;

    document.title = title;

    setMeta("name", "description", description);

    setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large"
    );

    setCanonical(url);

    // Open Graph metadata
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "en_US");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);

    // Twitter / X metadata
    setMeta(
      "name",
      "twitter:card",
      image ? "summary_large_image" : "summary"
    );
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // Remove stale images when a new route has none.
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("name", "twitter:image", image);
    } else {
      document.head
        .querySelector('meta[property="og:image"]')
        ?.remove();

      document.head
        .querySelector('meta[name="twitter:image"]')
        ?.remove();
    }
  }, [title, description, path, image, type, noindex]);

  return null;
}
