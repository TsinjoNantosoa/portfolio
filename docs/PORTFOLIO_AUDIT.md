# Portfolio Engineering Audit

Date: 2026-10-15  
Branch: `codex/portfolio-v2-phase1`  
Baseline commit: `4ed5135`

## Executive Summary

The portfolio is already a substantial bilingual AI engineering site rather than a basic landing page. It has a structured project catalog, six routed case studies, a production-aware Netlify configuration, a working Netlify contact form, light/dark themes, an embedded read-only portfolio RAG assistant, responsive sections, and a test suite.

Phase 1 should therefore improve discovery and positioning without rebuilding the application. The highest-value gaps are project filtering, explicit maturity labels, a more focused hero message, clearer engineering evidence, and documentation of the next product phases.

## Existing Architecture

### Frontend

- React 18 with TypeScript and Vite 5.
- React Router with `/`, `/work/:slug`, and a catch-all page.
- Tailwind CSS plus shared CSS design tokens in `src/index.css`.
- Framer Motion for restrained entrance effects with reduced-motion handling.
- Centralized portfolio data in `src/data/projects.ts` and `src/data/experience.ts`.
- Reusable project cards, media, section headers, layout, theme, and preference controls.
- English/French strings in `src/i18n/I18nProvider.tsx`, with long project-copy localization in `src/i18n/portfolioContent.ts`.

### Public AI Assistant

- Lazy-loaded React assistant on every route.
- Separate FastAPI service in `portfolio-ai-api`.
- Public, read-only curated portfolio knowledge.
- Streaming answers, deterministic sources, CTAs, follow-up questions, input guards, and rate limiting.
- Render deployment configuration in `render.yaml`.

### Delivery

- Netlify builds with `npm run build` and publishes `dist`.
- SPA fallback preserves routed case-study URLs.
- Security headers, a restrictive content security policy, HSTS, and immutable asset caching are configured.
- The contact form has a static hidden Netlify blueprint in `index.html` and a matching React form.

## Existing User-Facing Features

- Responsive header and mobile navigation.
- English/French preference and light/dark theme controls.
- Hero with identity, specialization, location, CV, contact, project, experience, GitHub, and LinkedIn paths.
- About, experience, projects, expertise, background, education, certifications, and contact sections.
- Six featured projects with case-study routes.
- Four secondary engineering projects.
- Demo, GitHub, gallery, architecture, validation, security, outcome, and Human-in-the-Loop content where supported by evidence.
- Clickable full-resolution case-study media.
- Netlify contact submission with honeypot protection.
- Public CV files and certification evidence.

## SEO And Discoverability

### Present

- Descriptive title and meta description.
- Canonical home URL.
- Open Graph and Twitter metadata.
- Person structured data with verified public profile links.
- `robots.txt` and a sitemap containing the home page and all six case studies.
- Route-specific document title and description updates in the React pages.

### Gaps

- The application is client-rendered; crawlers without JavaScript receive only the shared `index.html` metadata.
- No static pre-render currently emits unique HTML for each case-study URL.
- No `hreflang` URLs exist because language is a client preference rather than separate localized routes.
- The main bundle is above Vite's 500 kB warning threshold and should be split further before adding large interactive labs.

## Accessibility And Responsive Baseline

### Present

- Semantic sections, headings, articles, lists, forms, and navigation landmarks.
- Visible focus styles and keyboard-operable buttons and links.
- Accessible menu labels, image alternative text, and form labels.
- `prefers-reduced-motion` support in global CSS and motion-aware Hero behavior.
- Responsive grid and stable media aspect ratios.

### Risks To Recheck

- Filter controls must expose their selected state with `aria-pressed`.
- Filtering must never leave projects permanently hidden and needs a clear reset path.
- Long bilingual labels must remain usable at narrow mobile widths.
- Contrast and keyboard focus should be checked in both themes after adding new badges and controls.

## Project Data Audit

