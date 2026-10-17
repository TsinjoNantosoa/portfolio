import fs from "node:fs";
import path from "node:path";
import type { OutputBundle, OutputChunk } from "rollup";
import type { Plugin } from "vite";
import { featuredProjects } from "../src/data/projects";
import {
  buildRedirects,
  buildSitemapXml,
  listPublicRoutes,
  pageModuleFor,
  renderPreloadTags,
  renderRouteHtml,
  routeFile,
} from "../src/seo/prerender";

const isChunk = (item: OutputBundle[string]): item is OutputChunk => item.type === "chunk";

/** Static chunks a page needs, so the browser can fetch them while it still parses the HTML. */
const modulesForPage = (bundle: OutputBundle, pageModule: string): string[] => {
  const chunks = Object.values(bundle).filter(isChunk);
  const page = chunks.find((chunk) => chunk.facadeModuleId?.replace(/\\/g, "/").endsWith(pageModule));
  if (!page) throw new Error(`SEO prerender: no chunk for ${pageModule}`);
  const entries = new Set(chunks.filter((chunk) => chunk.isEntry).map((chunk) => chunk.fileName));
  const files = new Set<string>([page.fileName]);
  const queue = [...page.imports];
  while (queue.length > 0) {
    const file = queue.shift() as string;
    if (files.has(file) || entries.has(file)) continue;
    files.add(file);
    const chunk = chunks.find((candidate) => candidate.fileName === file);
    if (chunk) queue.push(...chunk.imports);
  }
  return [...files];
};

/**
 * After the build, writes one static HTML file per public route (route-specific head tags, JSON-LD and
 * a no-JavaScript summary), the sitemap, and a safety-net `_redirects`. The React app is unchanged:
 * it still renders on the client and keeps the same tags in sync through `applySeo`.
 */
export function seoPrerender(): Plugin {
  let outDir = "dist";
  return {
    name: "seo-prerender",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    writeBundle(_options, bundle) {
      const templatePath = path.join(outDir, "index.html");
      const template = fs.readFileSync(templatePath, "utf-8");
      const routes = listPublicRoutes(featuredProjects);
      const fontFiles = Object.keys(bundle).filter((file) => /inter-latin-variable-[\w-]+\.woff2$/.test(file));
      if (fontFiles.length !== 1) throw new Error(`SEO prerender: expected one Inter font asset, found ${fontFiles.length}`);

      for (const record of routes) {
        const extraHead = renderPreloadTags({ fontFiles, moduleFiles: modulesForPage(bundle, pageModuleFor(record.path)) });
        const html = renderRouteHtml(template, record, routes, extraHead);
        const target = path.join(outDir, routeFile(record.path));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html);
      }
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemapXml(routes));
      fs.writeFileSync(path.join(outDir, "_redirects"), buildRedirects(routes));
    },
  };
}
