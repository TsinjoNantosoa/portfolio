# Phase 6.2 — Premium UI/UX polish: report

Date: 2026-10-17. Branch `feature/phase6-2-ui-polish`, created from `fix/mobile-project-cards` (`419bd4c`). Nothing was committed, pushed, merged or deployed. Render, Qdrant, OpenAI, n8n and the API contracts were not touched.

The measurement method and every finding are in `docs/PORTFOLIO_PHASE6_2_UI_AUDIT.md`. This report covers what changed and how it was checked.

## 1. Defects reproduced at 100% zoom

1. The chatbot invitation card was permanent, floated forever, and sat in a 350×145 px clickable box. It covered page content (Offshore dashboard tile, Lab workflow step, experience text and tags).
2. Case-study screenshots were about 650×325 px, unreadable, and opened as a raw file in a new tab.
3. The home headline wrapped on 4 lines at 73.6 px with a one-word last line; the highlights row was cut by the fold at 1440×900.
4. Case-study text was 15 px with lines up to ~86 characters; section headings (20 px) were barely larger than the text.
5. The two first action links on `/lab` touched each other.
6. With no saved choice the site started in dark whatever the system setting; the theme was applied after React mounted (flash for light-theme visitors).

## 2. Changes

| Area | Change | Files |
|---|---|---|
| Chatbot launcher | Invitation appears once per session 2.5 s after load, stays 9 s, can be dismissed (X button, keyboard reachable), opens the chat from its text; hidden below 640 px as before; the infinite float animation is removed (the entrance animation is kept and is disabled under reduced motion); the clickable box is now the 80 px avatar. Focus moves to the avatar if the invitation disappears while focused. | `PortfolioAssistantLauncher.tsx`, `index.css`, `I18nProvider.tsx` (new `assistant.dismissInvite`) |
| Image viewer | New `ImageLightbox` (Radix Dialog, already a dependency): full uncropped image, caption, position counter, previous/next buttons and arrow keys, Escape and close button, focus trap, focus returns to the thumbnail. Used for the lead image and the gallery of every case study (same file not listed twice). Text colours are fixed values so the light theme cannot make them unreadable. | `ImageLightbox.tsx` (new), `CaseStudyPage.tsx`, `I18nProvider.tsx` (`lightbox.*`, FR and EN) |
| Home headline | 64 px, 760 px column, line-height 1.08: 3 lines in English at 1280–1920 px; highlights row fully above the fold at 1440×900. Mobile unchanged. | `Hero.tsx` |
| Case-study text | Body 16 px / 1.7, lists 16 px, line length 72ch, section headings 21.6 px (24 px from 640 px). | `CaseStudyPage.tsx` |
| Lab hero | Three action links in a flex container with a 12 px gap. | `LabPage.tsx` |
| Theme | Default is the system setting when nothing is saved; manual choice is saved and kept; an inline script applies the theme before first paint on every page (also in each prerendered page and `404.html`). | `ThemeProvider.tsx`, `index.html` |
| Tests | 11 new tests: viewer (4), launcher invitation (3), theme (4). | `ImageLightbox.test.tsx`, `PortfolioAssistantLauncher.test.tsx`, `ThemeProvider.test.tsx` |

The light-theme invitation card now has an opaque background: `bg-[var(--surface-1)]/95` does not produce a valid colour in Tailwind, and over a dark screenshot the card was see-through in the light theme.

## 3. Kept on purpose

Dark identity, emerald accents, monospace labels, fine borders, status chips, photo, CTAs, all copy and facts, all routes, the design-system tokens and contrast values, the SEO source of truth and prerender, real 404s, the Netlify form blueprint, the Google verification file, the Operations Monitor, RAG Playground, Business Automation Showcase, the assistant API/session/SSE code, and the hero title wording.

## 4. Before / after captures

