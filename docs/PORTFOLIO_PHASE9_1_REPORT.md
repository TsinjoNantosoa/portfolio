# Portfolio Phase 9.1 - Retail AI Visual Showcase

Date: 2026-10-30  
Branch: `feature/phase9-1-retail-visual-showcase`

No commit, push, merge, deployment, production-variable change, Qdrant ingestion, paid OpenAI call, n8n workflow change, or backend contract change was performed.

## Result

- The seventh featured project is now a deliberate wide card instead of an isolated half-width card.
- Layout is driven by `featuredLayout` metadata, not project IDs, and remains wide under project filters.
- The Retail card uses a sanitized KPI/workflow screenshot, concise proof points, a compact stack, and only the case-study link.
- `90/100` remains explicitly limited to the synthetic P001 scenario inside the case study. It is not displayed as reliability, accuracy, or production performance.
- The case study now includes a six-step demonstration walkthrough and five documented visual proofs with bilingual alternative text, captions, descriptions, lazy loading, `object-contain`, and the existing keyboard-accessible lightbox.

## Screenshot inventory and publication decision

The supplied archive was extracted only to a temporary review directory. None of its raw screenshots or workflow exports was copied to `public/`.

| Raw capture | Decision | Public asset | Reason / transformation |
| --- | --- | --- | --- |
| `Screenshot 2026-10-30 124453.png` | Excluded | - | Supervisor overview was redundant and exposed small internal workflow references. |
| `Screenshot 2026-10-30 125150.png` | Retained | `retail-ai-kpi-analysis.png` | Execution date/ID and editor controls covered with opaque masks; re-encoded as a new PNG. |
| `Screenshot 2026-10-30 125938.png` | Excluded | - | Combined supervisor view exposed several internal workflow references and duplicated architecture evidence. |
| `Screenshot 2026-10-30 130141.png` | Retained | `retail-ai-rag-retrieval.png` | Visual inspection found no personal identifier or secret; re-encoded and renamed. |
| `Screenshot 2026-10-30 130325.png` | Retained | `retail-ai-quality-investigation.png` | Visual inspection found no personal identifier or secret; re-encoded and renamed. |
| `Screenshot 2026-10-30 130731.png` | Retained | `retail-ai-approved-incident-audit.png` | Incident and case identifiers covered by three opaque masks; re-encoded and renamed. |
| `Screenshot 2026-10-30 130851.png` | Excluded | - | Gateway overview exposed internal references and was redundant with the voice proof. |
| `Screenshot 2026-10-30 131009.png` | Excluded | - | Tool-router view exposed multiple internal workflow references. |
| `Screenshot 2026-10-30 132322.png` | Retained | `retail-ai-voice-orchestration.png` | Visual inspection found no personal identifier or secret; re-encoded and renamed. |

The five public variants total 514,723 bytes. Their generated PNG properties contain only format fields (dimensions, bit depth, and color type), not inherited EXIF or text metadata. No raw `Screenshot 2026-10-30...` filename exists under `public/`. Tesseract was unavailable locally, so content validation combined original-resolution visual inspection, explicit masking, re-encoding, and repository scans.

## UI and content changes

### Project grid

- Extended `featuredLayout` with `spotlight` and `wide` values.
- Preserved the existing flagship and Offshore layouts through metadata.
- Assigned Retail the `wide` layout and added a regression test for the complete grid and the AI Agents filter.
- Desktop uses an image/content split. Tablet and mobile stack the image above the content.
- The full screenshot is centered in a stable 2:1 media area instead of stretching a letterboxed image to the text column height.

### Retail card

- Status: `Functional POC - Agentic AI - Retail Quality Automation`.
- Proof: two LLM agents, 16 modular n8n workflows, and human approval plus audit.
- No live-demo or source-code link is presented.
- The compact stack stays focused on n8n, OpenAI, Qdrant, PostgreSQL, Telegram, RAG, and human-in-the-loop control.

### Case study

- Preserved the documented business problem, deterministic control boundaries, security, evaluation, limitations, and future improvements.
- Added a visual walkthrough: quality signal -> deterministic KPI -> RAG procedure -> AI investigation -> human approval -> action and audit.
- Added an `Evidence gallery / Galerie de preuves` after the walkthrough.
- Kept the existing lightbox behavior: dialog semantics, Escape close, previous/next keyboard navigation, captions, and focus handling.
- Added complete English/French copy for the new summary, status, proof, image alternatives, titles, and explanations.

