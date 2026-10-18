# Phase 6.3 — Premium motion: report

Branch `feature/phase6-3-motion` (from `main` at `2b306e3`). Nothing committed, pushed, merged or deployed. Backend, Render, Qdrant, OpenAI, n8n, API contracts, SEO, sitemap, 404 handling, WhatsApp, the Netlify form, the chatbot reliability code, the Operations Monitor, the Playground and the Automation Showcase were not touched. Measurement method and the pre-change inventory are in `PORTFOLIO_PHASE6_3_MOTION_AUDIT.md`.

## 1. Existing animations
Seven files used framer-motion (Hero, portrait, Experience, Expertise, project cards, mobile menu, app-wide config); the headline and the photo started invisible; the "network" around the portrait sat under the opaque photo frame and could not be seen; the photo floated in a permanent loop on desktop; the header underline had no transition; card hover also applied on touch. Details in the audit.

## 2. Implemented

| # | Effect | Where | Understanding | Interaction | Identity |
|---|---|---|---|---|---|
| 1 | **Hero entrance** (CSS): name, location, CTA row, socials rise 10 px / 520 ms, 70 ms apart. Eyebrow, headline, description and the photo are painted at once. | `Hero.tsx`, `motion.css` | | ✔ (calm arrival) | ✔ |
| 2 | **Scroll reveal**, once per block: section headers, About, Experience entries, project cards, expertise cards, skills, education, contact, Lab capability cards. 18 px / 520 ms, ≤ 5 steps of stagger. Safe by construction (visible by default; see below). | `src/motion/Reveal.tsx`, `useReveal.ts` | ✔ (reading order) | | ✔ |
| 3 | **Cards**: 3 px lift with a mouse only, accent border on hover and on keyboard focus inside the card; **buttons**: 1 px lift, arrow/download icon nudge, durations from tokens | `index.css`, `motion.css` | | ✔ | ✔ |
| 4 | **Portrait network**: 6 nodes and 12 thin links around the frame, a ring drawn once, one sweep of light, soft glow; slow node pulse only at ≥ 1024 px with a mouse; ±5 px parallax on mouse only; hover border glow and 2% scale kept | `ProfileImage.tsx`, `profile-image.css` | ✔ (a knowledge graph around an AI engineer) | ✔ | ✔ |
| 5 | **Lab reference workflows**: connector lines draw and the steps light up in order the first time a workflow is seen; hover colours a step. Conceptual: it shows the order of the stages, nothing runs. | `LabPage.tsx`, `motion.css` | ✔ | ✔ | ✔ |
| 6 | **Header**: underline always present and scaled (grows on hover, settles on the current entry); **theme change** softened for 300 ms, only on a manual change; **mobile menu** slide/fade now CSS and never unmounts/remounts mid-transition | `index.css`, `ThemeProvider.tsx`, `MobileMenu.tsx` | | ✔ | |
| 7 | **Motion tokens** (`--motion-fast 180ms`, `normal 300ms`, `reveal 520ms`, distances 10/18 px, stagger 70 ms, one easing) used by every new rule | `src/motion/motion.css` | | | ✔ |
| 8 | **framer-motion removed** (dependency, `MotionConfig`, 7 imports) | `package.json`, `package-lock.json` | | | |

Decorative-only effects and why they stay: the sweep of light and the node pulse (4 and 5 above) carry identity, run once or very slowly, only on large screens with a mouse, and are removed under reduced motion and on phones.

## 3. Safety of the reveal (tested)
- Visible by default. The hidden state is applied before the first paint, only to blocks below the fold, only if `IntersectionObserver` exists and motion is not reduced; positions are read together in one pass (a first version read them one block at a time and raised TBT to 424 ms).
- No `IntersectionObserver`: 0 blocks hidden. Reduced motion: 0 blocks hidden, no reveal attribute, only 0.01 ms animations remain, sweep hidden, ring already complete.
- Scroll-through on 1440, 390 and 320 px, dark and light: every block (26 on the home page) ends shown, none stays hidden.
- Direct link `/#education` shows its section; tabbing into a hidden block shows it; printing shows everything.
- Headline and description: opacity 1 the moment they exist, no animation.

## 4. Kept on purpose
Colours, spacing, layout, copy, the photo and its frame, the CTA hierarchy ("Let's Talk"), header links, the chatbot launcher and its rings, WhatsApp, the image viewer, case-study pages, all routes and metadata.

## 5. Dropped
Idle float of the photo (permanent movement), blur-and-scale entrance of the photo, any canvas/WebGL/particles/3D tilt, a sliding header indicator (would need JavaScript measurement), animation of the case-study body text.