Same script, viewports (1440×900 and 390×844), themes, language, no zoom (`devicePixelRatio` 1). Files, outside the repository, in `C:\Users\Tsinjo\AppData\Local\Temp\claude\c--Users-Tsinjo-Documents-projet-portfolio-portfolio\bf30a14a-8d0b-4998-bbb5-665e7fbc7cce\scratchpad\shots\p62\`:

- `before\` and `after\`: `home-{d1440,m390}-{dark,light}-en-top.png`, `offshore-d1440-dark-en-*`, `lab-d1440-dark-en-*`, `off-y900/y1800/y2700.png` (before) and `off-y1000/y1800.png` (after), `invite-{light,dark}-fr.png`.
- `after\lightbox-1440-dark-en.png`, `lightbox-1440-light-en.png`, `lightbox-390-dark-fr.png`.
- Before-only desktop sweeps at 1920, 1440, 1280, 768, 390 and 320 are in `before\`.

## 5. Results

**Responsive.** 11 routes × widths 320/360/390/430 × EN/FR: no horizontal overflow and no clipped content (the only hit is a visually hidden heading). Home headline lines: EN 3 lines at 1280, 1440 and 1920; 3 at 768; 4–5 on phones (unchanged). FR 4 lines at desktop widths. 54-check browser sweep (direct URL, reload, 3 widths, 2 themes, 2 languages, 404 pages, Playground, Operations, Showcase, contact links): 53 pass on the local build; the one failure is the live chatbot answer, because a local build has no `VITE_PORTFOLIO_AI_API_URL` (set on Netlify) so the assistant is disabled locally. The same check passed against production before this phase; the chatbot's answer must be checked on the Netlify preview.

**Behaviour, checked in the browser:** invitation hidden at load, shown after 2.5 s, auto-hides after ~9 s, dismiss moves focus to the avatar, stays hidden after reload in the same session, absent on mobile, no animation under reduced motion; avatar opens the dialog, Escape closes it and focus returns. Viewer: opens from the keyboard, arrows and buttons navigate, focus stays inside, Escape and the close button close, focus returns to the thumbnail, works at 390 px in French. Lab links separated by 12 px. Theme: system light/dark with nothing saved, saved choice wins over the system setting both ways, the theme is correct before React loads, and a manual toggle persists after reload.

**Accessibility.** axe-core (WCAG 2.0/2.1/2.2 A/AA + best practices): 0 violations on the 44 page states (11 routes × EN/FR × dark/light) and on 24 new states (home with the invitation visible, Offshore case study, image viewer open; dark/light, EN/FR, 1440 and 390 px). One contrast violation found in the viewer's counter and caption in the light theme during testing was fixed before the final run.

**Tests.** TypeScript (app and node) pass; ESLint 0 errors, 6 warnings, as before; Vitest 19 files passed, 1 skipped; 138 passed, 4 skipped (127 before this phase); build passes; `npm run verify:seo` passes (11 routes, 20 rewrites, 404 checks).

**Performance** (Lighthouse 12, local, simulated throttling, medians, same machine and conditions for both builds, one after the other):

| Page | Mode | Score before → after | LCP ms before → after | TBT ms before → after |
|---|---|---|---|---|
| Home | mobile | 74 → 75 | 3477 → 3437 | 484 → 472 |
| Home | desktop | 99 → 99 | 838 → 810 | 43 → 30 |
| Case study (Enterprise RAG) | mobile | 91 → 90 | 3028 → 3094 | 38 → 44 |
| Case study | desktop | 100 → 99 | 679 → 742 | 0 → 0 |
| Automation Showcase | mobile | 93 → 94 | 2658 → 2649 | 59 → 47 |
| Automation Showcase | desktop | 100 → 100 | 609 → 608 | 0 → 0 |

CLS 0 everywhere; accessibility, best practices and SEO 100 on every row. Home mobile varies from 72 to 79 between runs of the same build, so ±1 is noise. The case-study page grows by 14 KB (415 → 429 KB transferred), the cost of the viewer and its dialog code; the main script grew from 250.83 to 253.01 kB (gzip 81.13 → 81.73 kB). Home transfer is unchanged (344 KB). These are lab figures, not field data.

## 6. Mistakes avoided by checking zoom

I did not receive the zoomed-out captures or the other assistant's notes, so I cannot say which of its observations came from browser zoom. What I did was measure, at 100%, the things that look smaller or narrower when a page is captured below 100%, and I left them alone because they were correct:

- Body text is 16 px on the home page; case-study text was 15 px (changed on purpose, finding 4); the hero eyebrow and labels are 10–12 px monospace by design.
- Content width is 1320 px at 1440 (60 px gutters), 896 px for case studies and 812 px for the Lab; wide empty margins on a 1920 capture are the container, not a defect.
- At 1440×900 the home page is 10,200 px tall and the first section is 1,268 px, so several sections share one zoomed-out capture.
- Section spacing, card padding, the hero photo size (340 px) and the header height are as designed.

## 7. Remaining issues and recommendations

- **Needs your decision:** the hero title (a shorter wording would take 2 lines; the French title still takes 4) and an "at a glance" block on case studies (problem, solution, my contribution, status). Both are content choices; see the audit.
- **Source images:** Arcwell, SIHIA, AI Sales Assistant and Enterprise RAG screenshots are low-resolution or have the wrong aspect ratio for their frame. The viewer shows them uncropped, but they stay soft at full size; replace the files if you have originals.
- **New behaviour to be aware of:** visitors whose system is set to light now see the light theme on their first visit.
- **Check on the Netlify preview before merging:** the chatbot answering (disabled in a local build), the invitation card at 1280–1920 px, the viewer on a real phone, and the home page in both themes.
- **Not run:** Google's Rich Results test; field Core Web Vitals; Lighthouse for the viewer-open state.
- A leftover folder `wt-base` remains in the scratchpad (a temporary build of the previous commit, no longer registered in Git); it is outside the project and can be deleted.

Phase 6.2 UI/UX terminée — prête pour validation visuelle.
