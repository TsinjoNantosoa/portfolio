# Phase 6 Report — SEO, Discoverability & Quality

Status (2026-10-17, final check against Git): branch `feature/phase6-seo-quality`, created from `main` at `af1cf49` (Phase 5.1, published and live).

| Part | State |
|---|---|
| Implementation | **Committed** by the owner: `5da3afa` (main implementation, 47 files) and `5cdfd95` (accessibility fixes, report, roadmap). Both are on `origin/feature/phase6-seo-quality`. Working tree clean. |
| Merged into `main` | **No** (`main` and `origin/main` are at `af1cf49`) |
| Deployed / verified on Netlify | **No.** Production still serves the pre-Phase-6 build: its raw HTML for `/lab/automation` still carries the home page's canonical. To be checked on a deploy preview (section 7). |

All validation below was run on the committed tree (clean working tree), on 2026-10-17.

## 1. Audit: what was confirmed (and what was not)

| # | Finding | How it was measured | Verdict |
|---|---|---|---|
| 1 | Every route returned the **same HTML** before JavaScript: home title, home canonical, home `og:url`, no route JSON-LD | `curl` on `/lab/automation` | Confirmed |
| 2 | Switching language on **any non-home page replaced its title and description with the home page's** | Browser test on 5 routes | Confirmed (bug) |
| 3 | Playground and Operations never set `og:title`/`og:url` (the latter stayed on the home URL while the canonical was correct); case-study `og:image` leaked to other pages on client navigation | Browser test | Confirmed |
| 4 | Seven files each wrote tags by hand | Code | Root cause of 2 and 3 |
| 5 | Accessibility in the **light theme**: 226 distinct contrast violations (muted text 4.03:1, accent text 4.44:1, black on green buttons 4.18:1, bright-green opacity variants 1.24:1) | axe-core, 44 page states. Lighthouse only tests the dark theme and missed all of it | Confirmed |
| 6 | Two buttons whose accessible name did not contain their visible text (language toggle, assistant launcher) | Lighthouse + axe | Confirmed |
| 7 | Home mobile: 89 % of LCP was render delay, blocked by the Google Fonts stylesheet (about 1.7 s) | Lighthouse diagnostics | Confirmed |
| 8 | Profile photo served at 720 px / 99 KB JPEG for a 248–328 px slot | Rendered-size measurement | Confirmed |
| 9 | Framer-motion animations in `Services`, `Experience`, menu and cards ignored `prefers-reduced-motion` | Browser probe | Confirmed |
| 10 | From the home page, the live demos were reachable only through the "AI Lab" menu item; the Offshore Fares card did not link to its own showcase | Code | Confirmed |
| 11 | Titles over about 60 characters (home 73, case studies up to 72); five case-study descriptions over 160 characters | Length audit | Confirmed |
| 12 | Unknown URLs return HTTP 200 (soft 404) | `netlify.toml` catch-all | Confirmed, **not fixed** (needs a Netlify config change, see section 7) |
| 13 | Sitemap hand-maintained | Code | It was complete today; now generated to prevent drift |
| 14 | Links, CV, certificates, images | HTTP checks and file checks | **All valid** (11 external URLs return 200; LinkedIn answers 999, its anti-bot response; 34 local references present) |
| 15 | Lighthouse "SEO 100" | | True after JavaScript only; it cannot see findings 1–3 |

## 2. What changed

**SEO (Phase B)**
- One source of truth, `src/seo/` (`routes.ts`, `site.ts`, `applySeo.ts`, `useSeo.ts`, `prerender.ts`). Each page calls `useSeo(...)`; the language provider no longer writes metadata. Every tag (title, description, canonical, robots, Open Graph, Twitter, JSON-LD) is written in one place.
- **Static prerender at build** (`vite-plugins/seoPrerender.ts`): one HTML file per public route (11) with route-specific head, route JSON-LD and a `<noscript>` summary linking to every other route. Plus a generated `sitemap.xml`, a safety-net `_redirects`, preload of the headline font and of each page's static chunks. The React app is unchanged (client rendering, same tags kept in sync). No migration to another framework.
- Structured data limited to verifiable facts: home keeps `Person` + `WebSite` (with `@id`); other pages get `BreadcrumbList` + `WebPage`; case studies add `SoftwareSourceCode` (only when a repository link exists) or `CreativeWork`. No dates, ratings or metrics.
- Titles ≤ 62 characters; descriptions fitted to ≤ 160 at a word boundary; unknown URLs and unknown case-study slugs are `noindex`.
- `hreflang`: **deliberately none.** Languages share one URL (client preference), so alternates would be false. A test asserts none is emitted.
- Internal linking: a "Try the live demos" row on the home Projects section and an "Interactive demo" link on the Offshore Fares card.

