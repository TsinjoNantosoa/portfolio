import React, { useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import type { SecondaryProject } from "@/types/portfolio";
import ProjectMedia from "@/components/ui-kit/ProjectMedia";
import { useI18n } from "@/i18n/I18nProvider";
import { localizePortfolioText } from "@/i18n/portfolioContent";

const maturityKey = {
  Production: "maturity.production",
  "Deployed Demo": "maturity.deployedDemo",
  Prototype: "maturity.prototype",
  Research: "maturity.research",
} as const;

interface SecondaryProjectCardProps {
  project: SecondaryProject;
}

const SecondaryProjectCard: React.FC<SecondaryProjectCardProps> = ({ project }) => {
  const { language, t } = useI18n();
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;

  return (
    <article className="surface-card surface-card-hover group flex h-full flex-col !rounded-xl">
      {hasMedia && project.imageUrl && (
        <ProjectMedia
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          aspectClassName="aspect-[16/9]"
          onError={() => setMediaFailed(true)}
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neon/80">
            {localizePortfolioText(project.category, language)}
          </p>
          <span className="inline-flex min-h-6 items-center rounded-full border border-white/15 px-2 font-mono text-[9px] uppercase text-[var(--text-muted)]">
            {t(maturityKey[project.maturity])}
          </span>
        </div>
        <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--text-primary)]">
          {project.title}
        </h3>
        <p className="mb-3 line-clamp-3 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
          {localizePortfolioText(project.description, language)}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="tech-tag !min-h-6 !px-2 !text-[11px]"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-3 border-t border-white/[0.08] pt-2">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 text-[13px] text-white/70 hover:text-white"
            >
              <Github size={12} />
              {t("work.code")}
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1 text-xs text-white/60 hover:text-white"
            >
              <ExternalLink size={12} />
              {t("work.demo")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default SecondaryProjectCard;
