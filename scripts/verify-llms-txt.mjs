// Validates the source and built llms.txt files without network access.
// Run after `npm run build` so public routes can be checked against the generated sitemap.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "public", "llms.txt");
const builtPath = path.join(root, "dist", "llms.txt");
const sitemapPath = path.join(root, "dist", "sitemap.xml");
const netlifyPath = path.join(root, "netlify.toml");
const SITE = "https://tsinjona.netlify.app";
const failures = [];

const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const readUtf8 = (file, label) => {
  if (!fs.existsSync(file)) {
    failures.push(`${label} is missing`);
    return "";
  }
  const bytes = fs.readFileSync(file);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    failures.push(`${label} is not valid UTF-8`);
    return "";
  }
};

const source = readUtf8(sourcePath, "public/llms.txt");
const built = readUtf8(builtPath, "dist/llms.txt (run `npm run build` first)");
const sitemap = readUtf8(sitemapPath, "dist/sitemap.xml (run `npm run build` first)");

if (source) {
  check(!source.startsWith("\uFEFF"), "public/llms.txt should use UTF-8 without a BOM");
  check(source.endsWith("\n"), "public/llms.txt must end with a newline");
  check(source === built, "dist/llms.txt differs from public/llms.txt");

  const lines = source.split(/\r?\n/);
  const h1 = lines.filter((line) => /^#\s+/.test(line));
  const h2 = lines.filter((line) => /^##\s+/.test(line)).map((line) => line.slice(3).trim());
  const otherHeadings = lines.filter((line) => /^#{3,6}\s+/.test(line));
  const firstContent = lines.find((line) => line.trim());
  const h1Index = lines.findIndex((line) => /^#\s+/.test(line));
  const h2Index = lines.findIndex((line) => /^##\s+/.test(line));
  const summaryIndex = lines.findIndex((line, index) => index > h1Index && /^>\s+\S/.test(line));

  check(h1.length === 1, `expected exactly one H1, found ${h1.length}`);
  check(firstContent === h1[0], "the H1 must be the first non-empty line");
  check(summaryIndex > h1Index && summaryIndex < h2Index, "a blockquote summary must follow the H1 before any H2 section");
  check(otherHeadings.length === 0, "only the H1 and H2 file-list headings are allowed");

  const requiredSections = [
    "Professional Profile",
    "AI Engineering Expertise",
    "Professional Experience",
    "Selected Engineering Projects",
    "Engineering Evidence",
    "Public Contact",
    "Optional",
  ];
  for (const section of requiredSections) check(h2.includes(section), `missing required section: ## ${section}`);
  check(new Set(h2).size === h2.length, "H2 section names must be unique");

  let activeSection = "";
  const linkPattern = /^- \[([^\]]+)\]\(([^)]+)\)(?::\s+\S.*)?$/;
  const links = [];
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      activeSection = line.slice(3).trim();
      continue;
    }
    if (activeSection && line.trim()) {
      const match = line.match(linkPattern);
      check(Boolean(match), `invalid file-list entry in ## ${activeSection}: ${line}`);
      if (match) links.push({ label: match[1], url: match[2] });
    }
  }
  check(links.length >= 20, `expected a useful resource map, found only ${links.length} links`);
  check(new Set(links.map(({ label }) => label)).size === links.length, "link labels must be unique");

  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  for (const { label, url } of links) {
    check(/^(https:\/\/|mailto:)/.test(url), `${label}: link is not absolute (${url})`);
    if (url.startsWith(`${SITE}/`)) {
      const pageUrl = url.split("#")[0];
      const pathname = new URL(pageUrl).pathname;
      const isPublicAsset = pathname === "/CV/CV_AIEngineer_AgentProduct_Sandaniaina_Tsinjo.pdf";
      check(sitemapUrls.has(pageUrl) || isPublicAsset, `${label}: internal URL is absent from the generated sitemap (${url})`);
      if (isPublicAsset) check(fs.existsSync(path.join(root, "dist", pathname.slice(1))), `${label}: public asset is missing from dist`);
    }
  }

  for (const pageUrl of sitemapUrls) {
    const route = pageUrl.replace(SITE, "") || "/";
    const file = route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
    const html = readUtf8(path.join(root, "dist", file), `dist/${file}`);
    check(
      /<link rel="describedby" href="\/llms\.txt" type="text\/plain"\s*\/>/.test(html),
      `${file} does not advertise /llms.txt with rel=describedby`,
    );
  }

  const netlify = readUtf8(netlifyPath, "netlify.toml");
  check(/for\s*=\s*"\/llms\.txt"/.test(netlify), "netlify.toml has no /llms.txt header rule");
  check(
    /Content-Type\s*=\s*"text\/plain; charset=utf-8"/.test(netlify),
    "netlify.toml does not declare the llms.txt UTF-8 text/plain content type",
  );

  const placeholders = [/verified-route/i, /example\.com/i, /localhost/i, /\bTODO\b/i, /\bTBD\b/i];
  for (const pattern of placeholders) check(!pattern.test(source), `placeholder detected: ${pattern}`);

  const secretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[=:]\s*\S+/i,
  ];
  for (const pattern of secretPatterns) check(!pattern.test(source), `possible secret detected: ${pattern}`);
}

if (failures.length) {
  console.error(`llms.txt validation failed (${failures.length}):`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log("llms.txt validation passed: valid UTF-8, v2 structure, absolute links, verified internal routes, build copy, no placeholders or secret patterns.");
