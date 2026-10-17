import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bot,
  CircleGauge,
  Clock3,
  Database,
  FlaskConical,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { getOperationsSummary } from "@/features/operations/api";
import type { OperationsMetrics, OperationsSummary } from "@/features/operations/types";
import { useI18n } from "@/i18n/I18nProvider";
import { getStaticSeo } from "@/seo/routes";
import { useSeo } from "@/seo/useSeo";

const sourceIcons = { assistant: Bot, playground: FlaskConical, test: ShieldCheck, demo: Workflow };

const pageCopy = {
  en: {
    back: "Back to AI Engineering Lab",
    eyebrow: "LIVE AI OPERATIONS",
    title: "AI Operations Monitor",
    description: "Privacy-preserving operational signals for the portfolio assistant and public RAG Playground.",
    refresh: "Refresh metrics",
    period: "Measurement window",
    overview: "Overview",
    rag: "RAG performance",
    service: "Service status",
    insights: "Technical insights",
    requests: "AI requests",
    success: "Processing success",
    latency: "P95 total latency",
    errors: "Error rate",
    retrieval: "P95 retrieval",
    generation: "P95 generation",
    p50: "P50 total latency",
    refusals: "Controlled refusals",
    distribution: "Accepted request distribution",
    errorDistribution: "Error categories",
    updated: "Metrics refreshed",
    event: "Latest recorded operation",
    availability: "Known monitor state",
    available: "Recent operational data available",
    no_data: "No operation has been recorded in this process window",
    disabled: "Public operations monitoring is disabled by configuration. No events are collected.",
    stale: "The latest operation is older than the freshness threshold",
    loading: "Loading operational metrics…",
    error: "Operational metrics are temporarily unavailable.",
    retry: "Try again",
    unknown: "Not measured",
    noUptime: "This is not an uptime measurement. External synthetic monitoring is not configured.",
    architecture: "Collection architecture",
    architectureText: "Assistant / Playground → bounded technical event → in-process aggregation → rate-limited public summary.",
    privacy: "Privacy boundary",
    privacyText: "No questions, answers, IP addresses, sessions, JWTs, prompts, or exception traces are retained.",
    reliability: "Reliability boundary",
    reliabilityText: "Metric writes are best-effort and cannot block an AI response. The bounded buffer is cleared on restart.",
    cost: "Cost interpretation",
    costText: "Token totals appear only when provider usage is available. They are not presented as billed cost.",
    processingNote: "Success means the accepted operation reached a controlled terminal response; it is not service availability.",
    assistant: "Assistant",
    playground: "RAG Playground",
    test: "Automated tests",
    demo: "Demonstrations",
  },
  fr: {
    back: "Retour à l’AI Engineering Lab",
    eyebrow: "OPÉRATIONS IA EN DIRECT",
    title: "Moniteur d’opérations IA",
    description: "Signaux opérationnels agrégés et respectueux de la confidentialité pour l’assistant et le Playground RAG.",
    refresh: "Actualiser les métriques",
    period: "Fenêtre de mesure",
    overview: "Vue d’ensemble",
    rag: "Performance RAG",
    service: "État du service",
    insights: "Informations techniques",
    requests: "Requêtes IA",
    success: "Succès de traitement",
    latency: "Latence totale P95",
    errors: "Taux d’erreur",
    retrieval: "Retrieval P95",
    generation: "Génération P95",
    p50: "Latence totale P50",
    refusals: "Refus contrôlés",
    distribution: "Répartition des requêtes acceptées",
    errorDistribution: "Catégories d’erreur",
    updated: "Métriques actualisées",
    event: "Dernière opération enregistrée",
    availability: "État connu du moniteur",
    available: "Des données opérationnelles récentes sont disponibles",
    no_data: "Aucune opération enregistrée dans la fenêtre de ce processus",
    disabled: "Le monitoring public des opérations est désactivé par configuration. Aucun événement n’est collecté.",
    stale: "La dernière opération dépasse le seuil de fraîcheur",
    loading: "Chargement des métriques opérationnelles…",
    error: "Les métriques opérationnelles sont temporairement indisponibles.",
    retry: "Réessayer",
    unknown: "Non mesuré",
    noUptime: "Il ne s’agit pas d’une mesure d’uptime. Aucun monitoring synthétique externe n’est configuré.",
    architecture: "Architecture de collecte",
    architectureText: "Assistant / Playground → événement technique borné → agrégation en mémoire → résumé public limité.",
    privacy: "Frontière de confidentialité",
    privacyText: "Aucune question, réponse, adresse IP, session, JWT, prompt ou trace d’exception n’est conservé.",
    reliability: "Frontière de fiabilité",
    reliabilityText: "L’écriture des métriques est best-effort et ne bloque jamais une réponse IA. Le tampon est vidé au redémarrage.",
    cost: "Interprétation des coûts",
    costText: "Les tokens apparaissent uniquement si l’usage fournisseur est disponible. Ils ne représentent pas une facture.",
    processingNote: "Le succès indique qu’une opération acceptée a atteint une réponse terminale contrôlée, pas la disponibilité du service.",
    assistant: "Assistant",
    playground: "Playground RAG",
    test: "Tests automatisés",
    demo: "Démonstrations",
  },
} as const;

