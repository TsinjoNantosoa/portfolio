import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Workflow } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ProjectMedia, { ProjectMediaPlaceholder } from "@/components/ui-kit/ProjectMedia";
import ArchitectureDiagram from "@/components/project/ArchitectureDiagram";
import RetailCaseStudyEvidence from "@/components/project/RetailCaseStudyEvidence";
import ImageLightbox, { type LightboxImage } from "@/components/project/ImageLightbox";
import { getFeaturedProjectBySlug } from "@/data/projects";
import { useI18n } from "@/i18n/I18nProvider";
import { localizePortfolioText } from "@/i18n/portfolioContent";
import { getNotFoundSeo, getProjectSeo } from "@/seo/routes";
import { useSeo } from "@/seo/useSeo";
import type { ProjectMaturity } from "@/types/portfolio";

const maturityKeys: Record<ProjectMaturity, "maturity.production" | "maturity.deployedDemo" | "maturity.prototype" | "maturity.research"> = {
  Production: "maturity.production",
  "Deployed Demo": "maturity.deployedDemo",
  Prototype: "maturity.prototype",
  Research: "maturity.research",
};

const CaseStudyPage: React.FC = () => {
  const { language, t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getFeaturedProjectBySlug(slug) : undefined;
  const [mediaFailed, setMediaFailed] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useSeo(project ? getProjectSeo(project, language, localizePortfolioText) : getNotFoundSeo(language));

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-white">
        <Header />
        <main className="site-container pb-20 pt-28">
          <h1 className="mb-4 text-3xl font-semibold">{t("case.notFound")}</h1>
          <Link to="/#projects" className="text-neon hover:underline">
            {t("notFound.work")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;
  const hasMediaSlot = hasMedia || Boolean(project.imagePending);
  const mediaAlt =
    localizePortfolioText(project.imageAlt, language) || `${project.title} product screenshot`;
  // One viewer for the lead image and the gallery, without showing the same file twice.
  const lightboxImages: LightboxImage[] = [];
  if (hasMedia && project.imageUrl) lightboxImages.push({ src: project.imageUrl, alt: mediaAlt, caption: project.title });
  for (const image of project.gallery ?? []) {
    if (lightboxImages.some((item) => item.src === image.src)) continue;
    lightboxImages.push({
      src: image.src,
      alt: localizePortfolioText(image.alt, language),
      caption: [
        localizePortfolioText(image.title, language),
        localizePortfolioText(image.description, language),
      ].filter(Boolean).join(" — "),
    });
  }
  const lightboxIndexOf = (src: string) => lightboxImages.findIndex((item) => item.src === src);
  const enlargeLabel = (title: string) => `${t("lightbox.enlarge")}: ${title}`;
  const galleryLabel = project.retailEvidence
    ? language === "fr" ? "Galerie de preuves" : "Evidence gallery"
    : t("case.gallery");
  const caseNavigation = [
    project.overview && { id: "overview", label: t("case.overview") },
    project.architecture?.length && { id: "architecture", label: t("case.architecture") },
    project.retailEvidence && { id: "retail-architecture", label: t("case.architectureDiagram") },
    project.retailEvidence && { id: "retail-agents", label: language === "fr" ? "Agents" : "Agents" },
    project.retailEvidence && { id: "retail-kpi", label: "KPI" },
    project.gallery?.length && { id: "evidence-gallery", label: galleryLabel },
    project.howItWorks?.length && { id: "workflow", label: t("case.workflow") },
    project.security?.length && { id: "security", label: t("case.reliability") },
    project.evaluation?.length && { id: "evaluation", label: t("case.evaluation") },
    project.proof?.length && { id: "results", label: t("case.results") },
    project.limitations?.length && { id: "limitations", label: t("case.limitations") },
    { id: "stack", label: t("case.stack") },
  ].filter((item): item is { id: string; label: string } => Boolean(item));

  const gallerySection = project.gallery && project.gallery.length > 0 ? (
    <section id="evidence-gallery" className="scroll-mt-24" aria-labelledby="project-gallery-title">
      <h2 id="project-gallery-title" className="mb-4 text-[1.35rem] font-semibold sm:text-2xl">
        {galleryLabel}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {project.gallery.map((image, index) => (
          <figure
            key={image.src}
            className={`overflow-hidden rounded-xl border border-white/10 bg-[var(--surface-1)] ${index === 0 ? "lg:col-span-2" : ""}`}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(lightboxIndexOf(image.src))}
              className="group/media block w-full cursor-zoom-in overflow-hidden bg-[#0b1019] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              aria-haspopup="dialog"
              aria-label={enlargeLabel(localizePortfolioText(image.title, language))}
            >
              <img
                src={image.src}
                alt={localizePortfolioText(image.alt, language)}
                loading="lazy"
                decoding="async"
                width={1550}
                height={620}
                className={`aspect-[2/1] h-auto w-full ${image.fit === "contain" ? "object-contain" : "object-cover object-top"} transition duration-300 group-hover/media:brightness-110`}
              />
            </button>
            <figcaption className="border-t border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {localizePortfolioText(image.title, language)}
              </p>
              {image.description ? (
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {localizePortfolioText(image.description, language)}
                </p>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <Header />
      <main className="site-container pb-16 pt-28 sm:pb-20">
        <Link
          to="/#projects"
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-white/60 hover:text-neon"
        >
          <ArrowLeft size={16} />
          {t("case.backWork")}
        </Link>

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-neon">
          {project.number} / {localizePortfolioText(project.label, language)}
        </p>
        <h1 className="mb-3 max-w-4xl font-sans text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.subtitle ? (
          <p className="mb-4 max-w-[720px] text-[16px] leading-relaxed text-[var(--text-secondary)]">
            {localizePortfolioText(project.subtitle, language)}
          </p>
        ) : (
          <p className="mb-4 max-w-[720px] text-lg leading-relaxed text-[var(--text-secondary)]">
            {localizePortfolioText(project.plainSummary, language)}
          </p>
        )}
        <p className="mb-8 max-w-[720px] break-words font-mono text-sm leading-relaxed text-[var(--text-muted)]">
          {localizePortfolioText(project.technicalSummary, language)}
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-neon/35 bg-neon/[0.08] px-3 py-1.5 font-mono text-xs text-neon">
            {t(maturityKeys[project.maturity])}
          </span>
          {project.status ? (
            <span className="inline-flex max-w-full whitespace-normal rounded-2xl border border-white/10 px-3 py-1.5 font-mono text-xs leading-relaxed text-[var(--text-muted)] sm:rounded-full">
              {localizePortfolioText(project.status, language)}
            </span>
          ) : null}
        </div>

        {hasMediaSlot && (
          <div className="mb-10 min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10">
            {hasMedia && project.imageUrl ? (
              <button
                type="button"
                onClick={() => setLightboxIndex(lightboxIndexOf(project.imageUrl as string))}
                className="group/media block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-haspopup="dialog"
                aria-label={enlargeLabel(project.title)}
              >
                <ProjectMedia
                  src={project.imageUrl}
                  alt={mediaAlt}
                  aspectClassName={project.imageFit === "contain" ? "aspect-[2/1]" : "aspect-[16/10]"}
                  objectPosition={project.showArchitectureDiagram ? "object-right" : "object-top"}
                  objectFit={project.imageFit}
                  imageClassName={`${project.showArchitectureDiagram ? "origin-right scale-[1.2]" : ""} transition duration-300 group-hover/media:brightness-110`}
                  onError={() => setMediaFailed(true)}
                />
              </button>
            ) : (
              <ProjectMediaPlaceholder
                title={project.title}
                subtitle={localizePortfolioText(project.subtitle || project.label, language) || project.label}
                alt={mediaAlt}
              />
            )}
          </div>
        )}

        <nav className="mb-10 border-y border-white/10 py-3" aria-label={t("case.navigation")}>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {caseNavigation.map((item) => (
              <li key={item.id}>
                <a className="inline-flex min-h-9 items-center text-xs text-[var(--text-muted)] transition hover:text-neon" href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mb-10 flex flex-wrap gap-4">
          {project.labDemoLink && (
            <Link
              to={project.labDemoLink}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-black"
            >
              <Workflow size={16} />
              {language === "fr" ? "Tester la démonstration d’automatisation" : "Try the interactive automation demo"}
            </Link>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-black"
            >
              <ExternalLink size={16} />
              {t("work.demo")}
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm"
            >
              <Github size={16} />
              {t("work.code")}
            </a>
          )}
        </div>

        {!project.retailEvidence && gallerySection ? <div className="mb-10">{gallerySection}</div> : null}

        <div className="grid gap-8 lg:grid-cols-2">
          {project.overview && (
            <section id="overview" className="scroll-mt-24">
              <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.overview")}</h2>
              <p className="text-base leading-[1.7] text-[var(--text-secondary)]">
                {localizePortfolioText(project.overview, language)}
              </p>
            </section>
          )}
          {project.problem && (
            <section>
              <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.problem")}</h2>
              <p className="text-base leading-[1.7] text-[var(--text-secondary)]">
                {localizePortfolioText(project.problem, language)}
              </p>
            </section>
          )}
          {project.solution && (
            <section>
              <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.solution")}</h2>
              <p className="text-base leading-[1.7] text-[var(--text-secondary)]">
                {localizePortfolioText(project.solution, language)}
              </p>
            </section>
          )}
          {project.architecture && project.architecture.length > 0 && (
            <section id="architecture" className="scroll-mt-24">
              <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.architecture")}</h2>
              <ul className="space-y-2.5 text-base leading-[1.65] text-[var(--text-secondary)]">
                {project.architecture.map((item) => (
                  <li key={item}>• {localizePortfolioText(item, language)}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {project.showArchitectureDiagram ? (
          <section className="mt-10 scroll-mt-24" aria-labelledby="visual-architecture-title">
            <h2 id="visual-architecture-title" className="mb-4 text-[1.35rem] font-semibold sm:text-2xl">
              {t("case.architectureDiagram")}
            </h2>
            <ArchitectureDiagram />
          </section>
        ) : null}

        {project.retailEvidence ? (
          <RetailCaseStudyEvidence evidence={project.retailEvidence} language={language} evidenceGallery={gallerySection} />
        ) : null}

        {project.howItWorks && project.howItWorks.length > 0 && (
          <section id="workflow" className="mt-10 scroll-mt-24">
            <h2 className="mb-4 text-[1.35rem] font-semibold sm:text-2xl">{t("case.workflow")}</h2>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {project.howItWorks.map((step, index) => (
                <li
                  key={step}
                  className="border-t border-white/10 pt-3 text-[15px] text-[var(--text-secondary)]"
                >
                  <span className="mb-1 block font-mono text-xs text-neon">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {localizePortfolioText(step, language)}
                </li>
              ))}
            </ol>
          </section>
        )}

        {project.decisionHighlight && (
          <section className="mt-10 rounded-2xl border border-neon/25 bg-neon/[0.04] p-6 sm:p-7">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neon">
              {t("case.keyDecision")}
            </p>
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl text-[var(--text-primary)]">
              {localizePortfolioText(project.decisionHighlight.title, language)}
            </h2>
            <p className="max-w-[72ch] text-base leading-[1.7] text-[var(--text-secondary)]">
              {localizePortfolioText(project.decisionHighlight.body, language)}
            </p>
          </section>
        )}

        {project.decisions && project.decisions.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.decisions")}</h2>
            <ul className="space-y-2.5 text-base leading-[1.65] text-[var(--text-secondary)]">
              {project.decisions.map((item) => (
                <li key={item}>• {localizePortfolioText(item, language)}</li>
              ))}
            </ul>
          </section>
        )}

        {project.scoring && (
          <section className="mt-10">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.scoring")}</h2>
            <p className="mb-4 max-w-[72ch] text-base leading-[1.7] text-[var(--text-secondary)]">
              {localizePortfolioText(project.scoring.summary, language)}
            </p>
            <div className="layout-grid">
              <div className="col-span-12 sm:col-span-6 lg:col-span-5">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  {t("case.factors")}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.scoring.factors.map((factor) => (
                    <li
                      key={factor}
                      className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-white/70"
                    >
                      {localizePortfolioText(factor, language)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  {t("case.range")}
                </p>
                <p className="font-mono text-lg text-[var(--text-primary)]">
                  {project.scoring.range}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  {t("case.classification")}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.scoring.classes.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-neon/25 bg-neon/5 px-3 py-1 font-mono text-xs text-neon"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {project.automation && (
          <section className="mt-10">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.automation")}</h2>
            <p className="mb-4 max-w-[72ch] text-base leading-[1.7] text-[var(--text-secondary)]">
              {localizePortfolioText(project.automation.summary, language)}
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {project.automation.workflows.map((workflow) => (
                <li
                  key={workflow}
                  className="border-t border-white/10 pt-3 text-[15px] text-[var(--text-secondary)]"
                >
                  {localizePortfolioText(workflow, language)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.hitl && (
          <section className="mt-10">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.hitl")}</h2>
            <p className="max-w-[72ch] text-base leading-[1.7] text-[var(--text-secondary)]">
              {localizePortfolioText(project.hitl, language)}
            </p>
          </section>
        )}

        {project.security && project.security.length > 0 && (
          <section id="security" className="mt-10 scroll-mt-24">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.reliability")}</h2>
            <ul className="space-y-2.5 text-base leading-[1.65] text-[var(--text-secondary)]">
              {project.security.map((item) => (
                <li key={item}>• {localizePortfolioText(item, language)}</li>
              ))}
            </ul>
          </section>
        )}

        {project.integrations && project.integrations.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-[1.35rem] font-semibold sm:text-2xl">{t("case.integrations")}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {project.integrations.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-[var(--surface-1)] p-3 text-sm text-[var(--text-secondary)]">
                  {localizePortfolioText(item, language)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.evaluation && project.evaluation.length > 0 && (
          <section id="evaluation" className="mt-10 scroll-mt-24">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.evaluation")}</h2>
            <ul className="space-y-2.5 text-base leading-[1.65] text-[var(--text-secondary)]">
              {project.evaluation.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="text-neon" aria-hidden>✓</span>
                  <span>{localizePortfolioText(item, language)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.outcomes && project.outcomes.length > 0 && (
          <section id="results" className="mt-10 scroll-mt-24">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.outcomes")}</h2>
            <ul className="space-y-2.5 text-base leading-[1.65] text-[var(--text-secondary)]">
              {project.outcomes.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="text-neon" aria-hidden>✓</span>
                  <span>{localizePortfolioText(item, language)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.learnings && project.learnings.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.learnings")}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.learnings.map((item) => (
                <li key={item} className="border-t border-white/10 pt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {localizePortfolioText(item, language)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.proof && project.proof.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-[1.35rem] font-semibold sm:text-2xl">{t("case.results")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.proof.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4"
                >
                  <p className="font-mono text-2xl font-semibold text-neon">{localizePortfolioText(item.value, language)}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{localizePortfolioText(item.label, language)}</p>
                  {item.hint ? (
                    <p className="mt-1 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]/80">
                      {localizePortfolioText(item.hint, language)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {project.limitations && project.limitations.length > 0 && (
          <section id="limitations" className="mt-10 scroll-mt-24 border-l-2 border-amber-400/60 pl-5">
            <h2 className="mb-3 text-[1.35rem] font-semibold sm:text-2xl">{t("case.limitations")}</h2>
            <ul className="space-y-2.5 text-base leading-[1.65] text-[var(--text-secondary)]">
              {project.limitations.map((item) => (
                <li key={item}>• {localizePortfolioText(item, language)}</li>
              ))}
            </ul>
          </section>
        )}

        <section id="stack" className="mt-10 scroll-mt-24">
          <h2 className="mb-4 text-[1.35rem] font-semibold sm:text-2xl">{t("case.stack")}</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-xs text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>
      <ImageLightbox
        images={lightboxImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        labels={{ close: t("lightbox.close"), previous: t("lightbox.previous"), next: t("lightbox.next") }}
      />
      <Footer />
    </div>
  );
};

export default CaseStudyPage;
