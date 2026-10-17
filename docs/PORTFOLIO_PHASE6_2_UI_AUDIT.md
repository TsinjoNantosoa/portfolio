# Phase 6.2 — UI/UX audit (measured at 100% zoom)

Date: 2026-10-17. Branch: `feature/phase6-2-ui-polish`, created from `fix/mobile-project-cards` (`419bd4c`, which holds the mobile project-card fix that is not yet in `main`).

## How it was measured

- Real Edge (Chromium) driven by Puppeteer, `deviceScaleFactor` 1, no browser zoom. Every screenshot is a 1:1 CSS-pixel capture; `innerWidth`, `devicePixelRatio` and the document height were logged for each one.
- Viewports: 1920×1080, 1440×900, 1280×800, 768×1024, 390×844, 320×734 (375×812 was not captured on its own; 360 and 390 bracket it, and 320–430 were swept for overflow). Dark and light themes, English and French.
- Computed styles read with `getComputedStyle` (font size, line height, widths) before any decision.
- Before = the committed tree, built and served locally. After = the working tree. Same script, viewports, themes and languages for both.
- The screenshots you shared with another assistant were not given to me, so I could not check that assistant's claims one by one. Instead, section "What was left alone" lists what I measured at 100% that would look small or narrow in a zoomed-out capture.

## Findings that reproduce at 100%

| # | Page / component | Problem (measured) | Impact | Priority | Fix | Regression risk |
|---|---|---|---|---|---|---|
| 1 | All pages, `PortfolioAssistantLauncher` | The invitation card is permanent on screens ≥640 px and floats forever (5 s infinite animation). The launcher's hit area is **350×145 px**, so a large invisible area intercepts clicks. At 1440×900 the card covers real content: the Offshore dashboard's "Human review" tile, the Lab's "Reference workflow" step "Fus…", experience text and tags. | Content hidden while reading; clicks swallowed near the bottom right | High | Show the invitation once per session, 2.5 s after load, for 9 s; add a dismiss button; stop the float; shrink the hit area to the 80 px avatar; keep the avatar always available | Low: presentation only; API, session, SSE untouched |
| 2 | Offshore Fares and the other case studies, gallery | Screenshots are displayed at about 650×325 px; their interface text is unreadable. A click opened the raw PNG in a new browser tab, with no caption, no navigation and no way back except the browser button. | The real product evidence cannot be read | High | Accessible image viewer (Radix Dialog already in the project): full image uncropped, caption, previous/next, arrow keys, Escape, focus trap, focus returns to the thumbnail | Low: new component, used only on case-study pages |
| 3 | Home, hero `h1` | 73.6 px / line-height 1.0 wrapping on **4 lines** at 1280–1920 px with the last word alone on its line ("Automation"). The "Engineering highlights" row started at y ≈ 780 and was cut by the fold at 900 px. | The first screen reads heavy; the proof row is partly below the fold | Medium | Size 64 px, column 760 px, line-height 1.08: 3 balanced lines in English; the highlights row now sits fully above the fold at 1440×900 | Low: one class string |
| 4 | Case studies (all) | Body text 15 px with line length up to ~86 characters; section headings 20 px, barely larger than the 15 px text; list items 14.5 px. | Slower reading on long technical pages; weak scanning hierarchy | Medium | Body 16 px / 1.7, lists 16 px, line length capped at 72ch, section headings 21.6 px mobile / 24 px from 640 px | Low: text sizes only; pages get slightly longer |
| 5 | `/lab`, hero | The three action links are inline elements with no spacing between them: "Open the RAG Playground" and "View AI Operations" touch each other. | Looks like a rendering bug on the page that showcases the work | Low | Wrap in a flex container with a 12 px gap | None |
| 6 | Whole site, `ThemeProvider` | With no saved choice the site always started in dark. The requested behaviour is to follow the system setting. Also, the theme was applied after React mounted, so a light-theme visitor with a saved choice saw a dark flash first. | Visitors whose system is light are forced into dark; flash of the wrong theme | Medium | Default to `system` when nothing is saved (a manual choice is still saved and kept) and apply the theme with a small inline script before first paint | Low-medium: changes what new visitors on a light system see; covered by 4 new tests |

## Seen and left alone

- Home `Index`, experience, contact form, footer, skills and expertise sections: reviewed at 1440 and 390 in both themes; no reproducible defect other than the invitation card covering them.
- Contact form (`portfolio-contact`): layout, labels and the Netlify form blueprint are fine and unchanged.
- Desktop container: 1320 px content at 1440 (60 px gutters); case-study column 896 px; Lab 812 px. Normal and unchanged.
- Hero photo and CTAs: aligned, and kept.
- Lab cards: density checked at 1440. The five domains are readable, links to case studies and project evidence are visible. No change: nothing was confirmed that justified hiding information.
- Screenshots in case studies: the hero images crop at most 6% on Offshore and AI BOS. Larger crops exist on Arcwell (28%), SIHIA and AI Sales Assistant (21%, 1024-px images stretched to 1318 px) and the Enterprise RAG screenshot (39%, an 820×844 image). Those need better source images, not CSS; the new viewer shows each file uncropped.

## Not done, needs your validation

- **Hero title wording.** The title "AI Engineer — RAG Systems, AI Agents & Intelligent Automation" now fits on 3 lines; the French title (74 characters) still takes 4 lines at desktop widths. A shorter title ("AI Engineer — RAG, agents and automation") would fit on 2 lines, but it changes the page's headline, so I did not apply it.
- **"At a glance" summary at the top of each case study** (problem, solution, my contribution, status). It would reuse documented facts, but the "my contribution" line does not exist as data today, and writing it is a content decision.
- **Better source images** for Arcwell, SIHIA, AI Sales Assistant and Enterprise RAG (see above).
