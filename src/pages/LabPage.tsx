import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  Database,
  ExternalLink,
  FlaskConical,
  Activity,
  ServerCog,
  Workflow,
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { labCapabilities } from "@/data/lab";
import { useI18n } from "@/i18n/I18nProvider";
import type { ProjectMaturity } from "@/types/portfolio";

const capabilityIcons = {
  rag: Database,
  agentic: Bot,
  automation: Workflow,
  production: ServerCog,
  "assisted-development": Braces,
};

const maturityKeys: Record<ProjectMaturity, "maturity.production" | "maturity.deployedDemo" | "maturity.prototype" | "maturity.research"> = {
  Production: "maturity.production",
  "Deployed Demo": "maturity.deployedDemo",
  Prototype: "maturity.prototype",
  Research: "maturity.research",
};

const LabPage = () => {
  const { language, t } = useI18n();
  const copy = <T extends { en: string; fr: string }>(value: T) => value[language];
  const proofSteps = [
    t("lab.proof.problem"),
    t("lab.proof.architecture"),
    t("lab.proof.validation"),
    t("lab.proof.limits"),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const title = language === "fr" ? "AI Engineering Lab — Tsinjo" : "AI Engineering Lab — Tsinjo";
    const description =
      language === "fr"
        ? "Méthodes, architectures et preuves issues de projets réels en RAG, agents IA, automatisation et ingénierie de production."
        : "Methods, architectures, and evidence from real RAG, AI agent, automation, and production engineering projects.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://tsinjona.netlify.app/lab");
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://tsinjona.netlify.app/lab");
  }, [language]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <main className="pb-16 pt-24 sm:pb-20 sm:pt-28">
        <section className="site-container border-b border-white/10 pb-10 sm:pb-12">
          <Link
            to="/#projects"
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-neon"
          >
            <ArrowLeft size={16} aria-hidden />
            {t("lab.back")}
          </Link>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.65fr)] lg:items-end">
            <div>
              <p className="eyebrow mb-3">{t("lab.eyebrow")}</p>
              <h1 className="max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-normal">
                {t("lab.title")}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                {t("lab.description")}
              </p>
            </div>
            <div className="border-l border-neon/40 pl-5">
              <p className="font-mono text-xs uppercase text-neon">{t("lab.standard")}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {t("lab.standardDescription")}
              </p>
              <Link
                to="/lab/playground"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-neon px-4 text-sm font-semibold text-black transition hover:brightness-110"
              >
                <FlaskConical size={16} aria-hidden />
                {language === "fr" ? "Tester le Playground RAG" : "Open the RAG Playground"}
              </Link>
              <Link
                to="/lab/operations"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-neon/60 hover:text-neon"
              >
                <Activity size={16} aria-hidden />
                {language === "fr" ? "Voir les opérations IA" : "View AI Operations"}
              </Link>
              <Link
                to="/lab/automation"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold text-[var(--text-primary)] transition hover:border-neon/60 hover:text-neon"
              >
                <Workflow size={16} aria-hidden />
                {language === "fr" ? "Tester le Business Automation Showcase" : "Try the Business Automation Showcase"}
              </Link>
            </div>
          </div>
        </section>

        <section className="site-container py-10 sm:py-14" aria-labelledby="lab-capabilities-title">
          <h2 id="lab-capabilities-title" className="sr-only">
            {t("lab.capabilities")}
          </h2>
          <div className="space-y-6">
            {labCapabilities.map((capability) => {
              const Icon = capabilityIcons[capability.id];
              return (
                <article
                  key={capability.id}
                  id={capability.id}
                  className="scroll-mt-24 overflow-hidden rounded-lg border border-white/10 bg-[var(--surface-1)]"
                >
                  <div className="grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                    <div className="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                      <div className="mb-6 flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-neon">{capability.number}</span>
                        <span className="rounded-full border border-neon/25 bg-neon/[0.06] px-2.5 py-1 font-mono text-[11px] text-neon">
                          {t(maturityKeys[capability.maturity])}
                        </span>
                      </div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-[var(--bg-primary)] text-neon">
                        <Icon size={20} aria-hidden />
                      </div>
                      <h2 className="text-2xl font-semibold tracking-normal">{copy(capability.title)}</h2>
                      <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                        {copy(capability.summary)}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {capability.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[var(--text-muted)]"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 sm:p-7">
                      <h3 className="font-mono text-xs uppercase text-neon">{t("lab.implemented")}</h3>
                      <ul className="mt-4 grid gap-3 md:grid-cols-3">
                        {capability.details.map((detail, index) => (
                          <li key={detail.en} className="border-t border-white/10 pt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                            <span className="mb-1 block font-mono text-[11px] text-neon/80">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {copy(detail)}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-7 border-y border-white/10 py-5">
                        <h3 className="mb-4 font-mono text-xs uppercase text-[var(--text-muted)]">
                          {t("lab.workflow")}
                        </h3>
                        <ol className="grid gap-2 sm:grid-cols-5">
                          {capability.workflow.map((step, index) => (
                            <li key={step.en} className="flex min-w-0 items-center gap-2 sm:block">
                              <span className="text-sm font-medium text-[var(--text-primary)]">{copy(step)}</span>
                              {index < capability.workflow.length - 1 ? (
                                <ArrowRight className="h-4 w-4 shrink-0 text-neon sm:mt-2" aria-hidden />
                              ) : null}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="mr-1 font-mono text-xs uppercase text-[var(--text-muted)]">
                          {t("lab.evidence")}
                        </span>
                        {capability.references.map((reference) => (
                          <Link
                            key={reference.slug}
                            to={`/work/${reference.slug}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs text-[var(--text-secondary)] transition hover:border-neon/60 hover:text-neon"
                          >
                            {reference.label}
                            <ExternalLink size={12} aria-hidden />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--bg-secondary)]/50 py-10 sm:py-12">
          <div className="site-container grid gap-6 md:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow mb-2">{t("lab.proofEyebrow")}</p>
              <h2 className="text-2xl font-semibold tracking-normal sm:text-3xl">{t("lab.proofTitle")}</h2>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {proofSteps.map((step, index) => (
                <li key={step} className="border-t border-white/10 pt-3">
                  <span className="font-mono text-xs text-neon">0{index + 1}</span>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LabPage;
