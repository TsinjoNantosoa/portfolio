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
<<<<<<< HEAD
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
=======
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-xl text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            FEATURED AI ENGINEERING PROJECTS
          </h2>
          <p className="text-white/70">
            Agentic AI systems, production RAG platforms, and n8n-powered automation—built as
            real end-to-end products.
          </p>
        </motion.div>
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

<<<<<<< HEAD
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
=======
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 mt-12 max-w-xl text-center sm:mb-12 sm:mt-16"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">MORE PROJECTS</h2>
          <p className="text-white/70">
            Additional engineering work across RAG, automation, backend systems, and analytics.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`min-h-11 max-w-full break-words rounded-full border px-4 py-2 text-sm transition-all ${
                activeCategory === category
                  ? "border-neon bg-neon/10 text-neon"
                  : "border-white/20 text-white/70 hover:border-neon/60 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Carousel (secondary projects) */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const start = slideIndex * projectsPerSlide;
              const end = start + projectsPerSlide;
              const slideProjects = filteredProjects.slice(start, end);

              return (
                <div
                  key={slideIndex}
                  className="grid w-full min-w-0 flex-shrink-0 grid-cols-1 gap-6 px-0 sm:grid-cols-2 sm:px-4"
                >
                  {slideProjects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      number={(start + index + 1).toString().padStart(2, "0")}
                      title={project.title}
                      subtitle={project.subtitle}
                      description={project.description}
                      technologies={project.technologies}
                      imageUrl={project.imageUrl}
                      demoLink={project.demoLink}
                      githubLink={project.githubLink}
                      caseStudyLink={project.caseStudyLink}
                      highlights={project.highlights}
                      isHighlighted={project.isHighlighted}
                      index={index}
                      category={project.category}
                      repository={project.repository}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          {filteredProjects.length > projectsPerSlide && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={prevSlide}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-neon transition-all hover:bg-neon/80"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5 text-black" />
              </button>
              <button
                onClick={nextSlide}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-neon transition-all hover:bg-neon/80"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5 text-black" />
              </button>
            </div>
          )}
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
        </div>
      </div>
    </section>
  );
};

export default Projects;
