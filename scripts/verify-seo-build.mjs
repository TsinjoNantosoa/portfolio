// Verifies the SEO output of `npm run build` by reading the files that would be deployed.
//   npm run build && npm run verify:seo
// Exit code 1 on any failure. No network access.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const SITE = "https://tsinjona.netlify.app";

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (file) => fs.readFileSync(path.join(dist, file), "utf-8");
const exists = (file) => fs.existsSync(path.join(dist, file));

check(exists("index.html"), "dist/index.html is missing: run `npm run build` first");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const sitemap = read("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check(urls.length > 0, "sitemap.xml lists no URL");
check(new Set(urls).size === urls.length, "sitemap.xml has duplicate URLs");
check(!/hreflang|xhtml:link/.test(sitemap), "sitemap.xml must not carry hreflang alternates");

const fileFor = (url) => {
  const route = url.replace(SITE, "") || "/";
  return route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
};
const tag = (html, pattern) => html.match(pattern)?.[1];
const decode = (value = "") => value.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const titles = new Map();
const descriptions = new Map();
const rows = [];

for (const url of urls) {
  const file = fileFor(url);
  const where = `${url} (${file})`;
  if (!exists(file)) {
    failures.push(`${where}: prerendered file is missing`);
    continue;
  }
  const html = read(file);
  const title = decode(tag(html, /<title>([^<]*)<\/title>/));
  const description = decode(tag(html, /<meta name="description" content="([^"]*)"/));
  const canonical = tag(html, /<link rel="canonical" href="([^"]*)"/);
  const ogUrl = tag(html, /<meta property="og:url" content="([^"]*)"/);
  const ogTitle = decode(tag(html, /<meta property="og:title" content="([^"]*)"/));
  const ogImage = tag(html, /<meta property="og:image" content="([^"]*)"/);
  const robots = tag(html, /<meta name="robots" content="([^"]*)"/);

  check(Boolean(title) && title.length <= 62, `${where}: title missing or longer than 62 characters (${title?.length})`);
  check(Boolean(description) && description.length >= 80 && description.length <= 160, `${where}: description must be 80-160 characters (${description?.length})`);
  check(canonical === url, `${where}: canonical is ${canonical}`);
  check(ogUrl === url, `${where}: og:url is ${ogUrl}`);
  check(ogTitle === title, `${where}: og:title differs from <title>`);
  check(tag(html, /<meta name="twitter:card" content="([^"]*)"/) === "summary_large_image", `${where}: twitter:card missing`);
  check(tag(html, /<meta name="twitter:title" content="([^"]*)"/) === tag(html, /<meta property="og:title" content="([^"]*)"/), `${where}: twitter:title differs from og:title`);
  check(robots && !/noindex/.test(robots), `${where}: robots is ${robots}`);
  check(ogImage?.startsWith(`${SITE}/`), `${where}: og:image is not an absolute site URL`);
  if (ogImage?.startsWith(`${SITE}/`)) check(exists(ogImage.slice(SITE.length + 1)), `${where}: og:image file ${ogImage} is not in dist`);
  check(!/hreflang|rel="alternate"/.test(html), `${where}: unexpected hreflang/alternate (languages share one URL)`);
  check(html.match(/<title>/g)?.length === 1, `${where}: expected exactly one <title>`);
  check(html.match(/rel="canonical"/g)?.length === 1, `${where}: expected exactly one canonical`);
  check(!/fonts\.googleapis|fonts\.gstatic/.test(html), `${where}: still references Google Fonts`);
  check(/<div id="root"><\/div>/.test(html), `${where}: app root is missing`);
  check(/<script type="module"[^>]*src="\/assets\/index-/.test(html), `${where}: entry script is missing`);
  check(/rel="preload"[^>]*inter-latin-variable[^>]*as="font"/.test(html), `${where}: Inter font is not preloaded`);

  // Structured data: every block must parse; non-home pages carry a breadcrumb and a WebPage on their canonical URL.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  const graphs = [];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block);
      graphs.push(...(Array.isArray(parsed) ? parsed : parsed["@graph"] ? parsed["@graph"] : [parsed]));
    } catch (error) {
      failures.push(`${where}: invalid JSON-LD (${error.message})`);
    }
  }
  const types = graphs.map((node) => node["@type"]);
  if (url === `${SITE}/`) {
    check(types.includes("Person") && types.includes("WebSite"), `${where}: home JSON-LD needs Person and WebSite`);
  } else {
    check(types.includes("BreadcrumbList") && types.includes("WebPage"), `${where}: needs BreadcrumbList and WebPage JSON-LD`);
    check(!types.includes("Person") || graphs.every((node) => node["@type"] !== "Person"), `${where}: the site-wide Person graph must only be on the home page`);
    const page = graphs.find((node) => node["@type"] === "WebPage");
    check(page?.url === canonical, `${where}: WebPage.url (${page?.url}) differs from canonical`);
    const crumbs = graphs.find((node) => node["@type"] === "BreadcrumbList")?.itemListElement ?? [];
    check(crumbs.length >= 2 && crumbs.every((crumb, index) => crumb.position === index + 1), `${where}: breadcrumb positions are not sequential`);
  }

  // No-JavaScript summary: heading, description, and links that all resolve to indexable routes.
  const noscript = tag(html, /<noscript>([\s\S]*?)<\/noscript>/) ?? "";
  check(/<h1>/.test(noscript), `${where}: <noscript> has no <h1>`);
  const links = [...noscript.matchAll(/href="([^"]+)"/g)].map((match) => `${SITE}${match[1] === "/" ? "/" : match[1]}`);
  check(links.length === urls.length - 1, `${where}: <noscript> links ${links.length} pages, expected ${urls.length - 1}`);
  for (const link of links) check(urls.includes(link), `${where}: <noscript> links to ${link}, which is not in the sitemap`);

  if (titles.has(title)) failures.push(`${where}: title duplicates ${titles.get(title)}`);
  titles.set(title, url);
  if (descriptions.has(description)) failures.push(`${where}: description duplicates ${descriptions.get(description)}`);
  descriptions.set(description, url);
  rows.push({ url: url.replace(SITE, "") || "/", title: title.length, description: description.length, jsonLd: types.filter(Boolean).join("+") || "-" });
}

