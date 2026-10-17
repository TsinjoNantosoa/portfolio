import {
  buildJsonLd,
  getProjectSeo,
  getStaticSeo,
  robotsContent,
  STATIC_PUBLIC_PATHS,
  type ProjectSeoInput,
  type SeoRecord,
} from "./routes";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./site";

/** Every public, indexable route in sitemap order (English record; the client switches language). */
export const listPublicRoutes = (projects: readonly ProjectSeoInput[]): SeoRecord[] => [
  ...STATIC_PUBLIC_PATHS.map((path) => getStaticSeo(path, "en")),
  ...projects.map((project) => getProjectSeo(project, "en")),
];

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** JSON inside <script>: a literal "</" or "<!--" would end the element early. */
const escapeJsonForScript = (json: string): string => json.replace(/</g, "\\u003c");

const meta = (attribute: "name" | "property", key: string, content: string) =>
  `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;

/** Head tags for a route, in the same set that `applySeo` writes in the browser. */
export const renderHeadTags = (record: SeoRecord): string => {
  // Same as applySeo: the not-found page points at the home page (it has no URL of its own).
  const url = absoluteUrl(record.kind === "not-found" ? "/" : record.path);
  const isDefaultImage = record.image === `${SITE_URL}${DEFAULT_OG_IMAGE.path}`;
  const lines = [
    `<title>${escapeHtml(record.title)}</title>`,
    meta("name", "description", record.description),
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    meta("name", "robots", robotsContent(record)),
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", SITE_NAME),
    meta("property", "og:locale", record.language === "fr" ? "fr_FR" : "en_US"),
    meta("property", "og:title", record.title),
    meta("property", "og:description", record.description),
    meta("property", "og:url", url),
    meta("property", "og:image", record.image),
    meta("property", "og:image:alt", record.imageAlt),
    ...(isDefaultImage
      ? [
          meta("property", "og:image:width", String(DEFAULT_OG_IMAGE.width)),
          meta("property", "og:image:height", String(DEFAULT_OG_IMAGE.height)),
        ]
      : []),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", record.title),
    meta("name", "twitter:description", record.description),
    meta("name", "twitter:image", record.image),
    meta("name", "twitter:image:alt", record.imageAlt),
  ];
  const graph = buildJsonLd(record);
  if (graph.length > 0) {
    lines.push(`<script type="application/ld+json" id="route-jsonld">${escapeJsonForScript(JSON.stringify(graph))}</script>`);
  }
  return lines.map((line) => `    ${line}`).join("\n");
};

/** Tags in the shared template that every route re-declares and so must be removed first. */
const REMOVABLE_HEAD_TAGS: Array<[RegExp, string]> = [
  [/<title>[\s\S]*?<\/title>\s*/, "title"],
  [/<meta\s[^>]*?name="description"[^>]*?>\s*/, "meta description"],
  [/<link\s[^>]*?rel="canonical"[^>]*?>\s*/, "canonical"],
  [/<meta\s[^>]*?name="robots"[^>]*?>\s*/, "meta robots"],
];
const REMOVABLE_META_PREFIXES = ["og:", "twitter:"];

const stripSeoTags = (html: string): string => {
  let result = html;
  for (const [pattern, label] of REMOVABLE_HEAD_TAGS) {
    if (!pattern.test(result)) throw new Error(`SEO prerender: template has no ${label} tag to replace`);
    result = result.replace(pattern, "");
  }
  for (const prefix of REMOVABLE_META_PREFIXES) {
    result = result.replace(new RegExp(`<meta\\s[^>]*?(?:property|name)="${prefix}[^"]*"[^>]*?>\\s*`, "g"), "");
  }
  return result;
};

const JSON_LD_BLOCK = /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/;

