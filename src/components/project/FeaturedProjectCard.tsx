import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { FeaturedProject } from "@/types/portfolio";
import ProjectMedia, { ProjectMediaPlaceholder } from "@/components/ui-kit/ProjectMedia";
import { useI18n } from "@/i18n/I18nProvider";
import { localizePortfolioText } from "@/i18n/portfolioContent";

const maturityKey = {
  Production: "maturity.production",
  "Deployed Demo": "maturity.deployedDemo",
  Prototype: "maturity.prototype",
  Research: "maturity.research",
} as const;

interface FeaturedProjectCardProps {
  project: FeaturedProject;
  index?: number;
  className?: string;
  density?: "flagship" | "spotlight" | "media" | "editorial";
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  index = 0,
  className = "",
  density = "media",
}) => {
  const { language, t } = useI18n();
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;
  const isFlagship = density === "flagship";
  const isSpotlight = density === "spotlight";
  const isWide = isFlagship || density === "spotlight";
  const hasMediaSlot = hasMedia || Boolean(project.imagePending);
  const highlightLimit = 3;
  const splitWide = isWide && !hasMediaSlot;

  const renderBody = (options?: { hideProof?: boolean }) => (
    <div className={`flex h-full flex-col ${isWide ? "p-5 sm:p-7" : "p-5 sm:p-6"}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="font-mono text-[13px] font-semibold leading-none text-white/35"
        >
          {project.number}
        </span>
        <span className="h-3 w-px bg-white/20" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-neon/90">
          {localizePortfolioText(project.label, language)}
        </span>
        <span className="ml-auto inline-flex min-h-7 items-center rounded-full border border-white/15 bg-white/[0.035] px-2.5 font-mono text-[10px] uppercase text-[var(--text-muted)]">
          {t(maturityKey[project.maturity])}
        </span>
      </div>

      {isFlagship && (
        <span className="mb-3 inline-flex min-h-7 w-fit items-center rounded-full border border-neon/25 bg-neon/[0.07] px-3 font-mono text-[11px] text-neon">
          {t("work.professional")}
        </span>
      )}

      <h3
        className={`mb-3 font-semibold tracking-tight text-[var(--text-primary)] ${
          isWide
            ? "text-[clamp(1.55rem,2vw,2rem)]"
            : "text-[clamp(1.35rem,1.7vw,1.75rem)]"
        }`}
      >
        {project.title}
      </h3>

      <p className="mb-2 line-clamp-3 text-[15.5px] leading-[1.6] text-[var(--text-secondary)]">
        {localizePortfolioText(project.plainSummary, language)}
      </p>
      <p className="mb-4 line-clamp-2 font-mono text-[12.5px] leading-relaxed text-[var(--text-muted)]">
        {localizePortfolioText(project.technicalSummary, language)}
      </p>

      <ul className="mb-5 space-y-2.5">
        {project.highlights.slice(0, highlightLimit).map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[14.5px] leading-[1.5] text-[var(--text-secondary)]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
            <span>{localizePortfolioText(item, language)}</span>
          </li>
        ))}
      </ul>

      {!options?.hideProof && project.proof && project.proof.length > 0 && (
        <div className="mb-5 grid grid-cols-3 gap-2 border-y border-white/10 py-3.5">
          {project.proof.map((item) => (
            <div key={item.label}>
              <p className="font-mono text-lg font-semibold text-neon">{localizePortfolioText(item.value, language)}</p>
              <p className="mt-0.5 text-xs leading-snug text-[var(--text-muted)]">{localizePortfolioText(item.label, language)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 6).map((tech) => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4">
        <Link
          to={project.caseStudyLink}
          className="text-link group/link"
        >
          {t("work.caseStudy")}
          <ArrowUpRight size={15} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
        {project.demoLink && (
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-white"
          >
            <ExternalLink size={14} />
            {t("work.demo")}
          </a>
        )}
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-white"
          >
            <Github size={14} />
            {t("work.code")}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={`surface-card surface-card-hover group h-full ${className}`}
    >
      {splitWide ? (
        <div className="layout-grid !gap-0">
          <div className="col-span-12 border-b border-white/10 lg:col-span-7 lg:border-b-0 lg:border-r">
            {renderBody({ hideProof: true })}
          </div>
          <div className="col-span-12 flex flex-col justify-center gap-5 p-6 sm:p-7 lg:col-span-5">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neon">
                {t("work.businessValue")}
              </p>
              <p className="text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
                {localizePortfolioText(project.solution || project.overview, language)}
              </p>
            </div>
            {project.proof && (
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                {project.proof.map((item) => (
                  <div key={item.label}>
                    <p className="font-mono text-xl font-semibold text-neon">{localizePortfolioText(item.value, language)}</p>
                    <p className="mt-1 text-[11.5px] text-[var(--text-muted)]">{localizePortfolioText(item.label, language)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : hasMediaSlot ? (
        <div className={isSpotlight ? "flex h-full flex-col" : isWide ? "grid h-full lg:grid-cols-[0.95fr_1.05fr]" : "flex h-full flex-col"}>
          <div className={isWide ? "min-h-0" : undefined}>
            {hasMedia && project.imageUrl ? (
              <ProjectMedia
                src={project.imageUrl}
                alt={project.imageAlt || `${project.title} screenshot`}
                aspectClassName={isSpotlight ? "aspect-[2/1]" : isWide ? "aspect-[16/10] h-full min-h-[300px] lg:aspect-auto" : "aspect-[16/10]"}
                objectPosition={isWide ? "object-right" : "object-top"}
                objectFit={project.imageFit}
                onError={() => setMediaFailed(true)}
              />
            ) : (
              <ProjectMediaPlaceholder
                title={project.title}
                subtitle={localizePortfolioText(project.subtitle || project.label, language) || project.label}
                alt={project.imageAlt || `${project.title} project media placeholder`}
                aspectClassName={isWide ? "aspect-[16/10] h-full min-h-[300px] lg:aspect-auto" : "aspect-[16/10]"}
              />
            )}
          </div>
          <div className={isSpotlight ? "flex flex-1 border-t border-white/[0.08]" : isWide ? "border-white/[0.08] lg:border-l" : "flex flex-1"}>
            {renderBody()}
          </div>
        </div>
      ) : (
        renderBody()
      )}
    </motion.article>
  );
};

export default FeaturedProjectCard;
