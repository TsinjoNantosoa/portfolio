import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Info, Play, Workflow } from "lucide-react";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import AutomationDemo from "@/features/automation/components/AutomationDemo";
import EngineeringInsights, { OFFSHORE_REPO_URL } from "@/features/automation/components/EngineeringInsights";
import { automationCopy } from "@/features/automation/copy";
import { useI18n } from "@/i18n/I18nProvider";

const PAGE_URL = "https://tsinjona.netlify.app/lab/automation";

const AutomationPage = () => {
  const { language } = useI18n();
  const copy = automationCopy[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const title = `${copy.title} — Tsinjo`;
    const description =
      language === "fr"
        ? "Démonstration interactive et simulée d’un workflow d’automatisation métier avec validation humaine, inspirée du projet Offshore Fares (n8n, PostgreSQL, IA contrôlée)."
        : "Interactive, simulated walk-through of a business automation workflow with human approval, based on the Offshore Fares project (n8n, PostgreSQL, controlled AI).";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", PAGE_URL);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", PAGE_URL);
  }, [copy.title, language]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <main className="pb-6 pt-24 sm:pt-28">
        <section className="site-container pb-10 sm:pb-12">
          <Link
            to="/lab"
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-neon"
          >
            <ArrowLeft size={16} aria-hidden />
            {copy.back}
          </Link>
          <p className="eyebrow mb-3">{copy.eyebrow}</p>
          <h1 className="max-w-4xl text-[clamp(2.2rem,5.5vw,4.8rem)] font-semibold leading-[0.98] tracking-normal">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-3xl text-xl text-neon sm:text-2xl">{copy.subtitle}</p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {copy.description}
          </p>

          <div className="mt-6 flex max-w-3xl items-start gap-3 rounded-md border border-amber-400/40 bg-amber-400/[0.06] p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-[var(--warn)]" aria-hidden />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-[var(--warn)]">{copy.demoOnly}</p>
              <p className="mt-1 text-[var(--text-secondary)]">{copy.simulatedNotice}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#demo"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-neon px-5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              <Play size={16} aria-hidden />
              {copy.ctaTry}
            </a>
            <a
              href="#engineering-insights"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 px-5 text-sm font-semibold transition hover:border-neon/60 hover:text-neon"
            >
              <Workflow size={16} aria-hidden />
              {copy.ctaArchitecture}
            </a>
            <a
              href={OFFSHORE_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 px-5 text-sm font-semibold transition hover:border-neon/60 hover:text-neon"
            >
              <Github size={16} aria-hidden />
              {copy.ctaGithub}
            </a>
          </div>
        </section>

        <div className="site-container pb-12 sm:pb-16">
          <AutomationDemo language={language} />
        </div>

        <EngineeringInsights copy={copy} />
      </main>
      <Footer />
    </div>
  );
};

export default AutomationPage;
