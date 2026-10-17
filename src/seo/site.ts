export const SITE_URL = "https://tsinjona.netlify.app";
export const SITE_NAME = "Sandaniaina Tsinjo Nantosoa";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const DEFAULT_OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Sandaniaina Tsinjo Nantosoa, AI Engineer building production-ready AI systems",
} as const;

export const ROBOTS_INDEXABLE = "index, follow, max-image-preview:large";
export const ROBOTS_NOINDEX = "noindex, follow";

/** Canonical absolute URL for a route path. The home page keeps its trailing slash, other routes have none. */
export const absoluteUrl = (path: string): string => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);
