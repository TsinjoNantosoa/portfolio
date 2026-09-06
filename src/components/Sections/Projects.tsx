import React from "react";
import FeaturedProjectCard from "../project/FeaturedProjectCard";
import SecondaryProjectCard from "../project/SecondaryProjectCard";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { featuredProjects, secondaryProjects } from "@/data/projects";

const Projects: React.FC = () => {
  const [flagship, arcwell, aiBos, sihia, aiSales] = featuredProjects;

  return (
    <section id="work" className="section-block scroll-mt-24 bg-[var(--bg-secondary)]/40">
      <div className="site-container">
        <SectionHeader
          eyebrow="Selected Work"
          title="Selected AI Engineering Work"
          description="Production RAG, governed AI agents, and business automation built as end-to-end systems."
          className="mb-8 md:mb-10"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <FeaturedProjectCard
            project={flagship}
            index={0}
            density="flagship"
            className="lg:col-span-2"
          />
          <FeaturedProjectCard
            project={arcwell}
            index={1}
            density="editorial"
          />
          <FeaturedProjectCard
            project={aiBos}
            index={2}
            density="media"
          />
          <FeaturedProjectCard
            project={sihia}
            index={3}
            density="media"
          />
          <FeaturedProjectCard
            project={aiSales}
            index={4}
            density="media"
          />
        </div>

        <div className="mt-10 border-t border-white/10 pt-9 md:mt-12 md:pt-10">
          <div className="mb-6 max-w-xl">
            <h3 className="text-[clamp(1.35rem,2vw,1.75rem)] font-semibold tracking-tight text-[var(--text-primary)]">
              Other Engineering Work
            </h3>
            <p className="mt-1.5 text-[15px] text-[var(--text-muted)]">
              Supporting projects across RAG, automation, and data systems.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {secondaryProjects.map((project) => (
              <SecondaryProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
