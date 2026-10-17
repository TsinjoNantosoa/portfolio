import { buildJsonLd, robotsContent, type SeoRecord } from "./routes";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./site";

const JSON_LD_ID = "route-jsonld";

const upsertMeta = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const removeMeta = (attribute: "name" | "property", key: string) => {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

/**
 * Writes every page-level tag in one place so no two components can disagree (title, description,
 * canonical, Open Graph, Twitter, robots and the route's schema.org graph).
 */
export const applySeo = (record: SeoRecord): void => {
  const url = absoluteUrl(record.path);
  const isDefaultImage = record.image === `${SITE_URL}${DEFAULT_OG_IMAGE.path}`;

  document.title = record.title;
  document.documentElement.lang = record.language;
  upsertMeta("name", "description", record.description);
  upsertCanonical(record.kind === "not-found" ? absoluteUrl("/") : url);

  upsertMeta("name", "robots", robotsContent(record));

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:locale", record.language === "fr" ? "fr_FR" : "en_US");
  upsertMeta("property", "og:title", record.title);
  upsertMeta("property", "og:description", record.description);
  upsertMeta("property", "og:url", record.kind === "not-found" ? absoluteUrl("/") : url);
  upsertMeta("property", "og:image", record.image);
  upsertMeta("property", "og:image:alt", record.imageAlt);
  if (isDefaultImage) {
    upsertMeta("property", "og:image:width", String(DEFAULT_OG_IMAGE.width));
    upsertMeta("property", "og:image:height", String(DEFAULT_OG_IMAGE.height));
  } else {
    // The dimensions of a project screenshot are not known here; stale values would mislead crawlers.
    removeMeta("property", "og:image:width");
    removeMeta("property", "og:image:height");
  }

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", record.title);
  upsertMeta("name", "twitter:description", record.description);
  upsertMeta("name", "twitter:image", record.image);
  upsertMeta("name", "twitter:image:alt", record.imageAlt);

  const graph = buildJsonLd(record);
  const existing = document.head.querySelector<HTMLScriptElement>(`script#${JSON_LD_ID}`);
  if (graph.length === 0) {
    existing?.remove();
    return;
  }
  const script = existing ?? document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(graph);
  if (!existing) document.head.appendChild(script);
};
