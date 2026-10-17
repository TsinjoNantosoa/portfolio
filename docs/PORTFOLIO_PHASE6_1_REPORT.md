# Phase 6.1 — SEO Production Hardening: real HTTP 404 on Netlify

Branch: `feature/phase6-1-seo-hardening` (created from `main` at `9a2daa2`).
Status (2026-10-17): implemented and validated locally. **Not committed, pushed, merged or deployed. Not yet verified on a Netlify Deploy Preview** (procedure in section 5).

## 1. Audit

| Item | Finding |
|---|---|
| `netlify.toml` | One redirect: `/*  /index.html  200`. It answers every path that has no file with the home page and status 200. |
| Generated `dist/_redirects` | 20 non-forced rewrites: `/<route>` and `/<route>/` to the prerendered `<route>.html`, status 200. No catch-all. Netlify reads `_redirects` before `netlify.toml`. |
| Effect | `/n-importe-quoi`, `/work/inconnu` and `/lab/inconnu` returned **200** with the home page's HTML: `index, follow` and a canonical pointing at the home page. The `noindex` only appeared after JavaScript ran. |
| Known routes | Each has its own file (`index.html`, `lab.html`, `lab/*.html`, `work/*.html`), so none of them depended on the catch-all. Static assets, `sitemap.xml`, `robots.txt`, `privacy.html` and the CV are real files too. |
| Netlify Forms | The contact form is declared by a hidden `data-netlify` blueprint in `index.html` (form `portfolio-contact`) and posted to `/` with `fetch`. `/` is a real file, so the submission path does not use the catch-all. |
| Client router | `App.tsx` has a `*` route that renders `NotFound`, so a 404 page loaded by the app shows the same not-found screen as before. |

## 2. Change

1. `netlify.toml`: the `/* → /index.html 200` rule is removed (replaced by a comment saying not to re-add it). Netlify's default for a missing path is to serve `404.html` with status 404.
2. `vite-plugins/seoPrerender.ts` and `src/seo/prerender.ts`: the build now also writes `dist/404.html`, made from the same shell as the other pages with the not-found record: `noindex, follow`, the home page as canonical (as `applySeo` does), no JSON-LD, the app's scripts, and the same preload hints and `noscript` links. It is not in the sitemap or `_redirects`.
3. `scripts/verify-seo-build.mjs` (`npm run verify:seo`) now fails the build if `404.html` is missing or not `noindex`, if it carries JSON-LD or does not load the app, if the sitemap lists it, or if `netlify.toml` or `_redirects` gain a `/*` catch-all. Mutation-tested: re-adding the catch-all and deleting `404.html` each fail the check.
4. `src/seo/seo.test.ts`: one test for the 404 page.

No application code, chatbot, Playground, Operations Monitor, Automation Showcase, API or CSP changed. Render, Qdrant and OpenAI are untouched.

## 3. Expected behaviour after deployment

| Request | Expected status | Expected content |
|---|---|---|
| `/`, `/lab`, `/lab/playground`, `/lab/operations`, `/lab/automation`, `/work/<5 known slugs + multi-tenant-rag>` | 200 | Own title, canonical, Open Graph and JSON-LD in the raw HTML (unchanged) |
| Same routes with a trailing slash | 301 to the slash-less URL (current production behaviour, from Netlify pretty URLs) or 200 with the same page | Same as above |
| `/sitemap.xml`, `/robots.txt`, `/privacy.html`, `/CV/…pdf`, `/assets/*`, `/og-image.png` | 200 | Files |
| `/work/inconnu`, `/lab/inconnu`, `/n-importe-quoi` and their trailing-slash forms | **404** | `404.html`: title "Page not found — Tsinjo", `noindex, follow`, no JSON-LD; the app then shows its not-found page |
| `/assets/missing.js` | **404** | Same `404.html` (it used to return the HTML page with 200, which hid broken asset links) |
| `POST /` with `form-name=portfolio-contact` | handled by Netlify Forms | unchanged |

Browser experience for a 404: identical screen as before. Only the status and the initial HTML change.

Known side effect: client-side navigation never reaches the server, so in-app links are unaffected. A visitor who reloads a mistyped URL now gets a real 404.

## 4. Validation (local, 2026-10-17)

| Check | Result |
|---|---|
| TypeScript app and node | exit 0 |
| ESLint | 0 errors, 6 warnings (same as before) |
| Vitest | 17 files passed, 1 skipped; 127 passed, 4 skipped (126 before + 1 new) |
| Build and `npm run verify:seo` | pass; 11 routes, 20 rewrites, 404 checks pass |
| Mutation tests of the verifier | both fail as intended |
| Local server that imitates Netlify's order (file, `<path>.html`, `_redirects`, else `404.html` with 404), driven by Edge | known routes 200 with their own title; `/work/inconnu`, `/lab/inconnu`, `/n-importe-quoi` and slash variants **404** with `noindex` and the app's not-found screen; sitemap, robots, privacy page, CV, favicon 200; missing asset 404 |

Limit: that local server is an approximation of Netlify, not Netlify. It cannot prove how Netlify handles `lab.html` at `/lab`, trailing slashes or form detection. That is what the Deploy Preview check below is for.

## 5. Procedure on a Netlify Deploy Preview (before merging)

Use `$P` for the preview URL.

```
# 1. Known routes: 200, own canonical
for r in / /lab /lab/playground /lab/operations /lab/automation /work/sihia /work/offshore-fares /work/multi-tenant-rag /work/arcwell-agentic-crm /work/ai-business-os /work/ai-sales-assistant; do
  curl -s -o /tmp/b.html -w "$r %{http_code} " "$P$r"; grep -o 'rel="canonical" href="[^"]*' /tmp/b.html | head -1
done

# 2. Unknown URLs: must print 404 and noindex, no redirect
for r in /n-importe-quoi /work/inconnu /work/inconnu/ /lab/inconnu /assets/missing.js; do
  curl -s -o /tmp/b.html -w "$r %{http_code} " "$P$r"; grep -o 'name="robots" content="[^"]*' /tmp/b.html
done

# 3. Trailing slash and files
curl -sI "$P/lab/" | head -3        # 301 to /lab, or 200
curl -sI "$P/sitemap.xml" | head -1; curl -sI "$P/robots.txt" | head -1; curl -sI "$P/privacy.html" | head -1
curl -sI "$P/CV/CV_Tsinjo_Nantosoa.pdf" | head -1; curl -sI "$P/og-image.png" | head -1
```

Then in the browser: open an unknown URL (the not-found page appears, DevTools Network shows 404 for the document), reload `/lab/automation` and a `/work/…` page, open the chatbot, run the Automation Showcase, and check that Netlify's **Forms** tab still lists `portfolio-contact` (do not submit a test message unless you want one in your inbox).

Go / no-go:
- Any known route returning 404, or showing the home canonical: **do not merge**; restore the rule in `netlify.toml` with `git revert` of this change and report it.
- Unknown URLs still returning 200: check that the deploy used this branch's `netlify.toml` and that no rule was added in the Netlify UI (Site configuration, Redirects).

Rollback: revert the commit; the previous `/* /index.html 200` rule returns.

## 6. Remaining limits

- Not verified on Netlify until the preview check above is done.
- The 404 page is English-only in the raw HTML (the app switches to French after loading); crawlers never index it (`noindex`) and it is not in the sitemap.
- Search engines already holding old soft-404 URLs will drop them over time; nothing to do.
- Earlier in Phase 6 verification I wrote that the site had no contact form. That was wrong: the Netlify form exists (`portfolio-contact`) and is unchanged by this phase.
