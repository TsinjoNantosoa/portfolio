import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { FeaturedProject } from "@/types/portfolio";
import ProjectMedia from "@/components/ui-kit/ProjectMedia";

interface FeaturedProjectCardProps {
  project: FeaturedProject;
  index?: number;
  className?: string;
  density?: "flagship" | "media" | "editorial";
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  index = 0,
  className = "",
  density = "media",
}) => {
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;
  const isFlagship = density === "flagship";
  const highlightLimit = isFlagship ? 4 : 3;
  const splitFlagship = isFlagship && !hasMedia;

  const renderBody = (options?: { hideProof?: boolean }) => (
    <div className={`flex flex-col ${isFlagship ? "p-6 sm:p-7" : "p-5 sm:p-6"}`}>
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <span
          className={`font-mono font-semibold leading-none text-white/12 ${
            hasMedia || splitFlagship ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {project.number}
        </span>
        <span className="pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-neon/90">
          / {project.label}
        </span>
      </div>

      {isFlagship && (
        <span className="mb-3 inline-flex w-fit rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 font-mono text-[11px] text-neon">
          Professional Project
        </span>
      )}

      <h3
        className={`mb-3 font-semibold tracking-tight text-[var(--text-primary)] ${
          isFlagship
            ? "text-[clamp(1.55rem,2vw,2rem)]"
            : "text-[clamp(1.35rem,1.7vw,1.75rem)]"
        }`}
      >
        {project.title}
      </h3>

      <p className="mb-2 text-[15px] leading-[1.55] text-[var(--text-secondary)]">
        {project.plainSummary}
      </p>
      <p className="mb-4 font-mono text-[12.5px] leading-relaxed text-[var(--text-muted)]">
        {project.technicalSummary}
      </p>

      <ul className="mb-4 space-y-2">
        {project.highlights.slice(0, highlightLimit).map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[13.5px] leading-snug text-[var(--text-secondary)]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {!options?.hideProof && project.proof && project.proof.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3.5">
          {project.proof.map((item) => (
            <div key={item.label}>
              <p className="font-mono text-lg font-semibold text-neon">{item.value}</p>
              <p className="mt-0.5 text-[11.5px] text-[var(--text-muted)]">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 7).map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-white/65"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4">
        <Link
          to={project.caseStudyLink}
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-neon transition group-hover:gap-2"
        >
          View Case Study
          <ArrowUpRight size={15} />
        </Link>
        {project.demoLink && (
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-white"
          >
            <ExternalLink size={14} />
            Live Demo
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
            View Code
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
      className={`group self-start overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] transition duration-300 hover:border-neon/25 ${className}`}
    >
      {splitFlagship ? (
        <div className="layout-grid !gap-0">
          <div className="col-span-12 border-b border-white/10 lg:col-span-7 lg:border-b-0 lg:border-r">
            {renderBody({ hideProof: true })}
          </div>
          <div className="col-span-12 flex flex-col justify-center gap-5 p-6 sm:p-7 lg:col-span-5">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neon">
                Business value
              </p>
              <p className="text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
                {project.solution || project.overview}
              </p>
            </div>
            {project.proof && (
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                {project.proof.map((item) => (
                  <div key={item.label}>
                    <p className="font-mono text-xl font-semibold text-neon">{item.value}</p>
                    <p className="mt-1 text-[11.5px] text-[var(--text-muted)]">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : hasMedia && project.imageUrl ? (
        <div className={isFlagship ? "layout-grid !gap-0" : "flex flex-col"}>
          <div className={isFlagship ? "col-span-12 lg:col-span-7" : undefined}>
            <ProjectMedia
              src={project.imageUrl}
              alt={
                project.imageAlt ||
                `${project.title} screenshot`
              }
              aspectClassName="aspect-[16/10]"
              onError={() => setMediaFailed(true)}
            />
          </div>
          <div className={isFlagship ? "col-span-12 lg:col-span-5" : undefined}>
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
