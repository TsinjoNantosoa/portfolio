import React, { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FeaturedProjectCard from "../project/FeaturedProjectCard";
import SecondaryProjectCard from "../project/SecondaryProjectCard";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { featuredProjects, secondaryProjects } from "@/data/projects";
import { useI18n } from "@/i18n/I18nProvider";
import type { TranslationKey } from "@/i18n/I18nProvider";
import type { ProjectCategory } from "@/types/portfolio";

type ProjectFilter = "All Projects" | ProjectCategory;

const projectFilters: Array<{ value: ProjectFilter; labelKey: TranslationKey }> = [
  { value: "All Projects", labelKey: "work.filterAll" },
  { value: "RAG & GenAI", labelKey: "work.filterRag" },
  { value: "AI Agents", labelKey: "work.filterAgents" },
  { value: "Automation / n8n", labelKey: "work.filterAutomation" },
  { value: "Full-Stack", labelKey: "work.filterFullStack" },
  { value: "Data Engineering", labelKey: "work.filterData" },
];

const Projects: React.FC = () => {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All Projects");

  const visibleFeaturedProjects = useMemo(
    () =>
      featuredProjects.filter(
        (project) => activeFilter === "All Projects" || project.categories.includes(activeFilter),
      ),
    [activeFilter],
  );

  const visibleSecondaryProjects = useMemo(
    () =>
      secondaryProjects.filter(
        (project) => activeFilter === "All Projects" || project.categories.includes(activeFilter),
      ),
    [activeFilter],
  );

  const visibleCount = visibleFeaturedProjects.length + visibleSecondaryProjects.length;

  return (
    <section id="projects" className="section-block scroll-mt-24 bg-[var(--bg-secondary)]/40">
      <div className="site-container">
        <SectionHeader
          eyebrow={t("work.eyebrow")}
          title={t("work.title")}
          description={t("work.description")}
          className="mb-8 md:mb-10"
        />

        <div className="mb-8 border-y border-white/10 py-4 md:mb-10">
          <div className="flex items-start gap-3">
            <SlidersHorizontal className="mt-2.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2" role="group" aria-label={t("work.filterLabel")}>
                {projectFilters.map((filter) => {
                  const isActive = activeFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`min-h-10 rounded-full border px-3.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 ${
                        isActive
                          ? "border-neon bg-neon text-black"
                          : "border-white/15 text-[var(--text-secondary)] hover:border-neon/60 hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {t(filter.labelKey)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-xs text-[var(--text-muted)]" aria-live="polite">
                {visibleCount} {visibleCount === 1 ? t("work.result") : t("work.results")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {visibleFeaturedProjects.map((project, index) => {
            const isWide = project.id === "multi-tenant-rag" || project.id === "offshore-fares";
            const density =
              project.id === "multi-tenant-rag"
                ? "flagship"
                : project.id === "offshore-fares"
                  ? "spotlight"
                  : project.imageUrl
                    ? "media"
                    : "editorial";

            return (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                index={index}
                density={density}
                className={isWide ? "lg:col-span-2" : ""}
              />
            );
          })}
        </div>

        {visibleSecondaryProjects.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-9 md:mt-12 md:pt-10">
            <div className="mb-6 max-w-xl">
              <h3 className="text-[clamp(1.35rem,2vw,1.75rem)] font-semibold tracking-tight text-[var(--text-primary)]">
                {t("work.other")}
              </h3>
              <p className="mt-1.5 text-[15px] text-[var(--text-muted)]">
                {t("work.otherDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleSecondaryProjects.map((project) => (
                <SecondaryProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