const renderNoscript = (record: SeoRecord, routes: readonly SeoRecord[]): string => {
  const heading = record.kind === "home" ? `${SITE_NAME} — AI Engineer` : record.title;
  const links = routes
    .filter((route) => route.path !== record.path)
    .map((route) => `        <li><a href="${escapeHtml(route.path)}">${escapeHtml(route.title)}</a></li>`)
    .join("\n");
  return [
    "    <noscript>",
    "      <main>",
    `        <h1>${escapeHtml(heading)}</h1>`,
    `        <p>${escapeHtml(record.description)}</p>`,
    '        <nav aria-label="Portfolio pages">',
    "          <ul>",
    links,
    "          </ul>",
    "        </nav>",
    "        <p>JavaScript is required for the interactive portfolio.</p>",
    "      </main>",
    "    </noscript>",
  ].join("\n");
};

/**
 * Builds the static HTML for one route from the built shell: route-specific head tags, route JSON-LD
 * (the home page keeps the site-wide Person graph), and a no-JavaScript summary with internal links.
 * Throws if the template no longer has the tags this relies on, so a template change fails the build.
 */
export const renderRouteHtml = (
  template: string,
  record: SeoRecord,
  routes: readonly SeoRecord[],
  /** Extra markup for the head, such as preload hints computed from the final bundle. */
  extraHead = "",
): string => {
  let html = stripSeoTags(template);
  if (record.kind !== "home") {
    if (!JSON_LD_BLOCK.test(html)) throw new Error("SEO prerender: template has no JSON-LD block to remove");
    html = html.replace(JSON_LD_BLOCK, "");
  }
  if (!html.includes("</head>")) throw new Error("SEO prerender: template has no </head>");
  html = html.replace("</head>", `${renderHeadTags(record)}${extraHead ? `\n${extraHead}` : ""}\n  </head>`);
  const bodyOpen = /<body[^>]*>/;
  if (!bodyOpen.test(html)) throw new Error("SEO prerender: template has no <body>");
  return html.replace(bodyOpen, (tag) => `${tag}\n${renderNoscript(record, routes)}`);
};

/** File written for a route, relative to the output directory. Flat `.html` files avoid directory redirects. */
export const routeFile = (path: string): string => (path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`);

export const buildSitemapXml = (routes: readonly SeoRecord[]): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => `  <url>\n    <loc>${escapeHtml(absoluteUrl(route.path))}</loc>\n  </url>`),
    "</urlset>",
    "",
  ].join("\n");

/**
 * Non-forced rewrites: Netlify applies them only when no file answers the path itself, so they are a
 * safety net if the platform does not serve `/lab.html` at `/lab`. They sit before the SPA catch-all.
 */
export const buildRedirects = (routes: readonly SeoRecord[]): string =>
  [
    "# Generated by the SEO prerender step. Safety net: serve each prerendered page for its clean URL.",
    ...routes
      .filter((route) => route.path !== "/")
      .flatMap((route) => [`${route.path}  /${routeFile(route.path)}  200`, `${route.path}/  /${routeFile(route.path)}  200`]),
    "",
  ].join("\n");

/** File Netlify serves, with status 404, for any path no file or rewrite answers. */
export const NOT_FOUND_FILE = "404.html";

/** Page component that renders each route (every case-study path shares one page). */
export const pageModuleFor = (path: string): string => {
  if (path === "/") return "src/pages/Index.tsx";
  if (path === "/lab") return "src/pages/LabPage.tsx";
  if (path === "/lab/playground") return "src/pages/PlaygroundPage.tsx";
  if (path === "/lab/operations") return "src/pages/OperationsPage.tsx";
  if (path === "/lab/automation") return "src/pages/AutomationPage.tsx";
  if (path.startsWith("/work/")) return "src/pages/CaseStudyPage.tsx";
  throw new Error(`SEO prerender: no page module for ${path}`);
};

/** Preload hints: the headline font and the page's static chunks, fetched while the HTML is still parsed. */
export const renderPreloadTags = (input: { fontFiles: readonly string[]; moduleFiles: readonly string[] }): string =>
  [
    ...input.fontFiles.map((file) => `    <link rel="preload" href="/${file}" as="font" type="font/woff2" crossorigin />`),
    ...input.moduleFiles.map((file) => `    <link rel="modulepreload" crossorigin href="/${file}" />`),
  ].join("\n");
