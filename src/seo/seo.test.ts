import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { featuredProjects } from "@/data/projects";
import { localizePortfolioText } from "@/i18n/portfolioContent";
import { applySeo } from "./applySeo";
import {
  buildJsonLd,
  fitDescription,
  getNotFoundSeo,
  getProjectSeo,
  getStaticSeo,
  MAX_DESCRIPTION_LENGTH,
  STATIC_PUBLIC_PATHS,
  type SeoLanguage,
} from "./routes";
import { buildRedirects, buildSitemapXml, listPublicRoutes, renderHeadTags, renderRouteHtml, routeFile } from "./prerender";
import { absoluteUrl, SITE_URL } from "./site";

const routes = listPublicRoutes(featuredProjects);
const languages: SeoLanguage[] = ["en", "fr"];

const allRecords = (language: SeoLanguage) => [
  ...STATIC_PUBLIC_PATHS.map((route) => getStaticSeo(route, language)),
  ...featuredProjects.map((project) => getProjectSeo(project, language, localizePortfolioText)),
];

describe("public route manifest", () => {
  it("matches the routes declared in App.tsx", () => {
    const app = fs.readFileSync(path.resolve(__dirname, "../App.tsx"), "utf-8");
    const declared = [...app.matchAll(/<Route path="([^"]+)"/g)].map((match) => match[1]);
    const staticDeclared = declared.filter((route) => route !== "*" && !route.includes(":"));
    expect([...staticDeclared].sort()).toEqual([...STATIC_PUBLIC_PATHS].sort());
    expect(declared).toContain("/work/:slug");
  });

  it("has exactly one case-study route per featured project, each unique", () => {
    const caseStudies = routes.filter((route) => route.kind === "case-study").map((route) => route.path);
    expect(caseStudies).toEqual(featuredProjects.map((project) => `/work/${project.slug}`));
    expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length);
    for (const project of featuredProjects) expect(project.caseStudyLink).toBe(`/work/${project.slug}`);
  });

  it("gives every page a unique title and description within search-result limits, in both languages", () => {
    for (const language of languages) {
      const records = allRecords(language);
      expect(new Set(records.map((record) => record.title)).size, `${language} titles`).toBe(records.length);
      expect(new Set(records.map((record) => record.description)).size, `${language} descriptions`).toBe(records.length);
      for (const record of records) {
        expect(record.title.length, `${language} ${record.path} title`).toBeLessThanOrEqual(62);
        expect(record.description.length, `${language} ${record.path} description`).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
        expect(record.description.length, `${language} ${record.path} description`).toBeGreaterThanOrEqual(80);
        expect(record.noindex).toBe(false);
        expect(record.image.startsWith("https://")).toBe(true);
      }
    }
  });

  it("emits no hreflang, because languages do not have distinct URLs", () => {
    for (const record of routes) expect(renderHeadTags(record)).not.toMatch(/hreflang|rel="alternate"/);
  });
});

describe("fitDescription", () => {
  it("keeps short text and shortens long text at a word boundary with an ellipsis", () => {
    expect(fitDescription("Short enough.")).toBe("Short enough.");
    const long = "word ".repeat(60).trim();
    const fitted = fitDescription(long);
    expect(fitted.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    expect(fitted.endsWith("word…")).toBe(true);
  });

  it("collapses whitespace and handles text with no spaces", () => {
    expect(fitDescription("a   b\n c")).toBe("a b c");
    expect(fitDescription("x".repeat(300)).length).toBe(MAX_DESCRIPTION_LENGTH);
  });
});

describe("structured data", () => {
  it("leaves the home page to the site-wide Person graph and emits nothing for a 404", () => {
    expect(buildJsonLd(getStaticSeo("/"))).toEqual([]);
    expect(buildJsonLd(getNotFoundSeo())).toEqual([]);
  });

  it("describes a section page with a breadcrumb trail and a WebPage that matches its canonical URL", () => {
    const record = getStaticSeo("/lab/automation");
    const [breadcrumb, page] = buildJsonLd(record) as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement.map((item: any) => [item.position, item.item])).toEqual([ // eslint-disable-line @typescript-eslint/no-explicit-any
      [1, `${SITE_URL}/`],
      [2, `${SITE_URL}/lab`],
      [3, `${SITE_URL}/lab/automation`],
    ]);
    expect(page["@type"]).toBe("WebPage");
    expect(page.url).toBe(absoluteUrl("/lab/automation"));
    expect(page.name).toBe(record.title);
    expect(page.author["@id"]).toBe(`${SITE_URL}/#person`);
  });

  it("links a case study to its repository only when it has one, and invents no dates or ratings", () => {
    const withRepo = featuredProjects.find((project) => project.githubLink);
    const withoutRepo = featuredProjects.find((project) => !project.githubLink);
    expect(withRepo && withoutRepo).toBeTruthy();
    const repoGraph = buildJsonLd(getProjectSeo(withRepo!)) as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(repoGraph[1].mainEntity["@type"]).toBe("SoftwareSourceCode");
    expect(repoGraph[1].mainEntity.codeRepository).toBe(withRepo!.githubLink);
    const plainGraph = buildJsonLd(getProjectSeo(withoutRepo!)) as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(plainGraph[1].mainEntity["@type"]).toBe("CreativeWork");
    expect(plainGraph[1].mainEntity.codeRepository).toBeUndefined();
    const serialized = JSON.stringify([...repoGraph, ...plainGraph]);
    expect(serialized).not.toMatch(/datePublished|dateModified|aggregateRating|review|offers/);
  });
});

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Old title</title>
    <meta name="description" content="old" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://tsinjona.netlify.app/" />
    <meta property="og:title" content="old" />
    <meta name="twitter:title" content="old" />
    <script type="application/ld+json">{"@type":"Person"}</script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