## Responsive and visual validation

Chrome DevTools Protocol was used to render the actual application and measure the Retail card and evidence gallery.

| Viewport | Document width | Retail behavior | Gallery |
| --- | ---: | --- | --- |
| 320 px | 320 px | stacked, 288 px card, no horizontal overflow | 5 figures, 5 contain images |
| 375 px | 375 px | stacked, 343 px card, no horizontal overflow | 5 figures, 5 contain images |
| 768 px | 768 px | stacked, 720 px card, no horizontal overflow | 5 figures, 5 contain images |
| 1024 px | 1024 px | wide layout, 968 px card, no horizontal overflow | 5 figures, 5 contain images |
| 1440 px | 1440 px | split layout, 1320 px card, no horizontal overflow | 5 figures, 5 contain images |

Visual review confirmed readable captions, stable media dimensions, preserved screenshot content, no incoherent overlap, and the expected transition from stacked to split layout. Temporary screenshots used for this review were not added to the repository.

## Validation results

| Check | Result |
| --- | --- |
| ESLint | Passed with 0 errors; 6 pre-existing Fast Refresh warnings in shared UI files |
| TypeScript (`tsc --noEmit`) | Passed |
| Vitest | 33 files validated in isolated batches; 256 tests passed |
| Conditional Offshore integration tests | 4 skipped by their existing configuration |
| Production build | Passed in 21.54 s; 1,905 modules transformed |
| Main JS chunk | 293.40 kB, 96.17 kB gzip |
| Case-study chunk | 61.49 kB, 18.00 kB gzip |
| SEO verification | Passed for 12 routes and 22 rewrites |
| `llms.txt` verification | Passed: UTF-8, v2 structure, valid links, no placeholders or secret patterns |
| `git diff --check` | Passed |

The test runner buffers output for large suites in this Windows environment. Running all 33 files in isolated domain batches prevented an open worker from hiding progress and validated every configured test. A pre-existing React test warning about `fetchPriority` was also observed and was not introduced or changed in this phase.

## Files changed

- `src/types/portfolio.ts`: gallery presentation fields and metadata-driven layouts.
- `src/data/projects.ts`: Retail copy, proof, layout, sanitized lead image, and five-image gallery.
- `src/i18n/portfolioContent.ts`: French translations for all new public copy.
- `src/components/Sections/Projects.tsx`: metadata-driven wide-card selection.
- `src/components/project/FeaturedProjectCard.tsx`: Retail wide density, status, and stable contained media.
- `src/components/project/RetailCaseStudyEvidence.tsx`: six-step walkthrough and gallery slot.
- `src/pages/CaseStudyPage.tsx`: descriptive captions, evidence-gallery placement, localized label, and contain rendering.
- `src/components/Sections/Projects.test.tsx`: wide layout and filter regression coverage.
- `src/pages/RetailCaseStudyPage.test.tsx`: gallery, bilingual content, lightbox, and no-demo checks.
- `public/portfolio-uploads/retail-ai-*.png`: five sanitized, renamed publication variants.

## Chatbot knowledge synchronization

The frontend project description changed, but this phase deliberately did not modify or ingest the backend corpus. The public case-study route and chatbot contracts remain intact. To synchronize chatbot knowledge later:

1. Review and approve the final public project text.
2. Run `npm run knowledge:build` and inspect the generated JSON and manifest diff.
3. Run the offline knowledge and retrieval tests without provider calls.
4. Use `python scripts/ingest_portfolio.py --dry-run` from `portfolio-ai-api` against an isolated staging configuration.
5. Only after explicit approval, ingest into the intended staging collection and validate readiness, citations, refusal behavior, and corpus version.
6. Promote the same reviewed corpus to production through the existing deployment procedure. Do not recreate or mutate a production collection ad hoc.

Until that separate step is approved, the production chatbot may continue answering from its previously ingested corpus version; no automatic production mutation was attempted here.

## Residual risks and non-claims

- The workflow archive still contains no reproducible automated test suite for the Retail POC itself. Portfolio tests validate presentation and documented claims, not workflow reliability.
- Screenshots prove selected synthetic demonstration paths only; they do not establish production availability, concurrency safety, provider-failure recovery, or model accuracy.
- `90/100` is a deterministic synthetic P001 risk score, not a quality, coverage, confidence, or reliability percentage.
- No client production deployment, public live demo, public source repository, or real business dataset is claimed.
- OCR-based security review was unavailable; opaque masking and manual original-resolution review were used instead.
