# Phase 6.3 — Motion audit (before any change)

Date: 2026-10-18. Branch `feature/phase6-3-motion`, created from `main` at `2b306e3` (lot 2 already merged; working tree was clean).
Method: the committed tree built and served locally, Edge driven by Puppeteer at 100% zoom (`devicePixelRatio` 1), Lighthouse 12 with simulated throttling (median of 5 runs for the home page, 3 for the others), source read for every animation.

## 1. What already moved

| Where | What | Technology | Finding |
|---|---|---|---|
| Hero | Eyebrow, **headline**, name, description, location, CTA row, socials fade in from `opacity: 0` / `y: 14px`, staggered up to 0.38 s | framer-motion, started by JavaScript | The headline and description are what the visitor reads first and what the browser measures for LCP, and they start invisible. The block exists only after React renders. |
| Portrait | Frame fades and scales in from `opacity 0, scale .9, blur(3px)` over 0.85 s; glow fades in; hover `scale 1.025` | framer-motion | The photo (a likely LCP element) starts invisible, and a blur filter is animated. |
| Portrait | Ring drawn with `pathLength`, a sweep of light, three nodes with links, spring parallax (±5 px), idle float of 3 px **in a loop** on desktop | framer-motion + SVG | **The network was not visible.** The SVG sits underneath the opaque photo frame, so only a few pixels of it could show (checked in the 100% screenshot: no nodes, no links). The idle float is a permanent movement of the photo. |
| Experience, Expertise cards, Featured project cards | `whileInView` fade and 10–14 px rise, once | framer-motion | Works, but the only reveal on the site. About, Skills, Education, Contact, section headers and the Lab had none. |
| Mobile menu | Slide and fade, with exit animation | framer-motion `AnimatePresence` | Works. |
| Header | Active underline appears instantly | CSS | No transition. |
| Cards | `hover:-translate-y-0.5` (2 px), border to accent | Tailwind utility | Also applies on touch devices (sticky hover). No keyboard equivalent. |
| Buttons | `transition-all duration-300`, glow on hover | CSS | Fine; durations are not tied to any token. |
| Chatbot launcher | Entrance, pulse rings and badge until opened | CSS | Added in an earlier phase; left untouched. |
| Whole app | `MotionConfig reducedMotion="user"` | framer-motion | Covered framer only. |

No timing values were shared: durations of 0.35 s, 0.4 s, 0.42–0.52 s, 0.85 s, 1.05 s and 6 s appear inline in five files.

## 2. Cost of the existing approach (measured)

- framer-motion lives in the shared chunk `useSeo-*.js`, **138.7 kB raw**, requested (and preloaded) on every route, including pages that barely animate.
- Seven source files import it: `App.tsx`, `MobileMenu.tsx`, `Experience.tsx`, `Hero.tsx`, `Services.tsx`, `ProfileImage.tsx`, `FeaturedProjectCard.tsx`.
- Baseline Lighthouse (local, simulated throttling): home mobile median **87** (runs between 74 and 88, so run-to-run noise is large), home desktop 99, Enterprise RAG case study 90 / 100, Automation Showcase 93 / 100; CLS 0 everywhere; LCP home mobile 3476 ms, TBT 84 ms.

## 3. Proposals and decisions

| # | Proposal | Decision | Why |
|---|---|---|---|
| P1-1 | Hero entrance for secondary elements | **Do, in CSS.** Name, location, CTA row and socials rise 10 px over 520 ms, 70 ms apart. The eyebrow, headline and description are **not** animated. | The prompt asks not to delay the headline or LCP content; the description is the other candidate for LCP on phones. |
| P1-2 | Scroll reveal on sections | **Do.** One small `IntersectionObserver` component, used once per block, 18 px / 520 ms, once only. Applied to section headers, About, Experience entries, project cards, expertise cards, skills, education, contact, Lab capability cards. | Covers every section the prompt lists. Safe by construction (section 4). |
| P1-3 | Card and CTA micro-interactions | **Do.** Cards lift 3 px with a mouse only; keyboard focus gets the accent border; CTA lift 1 px and icon nudge; no hover transform on touch. | Same durations from tokens. |
| P2-4 | Network around the photo | **Do, rebuilt visibly.** Six nodes and twelve thin links around the frame (extending 8% past it), a ring drawn once, one sweep of light; a slow pulse only on screens ≥ 1024 px with a mouse. No canvas, no particles. | The previous one could not be seen. A knowledge-graph motif matches the RAG and agent positioning. |
| P2-5 | Workflow emphasis in the Lab | **Do.** Each reference workflow draws its connectors and lights its steps in order, once, when scrolled into view; hover colours a step. | Illustrates the order of stages. It is a conceptual diagram under the existing "Reference workflow" heading: nothing implies a live execution. |
| P3-6 | Header | **Do (small).** Underline always present and scaled: grows on hover, settles when current. Theme change softened for 300 ms. | The header was optimised in an earlier phase; no link added, nothing moved. |
| — | Replace framer-motion with CSS | **Do.** After the above, nothing imports it: dependency removed. | The prompt prefers CSS and asks not to add heavy libraries; this removes ~114 kB raw from the shared chunk. |
| — | Idle float of the portrait | **Remove.** | The prompt asks for no permanent movement of the photo. |
| — | Blur and scale entrance of the photo | **Remove.** | Delays the photo and animates a filter. |

## 4. Safety rules used for every effect

- **Visible by default.** The hidden starting state is set by script, before the first paint, only for blocks below the fold, when `IntersectionObserver` exists and the visitor has not asked for reduced motion. A block that is on screen at load, or above it, is never hidden.
- **Not stuck:** keyboard focus inside a hidden block shows it (`:focus-within`); direct links to `#education` and similar anchors reveal the target; printing shows everything; no observer means nothing is hidden.
- **Reduced motion:** CSS forces every reveal element visible, removes the Hero entrance, the sweep and the pulse, shows the finished network, and applies a global 0.01 ms cap on remaining animations and transitions. State changes still happen, instantly.
- **Properties:** `transform`, `opacity`, `stroke-dashoffset` (SVG stroke drawing) and colours on state changes. No layout properties.

## 5. Not done, on purpose

- No canvas, WebGL, particles, Lottie or 3D tilt of the photo.
- No sliding single-indicator header underline (would need position measurement in JavaScript).
- No animation of the case-study pages beyond the shared card and button behaviour, no change to the image viewer, the chatbot launcher, WhatsApp, Operations Monitor, Playground or Showcase.