describe("static HTML generation", () => {
  it("writes route-specific tags, removes the template's own, and escapes values", () => {
    const record = { ...getStaticSeo("/lab"), title: 'Lab <script> & "quotes"', description: "A & B" };
    const html = renderRouteHtml(TEMPLATE, record, routes);
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    expect(html.match(/name="robots"/g)).toHaveLength(1);
    expect(html).toContain("<title>Lab &lt;script&gt; &amp; &quot;quotes&quot;</title>");
    expect(html).toContain('<link rel="canonical" href="https://tsinjona.netlify.app/lab" />');
    expect(html).not.toContain("Old title");
    expect(html).not.toContain('<script type="application/ld+json">{"@type":"Person"}</script>');
    expect(html).toContain('id="route-jsonld"');
    expect(html).toContain('<div id="root"></div>');
  });

  it("keeps the site-wide JSON-LD on the home page and adds a no-JavaScript summary with internal links", () => {
    const html = renderRouteHtml(TEMPLATE, getStaticSeo("/"), routes, '    <link rel="modulepreload" href="/assets/x.js" />');
    expect(html).toContain('"@type":"Person"');
    expect(html).not.toContain('id="route-jsonld"');
    expect(html).toContain('<link rel="modulepreload" href="/assets/x.js" />');
    const noscript = html.match(/<noscript>[\s\S]*<\/noscript>/)?.[0] ?? "";
    for (const route of routes.filter((candidate) => candidate.path !== "/")) expect(noscript).toContain(`href="${route.path}"`);
    expect(noscript).not.toContain('href="/"><');
  });

  it("fails the build when the template no longer has a tag it replaces", () => {
    expect(() => renderRouteHtml(TEMPLATE.replace(/<title>.*<\/title>/, ""), getStaticSeo("/lab"), routes)).toThrow(/title/);
    expect(() => renderRouteHtml(TEMPLATE.replace(/<link rel="canonical"[^>]*>/, ""), getStaticSeo("/lab"), routes)).toThrow(/canonical/);
    expect(() => renderRouteHtml(TEMPLATE.replace(/<script type="application\/ld\+json">.*<\/script>/, ""), getStaticSeo("/lab"), routes)).toThrow(/JSON-LD/);
  });

  it("maps routes to flat files and builds a sitemap and redirects from the same list", () => {
    expect(routeFile("/")).toBe("index.html");
    expect(routeFile("/lab/playground")).toBe("lab/playground.html");
    expect(routeFile("/work/sihia")).toBe("work/sihia.html");
    const sitemap = buildSitemapXml(routes);
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toEqual(routes.map((route) => absoluteUrl(route.path)));
    expect(new Set(locs).size).toBe(locs.length);
    const redirects = buildRedirects(routes).split("\n").filter((line) => line && !line.startsWith("#"));
    expect(redirects).toHaveLength((routes.length - 1) * 2);
    expect(redirects).toContain("/lab/automation  /lab/automation.html  200");
    expect(redirects).toContain("/work/sihia/  /work/sihia.html  200");
  });
});

describe("applySeo in the browser", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="robots" content="index, follow" /><link rel="canonical" href="https://tsinjona.netlify.app/" />';
    document.title = "";
  });

  const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute("content");

  it("writes the full tag set and overwrites a previous page's values", () => {
    applySeo(getStaticSeo("/lab/playground"));
    applySeo(getStaticSeo("/lab/operations", "fr"));
    expect(document.title).toBe("Moniteur d’opérations IA — Tsinjo");
    expect(document.documentElement.lang).toBe("fr");
    expect(meta('meta[name="description"]')).toContain("Signaux opérationnels");
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(`${SITE_URL}/lab/operations`);
    expect(meta('meta[property="og:url"]')).toBe(`${SITE_URL}/lab/operations`);
    expect(meta('meta[property="og:title"]')).toBe(document.title);
    expect(meta('meta[property="og:locale"]')).toBe("fr_FR");
    expect(meta('meta[name="twitter:title"]')).toBe(document.title);
    expect(meta('meta[name="robots"]')).toBe("index, follow, max-image-preview:large");
    expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  });

  it("only advertises image dimensions for the default image", () => {
    applySeo(getStaticSeo("/"));
    expect(meta('meta[property="og:image:width"]')).toBe("1200");
    applySeo(getProjectSeo(featuredProjects.find((project) => project.imageUrl)!));
    expect(document.head.querySelector('meta[property="og:image:width"]')).toBeNull();
    expect(meta('meta[property="og:image"]')?.startsWith(`${SITE_URL}/`)).toBe(true);
  });

  it("adds and removes the route JSON-LD as the route changes", () => {
    applySeo(getStaticSeo("/lab"));
    const script = document.head.querySelector("script#route-jsonld");
    expect(JSON.parse(script?.textContent ?? "[]")[0]["@type"]).toBe("BreadcrumbList");
    applySeo(getStaticSeo("/"));
    expect(document.head.querySelector("script#route-jsonld")).toBeNull();
  });

  it("marks an unknown page noindex and points its canonical at the home page", () => {
    applySeo(getNotFoundSeo());
    expect(meta('meta[name="robots"]')).toBe("noindex, follow");
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(`${SITE_URL}/`);
    applySeo(getStaticSeo("/lab"));
    expect(meta('meta[name="robots"]')).toBe("index, follow, max-image-preview:large");
  });
});
