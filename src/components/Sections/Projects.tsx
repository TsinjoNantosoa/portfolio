import React, { useState } from "react";
import { motion } from "framer-motion";
import FeaturedProjectCard from "../project/FeaturedProjectCard";
import SecondaryProjectCard from "../project/SecondaryProjectCard";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { featuredProjects, secondaryProjects } from "@/data/projects";

const Projects: React.FC = () => {
  const [showAllSecondary, setShowAllSecondary] = useState(false);
  const visibleSecondary = showAllSecondary
    ? secondaryProjects
    : secondaryProjects.slice(0, 4);

  return (
    <section id="work" className="section-block scroll-mt-24">
      <div className="site-container">
        <SectionHeader
          eyebrow="Selected Work"
          title="Selected AI Engineering Work"
          description="From customer-facing assistants to governed business agents, these projects show how I turn AI prototypes into complete systems."
        />
        <p className="-mt-4 mb-10 max-w-[720px] text-[15px] text-[var(--text-muted)]">
          Production RAG, governed AI agents, and business automation built as end-to-end systems.
        </p>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-20 border-t border-white/10 pt-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] font-semibold tracking-tight text-[var(--text-primary)]">
                Other Engineering Work
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Supporting projects across RAG, automation, and data/backend systems.
              </p>
            </div>
            {secondaryProjects.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSecondary((v) => !v)}
                className="min-h-11 text-sm text-neon hover:underline"
              >
                {showAllSecondary
                  ? "Show fewer projects"
                  : "View all engineering projects →"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleSecondary.map((project) => (
              <SecondaryProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