**Performance and accessibility (Phase C)**
- Inter and JetBrains Mono self-hosted (latin variable files, the same ones Google served), metric-adjusted fallbacks, no third-party font request.
- Profile photo converted to WebP, 360 w and 720 w with `srcset`.
- Light theme: `--text-muted`, accent and button text corrected; opacity and hover variants of the bright green redirected to the theme accent.
- Accessible names now contain the visible text; the assistant dialog no longer creates a second `banner`/`contentinfo` landmark and its privacy link is underlined; pending showcase steps no longer rely on `opacity`.
- `MotionConfig reducedMotion="user"` for the whole app.

**Quality gates added**
- `npm run verify:seo` reads the generated `dist/` (per-route tags, canonical equals sitemap URL, one title/canonical per file, unique titles and descriptions, JSON-LD parses and matches the canonical, `noscript` links all resolve, rewrites point at existing files, `robots.txt`). Mutation-checked: it fails when a canonical, a `robots` tag or a sitemap entry is corrupted.
- 26 new tests (route manifest vs `App.tsx`, JSON-LD, HTML generation, `applySeo`, a regression test for the language bug, recruiter links).

## 3. Measurements, before and after

Lighthouse 12, Chrome headless, default simulated throttling (mobile: 4× CPU, slow 4G; desktop preset), served by `vite preview` on localhost, machine otherwise idle. Home: 5 runs; other pages: 3 runs; medians shown. "Before" is the `af1cf49` build, "after" is this branch.

| Page | Mode | Perf before → after | A11y | FCP (ms) | LCP (ms) | TBT (ms) | Transfer (KB) |
|---|---|---|---|---|---|---|---|
| `/` | mobile | **63 → 77** | 96 → 100 | 3518 → 2599 | 4246 → 3432 | 561 → 434 | 378 → 336 |
| `/` | desktop | **90 → 99** | 96 → 100 | 1198 → 586 | 1677 → 807 | 0 → 41 | 694 → 622 |
| `/work/multi-tenant-rag` | mobile | **79 → 91** | 96 → 100 | 3605 → 2481 | 3830 → 3006 | 0 → 40 | 404 → 405 |
| `/work/multi-tenant-rag` | desktop | **93 → 100** | 96 → 100 | 1078 → 566 | 1538 → 648 | 0 → 0 | 404 → 405 |
| `/lab/automation` | mobile | **81 → 93** | 96 → 100 | 3515 → 2486 | 3591 → 2636 | 0 → 61 | 250 → 252 |
| `/lab/automation` | desktop | **90 → 100** | 96 → 100 | 1194 → 562 | 1669 → 602 | 0 → 0 | 250 → 252 |

CLS is 0 to 0.011 everywhere, before and after. Best practices and Lighthouse SEO stay at 100.

Other measures:

| Measure | Before | After |
|---|---|---|
| axe-core violations, 11 routes × EN/FR × dark/light (44 states) | 226 distinct | **0** |
| axe, interactive states (showcase gate, result and trace, mobile menu, assistant dialog; both themes) | 5 rules failing | **0** |
| Elements still tweening under `prefers-reduced-motion` (home sections) | 4 | **0** (3 still animate without the preference, as intended) |
| Title and description after switching language, 5 routes | wrong on 5/5 | correct (regression test) |
| Raw HTML canonical for `/lab/automation` | home page | `/lab/automation` |
| Main JS chunk | 249,949 B | 251,169 B (+1,220 B) |
| `AutomationPage` chunk | 81,881 B | 80,610 B |

How to read these numbers honestly:
- They are **lab numbers on localhost**, not field Core Web Vitals and not Netlify. Real-world gains depend on the CDN; the directions (no blocking third-party CSS, smaller image, preloaded chunks) should hold, the magnitudes may not.
- Mobile scores vary by several points between runs (home "before" ranged 56–80). The "after" runs were tight (76–77). My first "before" measurement (home mobile 48) was inflated by load I generated on the same machine and was discarded; the table uses the clean re-run.
- Desktop TBT rose from 0 to 41 ms on the home page and 40–61 ms on mobile for inner pages. These are small and well under the 200 ms "good" threshold, but they are real (extra preload requests competing early). The Lighthouse "after" run was taken just before two final markup-only accessibility fixes (assistant landmarks, pending showcase steps); they cannot change the numbers materially but were not re-measured.
- Home mobile TBT (434 ms) and 77 are the remaining weak point. The cause is JavaScript execution (the shared chunk with framer-motion). Fixing it means reducing animation code, which would change the site's feel, so I left it.

## 4. Validation

