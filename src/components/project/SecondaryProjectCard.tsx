import React, { useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import type { SecondaryProject } from "@/types/portfolio";

interface SecondaryProjectCardProps {
  project: SecondaryProject;
}

const SecondaryProjectCard: React.FC<SecondaryProjectCardProps> = ({ project }) => {
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] transition hover:border-[var(--border-medium)]">
      {hasMedia && (
        <div className="aspect-[16/9] overflow-hidden bg-[var(--surface-2)]">
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            loading="lazy"
            width={640}
            height={360}
            onError={() => setMediaFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        </div>
      )}
      <div className="p-4">
        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-neon/80">
          {project.category}
        </p>
        <h3 className="mb-1.5 text-[15px] font-semibold text-[var(--text-primary)]">
          {project.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
          {project.description}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10.5px] text-white/55"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1 text-xs text-white/60 hover:text-white"
            >
              <Github size={13} />
              Code
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1 text-xs text-white/60 hover:text-white"
            >
              <ExternalLink size={13} />
              Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default SecondaryProjectCard;
