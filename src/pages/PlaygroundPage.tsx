import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  LoaderCircle,
  ShieldCheck,
  Square,
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { AssistantApiError } from "@/components/assistant/assistant-api";
import { assistantConfig } from "@/components/assistant/assistant-config";
import type { SessionResponse } from "@/components/assistant/assistant-types";
import EngineeringInsights from "@/features/playground/EngineeringInsights";
import PipelineVisualizer from "@/features/playground/PipelineVisualizer";
import { createPublicSession, queryPlayground } from "@/features/playground/api";
import type {
  PlaygroundCorpus,
  PlaygroundHistoryItem,
} from "@/features/playground/types";
import { playgroundCorpora, playgroundQuestions } from "@/data/playground";
import { useI18n } from "@/i18n/I18nProvider";

const MAX_QUESTION_LENGTH = 400;

const ui = {
  en: {
    back: "Back to AI Engineering Lab",
    eyebrow: "Interactive RAG Engineering",
    title: "Public RAG Playground",
    description: "Inspect a real retrieval and grounded-generation request over a small, permissioned public corpus. Every displayed passage, score, duration, and pipeline state comes from the API response.",
    boundary: "Public demo boundary",
    boundaryText: "Read-only portfolio data. No client documents, external actions, private prompts, or visitor conversations are stored by this interface.",
    corpus: "1. Select a public corpus",
    examples: "2. Start with a verified question",
    question: "3. Ask the corpus",
    placeholder: "Ask a bounded question about the selected corpus…",
    run: "Run retrieval",
    stop: "Stop request",
    pending: "Retrieving evidence and generating a grounded answer…",
    answer: "Grounded answer",
    evidence: "Retrieved evidence",
    evidenceHint: "Scores are retrieval similarity values, not confidence estimates.",
    pipeline: "Execution trace",
    live: "Real execution",
    guarded: "Guarded response",
    noEvidence: "No supporting evidence",
    history: "Session history",
    historyHint: "Kept only in this page’s memory and cleared when it is reloaded.",
    empty: "Run a question to inspect the answer, evidence, and actual pipeline trace.",
    unavailable: "The Playground backend is unavailable or awaiting production approval. The portfolio and existing assistant remain usable.",
    rateLimited: "The public Playground limit has been reached. Please retry later.",
    genericError: "The request could not be completed safely. Your question remains available for retry.",
    chars: "characters",
    source: "Open public source",
    security: "Safety controls",
    securityItems: ["JWT session and origin allowlist", "Corpus permission filter", "Prompt-injection guard", "Server-side rate and token limits"],
  },
  fr: {
    back: "Retour à l’AI Engineering Lab",
    eyebrow: "Ingénierie RAG interactive",
    title: "Playground RAG public",
    description: "Inspectez une véritable requête de recherche et de génération fondée sur un corpus public restreint. Chaque passage, score, durée et état affiché provient de la réponse de l’API.",
    boundary: "Périmètre de la démonstration",
    boundaryText: "Données publiques du portfolio en lecture seule. Aucun document client, action externe, prompt privé ou historique visiteur n’est stocké par cette interface.",
    corpus: "1. Sélectionner un corpus public",
    examples: "2. Partir d’une question vérifiée",
    question: "3. Interroger le corpus",
    placeholder: "Posez une question bornée sur le corpus sélectionné…",
    run: "Lancer la recherche",
    stop: "Arrêter la requête",
    pending: "Recherche des preuves et génération d’une réponse fondée…",
    answer: "Réponse fondée",
    evidence: "Preuves retrouvées",
    evidenceHint: "Les scores mesurent la similarité de recherche, pas la confiance de la réponse.",
    pipeline: "Trace d’exécution",
    live: "Exécution réelle",
    guarded: "Réponse contrôlée",
    noEvidence: "Aucune preuve suffisante",
    history: "Historique de session",
    historyHint: "Conservé uniquement en mémoire sur cette page et effacé lors de son rechargement.",
    empty: "Lancez une question pour inspecter la réponse, les preuves et la trace réelle du pipeline.",
    unavailable: "Le backend du Playground est indisponible ou attend une validation de production. Le portfolio et l’assistant existant restent utilisables.",
    rateLimited: "La limite du Playground public est atteinte. Réessayez plus tard.",
    genericError: "La requête n’a pas pu être terminée en toute sécurité. Votre question reste disponible pour réessayer.",
    chars: "caractères",
    source: "Ouvrir la source publique",
    security: "Contrôles de sécurité",
    securityItems: ["Session JWT et origines autorisées", "Filtre de permission du corpus", "Protection contre l’injection de prompt", "Limites serveur de requêtes et de tokens"],
  },
} as const;

