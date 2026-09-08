import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, ExternalLink, LoaderCircle, RotateCcw, Square, X } from "lucide-react";
import "./portfolio-assistant.css";

type Source = { title: string; url: string; section?: string };
type Message = { id: string; role: "user" | "assistant"; text: string; sources?: Source[]; failed?: boolean };
type Session = { token: string; expires_at: string; session_id: string };

const API_URL = (import.meta.env.VITE_PORTFOLIO_AI_API_URL || "http://localhost:8000").replace(/\/$/, "");
const STORAGE_KEY = "tsinjo-ai:conversation";
const TOKEN_KEY = "tsinjo-ai:session";
const MAX_MESSAGE_LENGTH = 800;
const QUICK_QUESTIONS = [
  "Which RAG systems has Tsinjo built?",
  "How does he use LangGraph?",
  "Show me his n8n and automation experience.",
  "Which project best demonstrates AI governance?",
  "Where can I find his GitHub and contact details?",
];

function readMessages(): Message[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.slice(-20) : [];
  } catch { return []; }
}

function readSession(): Session | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || "null") as Session | null;
    if (!value?.token || Date.parse(value.expires_at) <= Date.now() + 15_000) return null;
    return value;
  } catch { return null; }
}

async function createSession(signal?: AbortSignal): Promise<Session> {
  const timeoutController = signal ? null : new AbortController();
  const timer = timeoutController ? window.setTimeout(() => timeoutController.abort(), 20_000) : null;
  try {
    const response = await fetch(`${API_URL}/api/public/session`, { method: "POST", signal: signal || timeoutController?.signal });
    if (!response.ok) throw new Error(response.status === 429 ? "Too many requests. Please wait a moment." : "The assistant is waking up. Please retry shortly.");
    const session = await response.json() as Session;
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(session));
    return session;
  } finally { if (timer !== null) window.clearTimeout(timer); }
}

export default function PortfolioAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(readMessages);
  const [session, setSession] = useState<Session | null>(readSession);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Connecting to public knowledge…");
  const [sending, setSending] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleId = useMemo(() => `tsinjo-ai-title-${crypto.randomUUID?.() || Date.now()}`, []);

  useEffect(() => {
    const controller = new AbortController();
    const cachedSession = readSession();
    if (!cachedSession) createSession(controller.signal).then((value) => { setSession(value); setStatus("Public portfolio knowledge"); }).catch((error) => setStatus(error.message));
    else { setSession(cachedSession); setStatus("Public portfolio knowledge"); }
    inputRef.current?.focus();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { abortRef.current?.abort(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = [...dialog.querySelectorAll<HTMLElement>('button, a[href], textarea:not([disabled])')].filter((el) => !el.hasAttribute("disabled"));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function ensureSession(force = false) {
    if (!force) {
      const existing = session || readSession();
      if (existing) return existing;
    }
    const fresh = await createSession();
    setSession(fresh);
    return fresh;
  }

  async function ask(question: string) {
    const clean = question.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!clean || sending) return;
    setLastQuestion(clean);
    setInput("");
    setSending(true);
    setStatus("Finding relevant portfolio evidence…");
    const timestamp = Date.now();
    const answerId = `a-${timestamp}`;
    setMessages((current) => [...current, { id: `u-${timestamp}`, role: "user", text: clean }, { id: answerId, role: "assistant", text: "" }]);
    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 45_000);

    try {
      const request = (active: Session) => fetch(`${API_URL}/api/public/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${active.token}` },
          body: JSON.stringify({ message: clean, conversation_id: active.session_id }),
          signal: controller.signal,
        });
      let activeSession = await ensureSession();
      let response = await request(activeSession);
      if (response.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        activeSession = await ensureSession(true);
        setSession(activeSession);
        response = await request(activeSession);
      }
      if (!response.ok || !response.body) throw new Error(response.status === 429 ? "Rate limit reached. Please wait before trying again." : "The assistant could not answer right now.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const event of events) {
          const data = event.split("\n").find((line) => line.startsWith("data:"))?.slice(5).trim();
          if (!data) continue;
          const payload = JSON.parse(data) as { type: string; text?: string; sources?: Source[]; message?: string };
          if (payload.type === "delta" && payload.text) setMessages((current) => current.map((item) => item.id === answerId ? { ...item, text: item.text + payload.text } : item));
          if (payload.type === "done") setMessages((current) => current.map((item) => item.id === answerId ? { ...item, sources: payload.sources || [] } : item));
          if (payload.type === "error") throw new Error(payload.message || "The response was interrupted.");
        }
        if (done) break;
      }
      setStatus("Public portfolio knowledge");
    } catch (error) {
      const message = timedOut ? "The response timed out. Please retry." : error instanceof DOMException && error.name === "AbortError" ? "Response stopped." : error instanceof Error ? error.message : "Unexpected error.";
      setMessages((current) => current.map((item) => item.id === answerId ? { ...item, text: item.text || message, failed: true } : item));
      setStatus(message);
    } finally { window.clearTimeout(timeout); setSending(false); abortRef.current = null; }
  }

  function submit(event: FormEvent) { event.preventDefault(); void ask(input); }
  function textareaKey(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(input); } }

  return (
    <div ref={dialogRef} className="tsinjo-ai" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="tsinjo-ai__header">
        <div className="tsinjo-ai__mark"><Bot size={19} aria-hidden="true" /></div>
        <div><h2 id={titleId}>Tsinjo AI</h2><p>Portfolio Assistant</p></div>
        <button type="button" onClick={onClose} className="tsinjo-ai__icon" aria-label="Close assistant"><X size={19} /></button>
      </header>
      <div className="tsinjo-ai__status"><span />{status}</div>
      <div ref={listRef} className="tsinjo-ai__messages" aria-live="polite">
        {messages.length === 0 && <section className="tsinjo-ai__welcome"><div className="tsinjo-ai__orb"><Bot size={26} /></div><h3>Explore Tsinjo’s work</h3><p>I answer from curated, public portfolio content and link back to the evidence.</p><div className="tsinjo-ai__questions">{QUICK_QUESTIONS.map((question) => <button key={question} type="button" onClick={() => void ask(question)}>{question}</button>)}</div></section>}
        {messages.map((message) => <article key={message.id} className={`tsinjo-ai__message tsinjo-ai__message--${message.role}${message.failed ? " is-error" : ""}`}><p>{message.text || <span className="tsinjo-ai__thinking"><LoaderCircle size={15} /> Composing…</span>}</p>{message.sources?.length ? <div className="tsinjo-ai__sources"><strong>Sources</strong>{message.sources.map((source) => <a key={`${source.url}-${source.section}`} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.title}{source.section ? ` · ${source.section}` : ""}</span><ExternalLink size={13} /></a>)}</div> : null}</article>)}
      </div>
      {lastQuestion && !sending && messages.at(-1)?.failed && <button type="button" className="tsinjo-ai__retry" onClick={() => void ask(lastQuestion)}><RotateCcw size={14} /> Retry</button>}
      <form className="tsinjo-ai__composer" onSubmit={submit}>
        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))} onKeyDown={textareaKey} maxLength={MAX_MESSAGE_LENGTH} rows={1} placeholder="Ask about projects, skills, or experience…" aria-label="Message Tsinjo AI" disabled={sending} />
        {sending ? <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop response"><Square size={15} /></button> : <button type="submit" disabled={!input.trim()} aria-label="Send message"><ArrowUp size={17} /></button>}
      </form>
      <footer>Public portfolio data only · <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a></footer>
    </div>
  );
}