// Netlify safety-net rewrites must point at files that exist; the build must not leave a stale static sitemap.
const redirects = exists("_redirects") ? read("_redirects").split("\n").filter((line) => line && !line.startsWith("#")) : [];
check(redirects.length === (urls.length - 1) * 2, `_redirects has ${redirects.length} rules, expected ${(urls.length - 1) * 2}`);
for (const line of redirects) {
  const [from, to, status] = line.split(/\s+/);
  check(status === "200" && exists(to.replace(/^\//, "")), `_redirects: ${from} -> ${to} (${status}) does not resolve to a file`);
}

// Unknown URLs must get a real 404: a 404.html that is noindex, and no catch-all that answers 200.
check(exists("404.html"), "dist/404.html is missing, so unknown URLs have no 404 page");
if (exists("404.html")) {
  const notFound = read("404.html");
  check(/<meta name="robots" content="noindex, follow"/.test(notFound), "404.html is not noindex");
  check(!/<script type="application\/ld\+json"/.test(notFound), "404.html carries JSON-LD");
  check(/<script type="module"[^>]*src="\/assets\//.test(notFound), "404.html does not load the app");
  check(!urls.includes(`${SITE}/404`) && !urls.includes(`${SITE}/404.html`), "sitemap lists the 404 page");
}
const netlifyToml = fs.readFileSync(path.join(root, "netlify.toml"), "utf8");
check(!/from\s*=\s*"\/\*"/.test(netlifyToml), "netlify.toml has a /* catch-all, which turns unknown URLs into 200 soft 404s");
check(!redirects.some((line) => line.startsWith("/*")), "_redirects has a /* catch-all");
const robotsTxt = read("robots.txt");
check(robotsTxt.includes(`Sitemap: ${SITE}/sitemap.xml`), "robots.txt does not point to the sitemap");
check(!/Disallow:\s*\/\s*$/m.test(robotsTxt), "robots.txt disallows the whole site");

console.table(rows);
if (failures.length) {
  console.error(`\n${failures.length} SEO check(s) failed:`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log(`\nSEO build verification passed: ${urls.length} routes, ${redirects.length} rewrites.`);
