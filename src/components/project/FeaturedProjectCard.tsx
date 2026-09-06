import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import type { FeaturedProject } from "@/types/portfolio";
import ProjectMedia from "@/components/ui-kit/ProjectMedia";

interface FeaturedProjectCardProps {
  project: FeaturedProject;
  index?: number;
}

const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  index = 0,
}) => {
  const [mediaFailed, setMediaFailed] = useState(false);
  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;
  const isFlagship = project.featuredLayout === "flagship" && hasMedia;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={`group overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] transition duration-300 hover:-translate-y-[3px] hover:border-neon/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)] ${
        isFlagship ? "lg:col-span-2" : ""
      }`}
    >
      <div className={isFlagship ? "grid lg:grid-cols-[1.12fr_0.88fr]" : "flex flex-col"}>
        {hasMedia && project.imageUrl && (
          <ProjectMedia
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            aspectClassName={
              isFlagship ? "min-h-[280px] lg:min-h-full lg:aspect-auto" : "aspect-[16/10]"
            }
            onError={() => setMediaFailed(true)}
          />
        )}

        <div className="flex flex-col p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-3xl font-semibold leading-none text-white/12 sm:text-4xl">
              {project.number}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-neon/90">
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
                ? "text-[clamp(1.5rem,2vw,2.1rem)]"
                : "text-[clamp(1.25rem,1.8vw,1.6rem)]"
            }`}
          >
            {project.title}
          </h3>

          <p className="mb-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {project.plainSummary}
          </p>
          <p className="mb-5 font-mono text-[12.5px] leading-relaxed text-[var(--text-muted)]">
            {project.technicalSummary}
          </p>

          <ul className="mb-5 space-y-2">
            {project.highlights.slice(0, 4).map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-sm leading-snug text-[var(--text-secondary)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {project.proof && project.proof.length > 0 && (
            <div className="mb-5 grid grid-cols-3 gap-2 border-y border-white/10 py-4">
              {project.proof.map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-lg font-semibold text-neon sm:text-xl">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mb-5 flex flex-wrap gap-2">
            {project.stack.slice(0, 7).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11.5px] text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-4">
            <Link
              to={project.caseStudyLink}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-neon transition group-hover:gap-2"
            >
              View Case Study
              <ArrowUpRight size={16} />
            </Link>
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-white"
              >
                <ExternalLink size={15} />
                Live Demo
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-white"
              >
                <Github size={15} />
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedProjectCard;