function metricValue(value: number | null, suffix = "") {
  if (value === null) return "—";
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}

function formatDate(value: string | null, language: "en" | "fr") {
  if (!value) return "—";
  return new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

const OperationsPage = () => {
  const { language } = useI18n();
  const copy = pageCopy[language];
  const [summary, setSummary] = useState<OperationsSummary | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const load = useCallback(async () => {
    setState("loading");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      setSummary(await getOperationsSummary(controller.signal));
      setState("ready");
    } catch {
      setState("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    void load();
  }, [load]);

  useSeo(getStaticSeo("/lab/operations", language));

  const metrics: Array<{ key: keyof OperationsMetrics; label: string; icon: typeof Activity; suffix?: string }> = useMemo(() => [
    { key: "requests", label: copy.requests, icon: Activity },
    { key: "success_rate", label: copy.success, icon: CircleGauge, suffix: "%" },
    { key: "p95_latency_ms", label: copy.latency, icon: Clock3, suffix: " ms" },
    { key: "error_rate", label: copy.errors, icon: TriangleAlert, suffix: "%" },
  ], [copy]);

  const status = summary?.status;
  const statusText = status ? copy[status] : copy.error;
  const statusTone = state === "error" ? "error" : status ?? "no_data";
  const statusToneStyles = {
    available: "border-neon bg-neon/[0.06] text-[var(--text-primary)]",
    no_data: "border-sky-400 bg-sky-400/[0.06] text-[var(--text-primary)]",
    stale: "border-amber-400 bg-amber-400/[0.07] text-[var(--text-primary)]",
    disabled: "border-white/25 bg-white/[0.035] text-[var(--text-secondary)]",
    error: "border-red-400 bg-red-500/[0.07] text-[var(--text-primary)]",
  }[statusTone];
  const hasData = summary && (summary.status === "available" || summary.status === "stale");
  const maxSource = hasData ? Math.max(1, ...Object.values(summary.request_distribution)) : 1;
  const insights: Array<{ title: string; text: string; Icon: LucideIcon }> = [
    { title: copy.architecture, text: copy.architectureText, Icon: Database },
    { title: copy.privacy, text: copy.privacyText, Icon: ShieldCheck },
    { title: copy.reliability, text: copy.reliabilityText, Icon: Activity },
    { title: copy.cost, text: copy.costText, Icon: CircleGauge },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <main className="pb-16 pt-24 sm:pb-20 sm:pt-28">
        <section className="operations-container border-b border-white/10 pb-9">
          <Link to="/lab" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-neon">
            <ArrowLeft size={16} aria-hidden /> {copy.back}
          </Link>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow mb-3">{copy.eyebrow}</p>
              <h1 className="text-[clamp(2.35rem,6vw,5rem)] font-semibold leading-[0.96] tracking-normal">{copy.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">{copy.description}</p>
            </div>
            <button type="button" onClick={() => void load()} disabled={state === "loading"} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold transition hover:border-neon/60 hover:text-neon disabled:opacity-50">
              <RefreshCw size={16} className={state === "loading" ? "animate-spin" : ""} aria-hidden /> {copy.refresh}
            </button>
          </div>
        </section>

        <section className="operations-container py-8" aria-live="polite">
          <div role="status" className={`flex min-h-16 items-start gap-3 border-l-2 px-4 py-3 sm:items-center ${statusToneStyles}`}>
            {state === "loading" ? <RefreshCw className="animate-spin" size={19} aria-hidden /> : state === "error" ? <TriangleAlert size={19} aria-hidden /> : <Activity size={19} aria-hidden />}
            <div>
              <p className="text-sm font-semibold leading-relaxed">{state === "loading" ? copy.loading : state === "error" ? copy.error : statusText}</p>
              {summary ? <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">{copy.period}: {summary.period}</p> : null}
            </div>
            {state === "error" ? <button type="button" onClick={() => void load()} className="ml-auto text-sm text-neon underline underline-offset-4">{copy.retry}</button> : null}
          </div>
        </section>

        <section className="operations-container pb-12" aria-labelledby="operations-overview">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
            <h2 id="operations-overview" className="text-xl font-semibold tracking-normal sm:text-2xl">{copy.overview}</h2>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">{summary?.period ?? "24h"}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ key, label, icon: Icon, suffix }) => (
              <article key={key} className="rounded-md border border-white/15 bg-[var(--surface-1)] p-5 shadow-[0_10px_24px_rgba(0,0,0,.16)]">
                <div className="flex items-center justify-between gap-3 text-[var(--text-muted)]"><span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em]">{label}</span><Icon size={18} aria-hidden /></div>
                <p className="mt-5 text-4xl font-semibold leading-none tracking-tight tabular-nums">{metricValue(summary?.metrics[key] ?? null, suffix)}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">{copy.processingNote}</p>
        </section>

        <section className="border-y border-white/10 bg-[var(--bg-secondary)]/45 py-10 sm:py-12" aria-labelledby="rag-performance">
          <div className="operations-container">
            <h2 id="rag-performance" className="text-xl font-semibold tracking-normal sm:text-2xl">{copy.rag}</h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-5">
                {[
                  [copy.retrieval, summary?.metrics.retrieval_p95_ms, " ms"],
                  [copy.generation, summary?.metrics.generation_p95_ms, " ms"],
                  [copy.p50, summary?.metrics.p50_latency_ms, " ms"],
                  [copy.refusals, summary?.metrics.refusals, ""],
                ].map(([label, value, suffix]) => <div key={String(label)}><dt className="text-xs text-[var(--text-muted)]">{label}</dt><dd className="mt-2 text-xl font-semibold tabular-nums">{metricValue(value as number | null | undefined ?? null, String(suffix))}</dd></div>)}
              </dl>
              <div>
                <h3 className="font-mono text-xs uppercase text-neon">{copy.distribution}</h3>
                <div className="mt-4 space-y-4">
                  {(Object.keys(sourceIcons) as Array<keyof typeof sourceIcons>).map((source) => {
                    const Icon = sourceIcons[source];
                    const value = summary?.request_distribution[source] ?? 0;
                    return <div key={source}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Icon size={15} aria-hidden />{copy[source]}</span><span className="font-mono tabular-nums">{hasData ? value : "—"}</span></div><div className="h-1.5 overflow-hidden bg-white/10"><div className="h-full bg-neon transition-[width]" style={{ width: hasData ? `${Math.max(value ? 4 : 0, value / maxSource * 100)}%` : "0%" }} /></div></div>;
                  })}
                </div>
              </div>
            </div>
            {summary && Object.keys(summary.error_distribution).length > 0 ? <div className="mt-8 border-t border-white/10 pt-5"><h3 className="font-mono text-xs uppercase text-[var(--text-muted)]">{copy.errorDistribution}</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(summary.error_distribution).map(([name, count]) => <span key={name} className="rounded-full border border-white/15 px-3 py-1 text-xs">{name}: {count}</span>)}</div></div> : null}
          </div>
        </section>

        <section className="operations-container grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <p className="eyebrow mb-2">{copy.service}</p>
            <h2 className="text-2xl font-semibold tracking-normal">{copy.availability}</h2>
            <dl className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
              <div><dt className="text-[var(--text-muted)]">{copy.updated}</dt><dd className="mt-1 font-medium">{formatDate(summary?.last_updated ?? null, language)}</dd></div>
              <div><dt className="text-[var(--text-muted)]">{copy.event}</dt><dd className="mt-1 font-medium">{formatDate(summary?.last_event_at ?? null, language)}</dd></div>
            </dl>
            <p className="mt-6 border-l border-amber-400 pl-4 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.noUptime}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">{copy.insights}</p>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {insights.map(({ title, text, Icon }) => <article key={title} className="grid gap-3 py-5 sm:grid-cols-[40px_1fr]"><div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-neon"><Icon size={18} aria-hidden /></div><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{text}</p></div></article>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OperationsPage;
