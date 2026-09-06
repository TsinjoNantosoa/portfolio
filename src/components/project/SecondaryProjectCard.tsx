import React, { useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import type { SecondaryProject } from "@/types/portfolio";
import ProjectMedia from "@/components/ui-kit/ProjectMedia";

interface SecondaryProjectCardProps {
  project: SecondaryProject;
}

const SecondaryProjectCard: React.FC<SecondaryProjectCardProps> = ({ project }) => {
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
        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-neon/80">
          {project.category}
        </p>
        <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--text-primary)]">
          {project.title}
        </h3>
        <p className="mb-3 line-clamp-3 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
          {project.description}
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
              Code
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
              Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default SecondaryProjectCard;