| Check | Result |
|---|---|
| `tsc -p tsconfig.app.json` and `tsc -p tsconfig.node.json` | pass |
| `eslint .` | 0 errors, the same 6 pre-existing warnings (none in changed files) |
| `vitest run` | 17 files passed, 1 skipped; **126 tests passed**, 4 skipped (Offshore reference check, on demand) |
| `vite build` + `npm run verify:seo` | pass; 11 routes, 20 rewrites |
| Metadata of all 11 routes, checked three ways (served HTML, rendered DOM, DOM after switching to French): canonical, `og:url`, `og:title` equal to the title, description 80–160 characters, indexable, image served, one `h1`, JSON-LD present, no page error | pass, 11/11 |
| axe-core, 44 states (11 routes × EN/FR × dark/light) and 8 interactive states (showcase gate, result and trace, mobile menu, assistant dialog × both themes) | 0 violations |
| Showcase browser matrix (Business → approve, Corporate → reject, Custom → two revisions → approve; 7 combinations of width, theme and language; zero network requests during the simulation) | pass on the local build **and on production** |
| Smoke test: RAG Playground renders; Operations Monitor renders and handles an unreachable API without crashing; chatbot opens as a modal dialog with composer and privacy link, closes with Escape and returns focus; home has CV, contact, six case-study links and four demo links; an unknown URL and an unknown case-study slug show the 404 page with `noindex` | pass |
| Protected areas versus `af1cf49` (`portfolio-ai-api`, `netlify.toml`, `render.yaml`, Operations and Playground API code, assistant API/config/session files) | no diff. The assistant components changed in 5 files, markup and CSS only (landmark tags, link underline, accessible name) |
| Backend, Qdrant, Render variables, `netlify.toml`, Operations Monitor API | untouched |

## 5. Recruiter path (Phase D)

From the home page a visitor can: read the positioning in the hero; reach "View Selected Work", "Download CV" and "Contact Me" from the hero; open a case study from every featured project card; open each live demo directly from the Projects section; and reach the Offshore Fares showcase from its own card. No metric or client reference was added. Checks: every CV, certificate, screenshot and external link resolves.

Observations I did not act on: the older CV `public/CV/CV_Tsinjo_Nantosoa.pdf` is still publicly reachable at its URL although only the newer one is linked; about 20 unreferenced images remain in `public/` (not served to visitors, only repository weight); the Google Fonts domains are still allowed by the CSP although nothing loads from them any more.

## 6. Files

Created: `src/seo/*` (6 files + test), `vite-plugins/seoPrerender.ts`, `scripts/verify-seo-build.mjs`, `src/assets/fonts/*` (2 fonts + CSS), `src/components/UI/tsinjo-360.webp`, `tsinjo-720.webp`, `src/pages/PageMetadata.test.tsx`, `src/components/Sections/ProjectsDemos.test.tsx`, this report.
Removed: `public/sitemap.xml` (now generated), `src/components/UI/tsinjo.jpg` (replaced by the WebP variants; still in Git history).
Modified: pages (`Index`, `LabPage`, `PlaygroundPage` metadata lines only, `OperationsPage`, `AutomationPage`, `CaseStudyPage`, `NotFound`), `I18nProvider`, `App`, `main`, `index.html`, `index.css`, `tailwind.config.ts`, `vite.config.ts`, `tsconfig.node.json`, `package.json` (`verify:seo`), `README.md`, assistant launcher/header/footer markup and CSS (landmarks and link underline only), `Footer`, `Contact`, `PreferencesControls`, `Projects`, `FeaturedProjectCard`, `ProfileImage`, `WorkflowVisualizer`, and the tests whose queries use the new accessible names.

## 7. Before you deploy: verify on a Netlify deploy preview

The prerender writes flat files (`lab.html`, `lab/automation.html`, `work/<slug>.html`) and a generated `_redirects` (non-forced rewrites placed before the SPA catch-all). I could not test Netlify's routing locally. On a deploy preview, check:

```
curl -s https://<preview>/lab/automation | grep -E "<title>|rel=\"canonical\""
curl -s https://<preview>/work/sihia      | grep -E "<title>|rel=\"canonical\""
curl -sI https://<preview>/lab            | head -1        # expect 200, not a redirect
curl -s https://<preview>/lab/automation/ | grep canonical  # trailing slash still serves the page
```

Each non-home route should show its **own** title and canonical. If one shows the home page's, the platform is not mapping clean URLs to the flat files; tell me and I will adjust (for example forced rewrites in `_redirects`). Also retest the contact form and the assistant in the preview, since the build output changed. Do not merge until this passes.

## 8. Remaining limits and recommendations

- **Soft 404.** Unknown URLs still answer 200 with a `noindex` page. A real 404 needs the catch-all in `netlify.toml` replaced by explicit known routes plus a 404 fallback. It is a deploy-configuration change, so I did not make it; I recommend it after the preview checks above.
- **French is not separately indexable.** One URL per page, language by client preference. Distinct localized URLs (and then `hreflang`) would be a product decision.
- **Link previews of case studies use project screenshots** (not 1.91:1 images); they work but are cropped. A dedicated social image per project would be a design task.
- **Structured data** is validated by tests and parsing, not by Google's Rich Results tool, which I cannot run here.
- **Core Web Vitals in the field** are unknown until real traffic is measured; consider Search Console after deployment.
- **Home mobile performance** is 77, not 90+. The remaining cost is JavaScript, discussed in section 3.
- Reduced motion was verified by measurement on the home sections, not on every component.
- CSP still permits Google Fonts; tightening it is a one-line `netlify.toml` change that needs your approval.
- Suggested order: push the branch, open a deploy preview, run section 7, then merge. Nothing in this phase has been merged or deployed.