- Project data is already centralized and should remain the single source of truth.
- Featured and secondary projects are already distinguished visually.
- Case studies are extensible through typed optional fields such as architecture, decisions, security, outcomes, gallery, and Human-in-the-Loop.
- Existing project facts are stronger than generic marketing copy: production RAG, audited test counts, explicit prototypes, deployed demos, and known limitations.
- Categories and maturity are not yet modeled explicitly, preventing reliable filtering and consistent maturity labels.
- The claim “more than five assistants deployed” is not stated in the repository evidence reviewed during this audit. It will not be published until a source is supplied.

## Missing Or Underdeveloped Phase 1 Features

1. Accessible category filters across both featured and secondary work.
2. Explicit, verified maturity values: Production, Deployed Demo, or Prototype.
3. A Hero headline that names RAG systems, AI agents, and intelligent automation directly.
4. A reduced set of three primary recruitment actions: projects, CV, and contact.
5. A clearly labeled engineering-highlights region using evidence already present in the portfolio.
6. Documentation for later case-study, lab, demo, and monitoring work.

Search is intentionally deferred: the portfolio currently contains ten projects, so category filters provide useful discovery without adding a redundant input.

## Regression Risks

- Changing the project model can break every project card and case-study lookup.
- Filtering can disturb the special wide layouts for the first two featured projects.
- Translation keys can silently fall back to English if one locale is omitted.
- Replacing the Netlify form structure could stop production submissions.
- Changing case-study slugs would break the sitemap and public links.
- Adding large libraries or eagerly loaded demos would worsen the current bundle warning.
- Publishing roadmap technologies as runtime capabilities would reduce portfolio credibility.

## Evolution Strategy

- Extend the existing project types instead of creating a second catalog.
- Keep current IDs, slugs, routes, images, links, and project ordering.
- Implement filters inside the existing Projects section with native buttons and React state.
- Preserve the flagship and spotlight layouts when those projects are visible.
- Add maturity badges directly to the reusable card components.
- Reuse the current design tokens and button styles; add no UI dependency.
- Keep future labs and demos documented until their data sources and execution boundaries are approved.

## Initial Validation

| Check | Baseline result |
| --- | --- |
| Git status | Clean on `main` before branch creation |
| Portfolio Vitest | 21/21 passed |
| ESLint | 0 errors, 6 existing Fast Refresh warnings |
| Production build | Passed |
| Vite bundle | Passed with a main-chunk warning above 500 kB |
| Typecheck script | Not defined separately; TypeScript is transformed by the current Vite build |
| Netlify config | Valid SPA build/publish/redirect structure by inspection |
| Sitemap | Home plus all six current case-study routes |
| Contact form | Static Netlify blueprint and React form both present |

The FastAPI assistant has its own pytest suite. It will be validated separately if the local Python environment has the locked dependencies available.

## Final Phase 1 Validation

| Check | Final result |
| --- | --- |
| Portfolio Vitest | 22/22 passed, including the new cross-catalog filter test |
| Assistant API pytest | 35/35 passed |
| Explicit TypeScript project check | Passed with `npx tsc -b --pretty false` |
| ESLint | 0 errors, 6 unchanged Fast Refresh warnings in existing UI utility modules |
| Production build | Passed |
| Public local routes | Home and all six case studies returned HTTP 200 |
| Public demo URLs | Portfolio, AI BOS, and SIHIA returned HTTP 200 on 2026-10-15 |
| CV assets | Both configured PDF files exist and are readable |
| Git diff validation | No whitespace errors |

The production build still reports that the main JavaScript chunk exceeds 500 kB. Route-level splitting and pre-rendering remain Phase 2/5 work rather than being hidden or misreported as complete.

Desktop and 390 px mobile screenshots were inspected with reduced-motion mode. The new Hero initially overflowed on mobile; its title and description constraints were corrected before final validation. Temporary screenshots were not retained in the repository.
