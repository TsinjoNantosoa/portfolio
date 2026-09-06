import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ProjectMedia from "@/components/ui-kit/ProjectMedia";
import { getFeaturedProjectBySlug } from "@/data/projects";

const CaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getFeaturedProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-white">
        <Header />
        <main className="site-container pb-20 pt-28">
          <h1 className="mb-4 text-3xl font-semibold">Case study not found</h1>
          <Link to="/#work" className="text-neon hover:underline">
            Back to work
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <Header />
      <main className="site-container pb-20 pt-28">
        <Link
          to="/#work"
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-white/60 hover:text-neon"
        >
          <ArrowLeft size={16} />
          Back to selected work
        </Link>

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-neon">
          {project.number} / {project.label}
        </p>
        <h1 className="mb-4 max-w-4xl font-sans text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mb-3 max-w-[720px] text-lg leading-relaxed text-[var(--text-secondary)]">
          {project.plainSummary}
        </p>
        <p className="mb-8 max-w-[720px] font-mono text-sm text-[var(--text-muted)]">
          {project.technicalSummary}
        </p>

        <div className="mb-10 overflow-hidden rounded-2xl border border-white/10">
          <ProjectMedia
            title={project.title}
            label={project.label}
            src={project.imageUrl}
            alt={`${project.title} visual`}
            usePlaceholder={project.usePlaceholder}
            placeholderKind={project.placeholderKind}
            placeholderSteps={project.placeholderSteps}
            aspectClassName="aspect-[16/9]"
          />
        </div>

        <div className="mb-10 flex flex-wrap gap-4">
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-black"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm"
            >
              <Github size={16} />
              View Code
            </a>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {project.overview && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Overview</h2>
              <p className="text-[var(--text-secondary)]">{project.overview}</p>
            </section>
          )}
          {project.problem && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Challenge</h2>
              <p className="text-[var(--text-secondary)]">{project.problem}</p>
            </section>
          )}
          {project.solution && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Solution</h2>
              <p className="text-[var(--text-secondary)]">{project.solution}</p>
            </section>
          )}
          {project.architecture && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Architecture</h2>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {project.architecture.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          )}
          {project.decisions && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Key Engineering Decisions</h2>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {project.decisions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          )}
          {project.security && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Security / Reliability</h2>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {project.security.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {project.proof && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">Results / Validation</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.proof.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4">
                  <p className="font-mono text-2xl font-semibold text-neon">{item.value}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 px-3 py-1.5 font-mono text-xs text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudyPage;
