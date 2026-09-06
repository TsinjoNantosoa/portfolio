import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ProjectMedia from "@/components/ui-kit/ProjectMedia";
import { getFeaturedProjectBySlug } from "@/data/projects";

const CaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getFeaturedProjectBySlug(slug) : undefined;
  const [mediaFailed, setMediaFailed] = useState(false);

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

  const hasMedia = Boolean(project.imageUrl) && !mediaFailed;
  const mediaAlt =
    project.imageAlt || `${project.title} product screenshot`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <Header />
      <main className="site-container pb-16 pt-28 sm:pb-20">
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
        <h1 className="mb-3 max-w-4xl font-sans text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.subtitle ? (
          <p className="mb-4 max-w-[720px] text-[16px] leading-relaxed text-[var(--text-secondary)]">
            {project.subtitle}
          </p>
        ) : (
          <p className="mb-4 max-w-[720px] text-lg leading-relaxed text-[var(--text-secondary)]">
            {project.plainSummary}
          </p>
        )}
        <p className="mb-8 max-w-[720px] font-mono text-sm text-[var(--text-muted)]">
          {project.technicalSummary}
        </p>

        {hasMedia && project.imageUrl && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-white/10">
            <ProjectMedia
              src={project.imageUrl}
              alt={mediaAlt}
              aspectClassName="aspect-[16/10]"
              onError={() => setMediaFailed(true)}
            />
          </div>
        )}

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
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {project.overview}
              </p>
            </section>
          )}
          {project.problem && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Business Problem</h2>
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {project.problem}
              </p>
            </section>
          )}
          {project.solution && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Solution</h2>
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {project.solution}
              </p>
            </section>
          )}
          {project.architecture && project.architecture.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">Architecture</h2>
              <ul className="space-y-2 text-[15px] text-[var(--text-secondary)]">
                {project.architecture.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {project.howItWorks && project.howItWorks.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {project.howItWorks.map((step, index) => (
                <li
                  key={step}
                  className="border-t border-white/10 pt-3 text-[14.5px] text-[var(--text-secondary)]"
                >
                  <span className="mb-1 block font-mono text-xs text-neon">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        )}

        {project.decisionHighlight && (
          <section className="mt-10 rounded-2xl border border-neon/25 bg-neon/[0.04] p-6 sm:p-7">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neon">
              Key Engineering Decision
            </p>
            <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
              {project.decisionHighlight.title}
            </h2>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {project.decisionHighlight.body}
            </p>
          </section>
        )}

        {project.decisions && project.decisions.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Key Engineering Decisions</h2>
            <ul className="space-y-2 text-[15px] text-[var(--text-secondary)]">
              {project.decisions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {project.scoring && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Lead Scoring</h2>
            <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {project.scoring.summary}
            </p>
            <div className="layout-grid">
              <div className="col-span-12 sm:col-span-6 lg:col-span-5">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  Factors
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.scoring.factors.map((factor) => (
                    <li
                      key={factor}
                      className="rounded-md border border-white/10 px-2.5 py-1 text-sm text-white/70"
                    >
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  Score range
                </p>
                <p className="font-mono text-lg text-[var(--text-primary)]">
                  {project.scoring.range}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  Classification
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.scoring.classes.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-neon/25 bg-neon/5 px-3 py-1 font-mono text-xs text-neon"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {project.automation && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Operational Automation</h2>
            <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {project.automation.summary}
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {project.automation.workflows.map((workflow) => (
                <li
                  key={workflow}
                  className="border-t border-white/10 pt-3 text-[14.5px] text-[var(--text-secondary)]"
                >
                  {workflow}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.hitl && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Human-in-the-Loop</h2>
            <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {project.hitl}
            </p>
          </section>
        )}

        {project.security && project.security.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">Reliability</h2>
            <ul className="space-y-2 text-[15px] text-[var(--text-secondary)]">
              {project.security.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {project.proof && project.proof.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">Results / Validation</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.proof.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4"
                >
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