## 6. Desktop, mobile, themes, languages
Checked at 1440 × 900, 390 × 844 and 320 × 734, dark and light, EN and FR, at 100% zoom (screenshots in the session folder `scratchpad\shots\m63\before|after`, not committed): no horizontal overflow, the network is visible and balanced around the photo in both themes (muted green on cream in light, no white halo), on phones the graph is drawn once and stays still, nothing covers the CTA row or the chatbot and WhatsApp buttons.

## 7. Tests
- TypeScript (both configs), ESLint: 0 errors, 6 warnings (same as before).
- Vitest: 29 files, **219 tests pass** (203 before; new: `Reveal`, `ProfileImage`, theme transition, mobile-menu transition). Build and `verify:seo` pass (11 routes, 20 rewrites).
- Browser checks (Edge, local build): 40+ motion checks pass: reveal, failure modes, hash links, card lift under a mouse and none on touch, keyboard-focus border, CTA lift and icon nudge, header underline states, theme transition class and its reduced-motion skip, portrait parallax and pulse on desktop only, Lab workflows lighting up once, mobile menu slide, Escape, focus return, and instant unmount with reduced motion.
- Regression sweeps re-run on this build: header/mobile menu/footer (20 states) and the earlier assistant, image-viewer, Lab and contact checks all pass; 54-check smoke test passes except the live chatbot answer, which cannot run on a local build (no API variable); no clipped content on 11 routes × 4 widths × 2 languages.
- **Accessibility: axe-core 0 violations** on the 44 standard states and on 8 full-page states scrolled through with all reveals shown and the portrait graphic present.
- Reduced motion verified as in section 3. CLS during load plus a full scroll: **0.0000** at 1440 and 390 px.

## 8. Performance (Lighthouse 12, local, simulated throttling, same machine and conditions, medians)

| Page | Mode | Score before → after | LCP ms | TBT ms | Transfer |
|---|---|---|---|---|---|
| Home | mobile | 87 → 86 (before runs 74–88, after 85–88 over 7 runs) | 3476 → 3471 | 84 → 162 | 340 → 316 KB |
| Home | desktop | 99 → 99 | 756 → 763 | 8 → 4 | 627 → 603 KB |
| Case study (Enterprise RAG) | mobile / desktop | 90 → 92 / 100 → 100 | 3081 → 2940 | 6 → 8 | 423 → 394 KB |
| Automation Showcase | mobile / desktop | 93 → 95 / 100 → 100 | 2725 → 2479 | 42 → 7 | 257 → 232 KB |

CLS 0 on every row; accessibility, SEO 100 and best practices 96 (identical before and after, local server) on every row.
- The shared chunk that carried framer-motion fell from 138.7 kB to 25.6 kB raw on every route.
- Script evaluation on the home page (Lighthouse main-thread breakdown, two paired runs each): 1076 / 760 ms before, 439 / 405 ms after.
- The home-page mobile score did not move beyond run-to-run noise, and its TBT is higher than the baseline's 84 ms (162 ms): the remaining long task is the React render of the home page, unchanged in size, plus about thirty reveal blocks and a few animated SVG strokes. No gain is claimed for the home page mobile score. The case-study and Showcase rows were measured before the last two corrections (batched measurement, menu mount fix), which do not touch those pages.
- These are lab numbers, not field data.

## 9. Problems found and fixed during validation
- The first network graphic was clipped on the right and bottom: Tailwind's `max-width: 100%` on SVGs cut it to the container. Fixed with `max-width: none`.
- TBT 424 ms on the home page from reading layout once per reveal block; fixed by batching (see section 3).
- The mobile menu briefly unmounted and remounted on close; fixed by keeping it mounted through the transition (found by a unit test).

## 10. To check before publishing
1. Watch the home page load once in each theme on a real phone and on a laptop with a mouse (entrance, graph, parallax), and scroll through the whole page once.
2. Open the Lab on a phone: workflows light up as they enter the screen.
3. Turn on "reduce motion" in the operating system and reload: nothing should move or be hidden.
4. `bun.lockb` is stale (framer-motion is gone from `package.json` and `package-lock.json`); the project builds with npm, so delete or regenerate it if you use Bun.
5. Check the Netlify Deploy Preview for the same behaviour, then compare Lighthouse on the preview URL.

## 11. Remaining issues
- Home-page mobile score unchanged (noise level) and TBT slightly above the baseline, as explained above. A real gain there needs lazy-loading below-the-fold sections (lot 3 of the roadmap), which this phase did not do.
- The sweep of light is the only effect that is purely decorative; remove `.profile-portrait__sweep` and its keyframes if you find it too much.

Phase 6.3 Premium Motion terminée — prête pour validation visuelle.