export default function PlaygroundPage() {
  const { language } = useI18n();
  const copy = ui[language];
  const [corpus, setCorpus] = useState<PlaygroundCorpus>("projects");
  const [question, setQuestion] = useState("");
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [history, setHistory] = useState<PlaygroundHistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const selected = history.find((item) => item.id === selectedId) || history.at(-1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const title = language === "fr" ? "Playground RAG public — Tsinjo" : "Public RAG Playground — Tsinjo";
    const description = language === "fr"
      ? "Démonstration RAG publique avec recherche observable, réponse fondée et citations vérifiables."
      : "Public RAG demonstration with observable retrieval, grounded answers, and verifiable citations.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://tsinjona.netlify.app/lab/playground");
    return () => abortRef.current?.abort();
  }, [language]);

  async function runQuestion(event?: FormEvent) {
    event?.preventDefault();
    const clean = question.trim().slice(0, MAX_QUESTION_LENGTH);
    if (!clean || loading || !assistantConfig.available) return;
    const id = `playground-${Date.now()}`;
    setHistory((current) => [...current.slice(-4), { id, question: clean, corpus }]);
    setSelectedId(id);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), assistantConfig.streamTimeoutMs);
    try {
      const activeSession = session || await createPublicSession(assistantConfig.apiBaseUrl, controller.signal);
      if (!session) setSession(activeSession);
      const response = await queryPlayground(
        assistantConfig.apiBaseUrl,
        activeSession,
        clean,
        corpus,
        controller.signal,
      );
      setHistory((current) => current.map((item) => item.id === id ? { ...item, response } : item));
    } catch (error) {
      const stopped = error instanceof DOMException && error.name === "AbortError";
      const message = stopped
        ? copy.genericError
        : error instanceof AssistantApiError && error.status === 429
          ? copy.rateLimited
          : error instanceof AssistantApiError && error.status === 503
            ? copy.unavailable
            : copy.genericError;
      setHistory((current) => current.map((item) => item.id === id ? { ...item, error: message } : item));
    } finally {
      window.clearTimeout(timer);
      abortRef.current = null;
      setLoading(false);
    }
  }

  const modeLabel = selected?.response?.execution_mode === "live"
    ? copy.live
    : selected?.response?.execution_mode === "guarded"
      ? copy.guarded
      : copy.noEvidence;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <main className="pb-16 pt-24 sm:pb-20 sm:pt-28">
        <section className="site-container border-b border-white/10 pb-10">
          <Link to="/lab" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-neon">
            <ArrowLeft size={16} aria-hidden /> {copy.back}
          </Link>
          <div className="grid gap-7 lg:grid-cols-[1.15fr_0.65fr] lg:items-end">
            <div>
              <p className="eyebrow mb-3">{copy.eyebrow}</p>
              <h1 className="max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-normal">{copy.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">{copy.description}</p>
            </div>
            <div className="border-l border-neon/40 pl-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-neon"><ShieldCheck size={15} aria-hidden /> {copy.boundary}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy.boundaryText}</p>
            </div>
          </div>
        </section>

        <section className="site-container py-10 sm:py-12">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
            <div className="space-y-8">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">{copy.corpus}</legend>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {playgroundCorpora.map((item) => (
                    <button key={item.id} type="button" onClick={() => setCorpus(item.id)} aria-pressed={corpus === item.id} className={`min-h-20 border p-4 text-left transition ${corpus === item.id ? "border-neon bg-neon/[0.06]" : "border-white/10 bg-[var(--surface-1)] hover:border-white/25"}`}>
                      <span className="block text-sm font-semibold">{item.label[language]}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-[var(--text-muted)]">{item.description[language]}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <h2 className="mb-3 text-sm font-semibold">{copy.examples}</h2>
                <div className="space-y-2">
                  {playgroundQuestions[corpus][language].map((example) => (
                    <button key={example} type="button" onClick={() => setQuestion(example)} className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-white/10 px-1 py-2 text-left text-sm text-[var(--text-secondary)] transition hover:border-neon/50 hover:text-[var(--text-primary)]">
                      <span>{example}</span><ArrowUp className="h-4 w-4 rotate-45 text-neon" aria-hidden />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={runQuestion}>
                <label htmlFor="playground-question" className="mb-3 block text-sm font-semibold">{copy.question}</label>
                <textarea id="playground-question" value={question} onChange={(event) => setQuestion(event.target.value.slice(0, MAX_QUESTION_LENGTH))} maxLength={MAX_QUESTION_LENGTH} rows={5} placeholder={copy.placeholder} className="w-full resize-none rounded-md border border-white/15 bg-[var(--surface-1)] p-4 text-sm leading-relaxed outline-none transition placeholder:text-[var(--text-muted)] focus:border-neon" />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">{question.length}/{MAX_QUESTION_LENGTH} {copy.chars}</span>
                  {loading ? (
                    <button type="button" onClick={() => abortRef.current?.abort()} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-4 text-sm"><Square size={14} aria-hidden /> {copy.stop}</button>
                  ) : (
                    <button type="submit" disabled={!question.trim() || !assistantConfig.available} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-neon px-4 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp size={16} aria-hidden /> {copy.run}</button>
                  )}
                </div>
              </form>

              <div className="border-t border-white/10 pt-5">
                <h2 className="text-sm font-semibold">{copy.history}</h2>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{copy.historyHint}</p>
                {history.length ? <div className="mt-3 space-y-1">{history.map((item, index) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`block w-full border-l px-3 py-2 text-left text-xs ${selected?.id === item.id ? "border-neon text-[var(--text-primary)]" : "border-white/15 text-[var(--text-muted)]"}`}>0{index + 1} · {item.question}</button>)}</div> : null}
              </div>
            </div>

            <div className="min-w-0 border-t border-white/10 pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
              {loading && selected && !selected.response ? (
                <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-[var(--text-secondary)]"><LoaderCircle className="h-5 w-5 animate-spin text-neon" aria-hidden /> {copy.pending}</div>
              ) : selected?.error ? (
                <div role="alert" className="min-h-72 border-l border-red-400/60 pl-5"><p className="text-sm leading-relaxed text-[var(--text-secondary)]">{selected.error}</p></div>
              ) : selected?.response ? (
                <article>
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div><p className="font-mono text-[11px] uppercase text-neon">{modeLabel}</p><h2 className="mt-1 text-xl font-semibold tracking-normal">{copy.answer}</h2></div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/30 px-3 py-1 font-mono text-[10px] text-neon"><CheckCircle2 size={12} aria-hidden /> {selected.response.corpus}</span>
                  </header>
                  <p className="whitespace-pre-wrap py-6 text-[15px] leading-7 text-[var(--text-secondary)]">{selected.response.answer}</p>

                  <section aria-labelledby="evidence-title" className="border-t border-white/10 pt-6">
                    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="evidence-title" className="text-xl font-semibold tracking-normal">{copy.evidence}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{copy.evidenceHint}</p></div><BookOpen className="h-5 w-5 text-neon" aria-hidden /></div>
                    {selected.response.evidence.length ? <ol className="mt-5 grid gap-3 md:grid-cols-2">{selected.response.evidence.map((evidence) => <li key={evidence.id} className="rounded-md border border-white/10 bg-[var(--surface-1)] p-4"><div className="flex items-start justify-between gap-3"><div><span className="font-mono text-[10px] text-neon">SOURCE 0{evidence.rank}</span><h3 className="mt-1 text-sm font-semibold">{evidence.title}</h3><p className="mt-0.5 text-xs text-[var(--text-muted)]">{evidence.section}</p></div><span className="font-mono text-[10px]">{evidence.score.toFixed(3)}</span></div><p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">{evidence.excerpt}</p><a href={evidence.url} className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-xs text-neon hover:underline">{copy.source}<ExternalLink size={12} aria-hidden /></a></li>)}</ol> : <p className="mt-5 text-sm text-[var(--text-muted)]">{copy.noEvidence}</p>}
                  </section>

                  <section className="mt-8 border-t border-white/10 pt-6" aria-labelledby="pipeline-title"><div className="mb-5 flex items-center gap-2"><FlaskConical className="h-5 w-5 text-neon" aria-hidden /><h2 id="pipeline-title" className="text-xl font-semibold tracking-normal">{copy.pipeline}</h2></div><PipelineVisualizer trace={selected.response.trace} language={language} /></section>
                  <div className="mt-8"><EngineeringInsights response={selected.response} language={language} /></div>
                </article>
              ) : (
                <div className="flex min-h-72 items-center justify-center border-l border-white/10 pl-5"><p className="max-w-md text-sm leading-relaxed text-[var(--text-muted)]">{assistantConfig.available ? copy.empty : copy.unavailable}</p></div>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--bg-secondary)]/50 py-10">
          <div className="site-container grid gap-5 md:grid-cols-[0.65fr_1.35fr]"><h2 className="text-2xl font-semibold tracking-normal">{copy.security}</h2><ul className="grid gap-3 sm:grid-cols-2">{copy.securityItems.map((item, index) => <li key={item} className="border-t border-white/10 pt-3 text-sm text-[var(--text-secondary)]"><span className="mr-2 font-mono text-xs text-neon">0{index + 1}</span>{item}</li>)}</ul></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
