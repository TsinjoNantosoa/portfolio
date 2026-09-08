import { useEffect, useId, useRef, useState } from "react";
import { Bot, RotateCcw } from "lucide-react";
import AssistantHeader from "./AssistantHeader";
import Composer from "./Composer";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import TypingIndicator from "./TypingIndicator";
import { AssistantApiError, createPublicSession, streamChat } from "./assistant-api";
import { assistantConfig, INITIAL_QUESTIONS } from "./assistant-config";
import { clearMessages, clearSession, getSession, readMessages, saveMessages, saveSession } from "./assistant-session";
import type { AssistantStatus, ChatMessage, SessionResponse, StreamEvent } from "./assistant-types";
import "./portfolio-assistant.css";

const STATUS_LABELS: Record<AssistantStatus, string> = {
  connecting: "Connecting to Tsinjo AI...", idle: "Public portfolio knowledge", thinking: "Searching portfolio...",
  streaming: "Writing answer...", complete: "Answer grounded in public portfolio data",
  error: "The assistant could not complete the request.", rate_limited: "Too many requests. Please try again shortly.",
  unavailable: "Assistant temporarily unavailable.",
};

export default function PortfolioAssistant({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(readMessages);
  const [session, setSession] = useState<SessionResponse | null>(getSession);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<AssistantStatus>(assistantConfig.available ? "connecting" : "unavailable");
  const [sending, setSending] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!assistantConfig.available) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), assistantConfig.sessionTimeoutMs);
    const cached = getSession();
    if (cached) { setSession(cached); setStatus("idle"); }
    else createPublicSession(assistantConfig.apiBaseUrl, controller.signal).then((value) => { saveSession(value); setSession(value); setStatus("idle"); }).catch((error) => setStatus(error instanceof AssistantApiError && error.status === 429 ? "rate_limited" : "error"));
    inputRef.current?.focus();
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, []);

  useEffect(() => { saveMessages(messages); listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { abortRef.current?.abort(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], textarea:not([disabled])')];
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function acquireSession(force = false, signal?: AbortSignal): Promise<SessionResponse> {
    if (!force) { const active = session || getSession(); if (active) return active; }
    const fresh = await createPublicSession(assistantConfig.apiBaseUrl, signal);
    saveSession(fresh); setSession(fresh); return fresh;
  }

  async function ask(question: string) {
    const clean = question.trim().slice(0, assistantConfig.maxMessageLength);
    if (!clean || sending || !assistantConfig.available) return;
    setLastQuestion(clean); setInput(""); setSending(true); setStatus("connecting");
    const timestamp = Date.now(); const answerId = `a-${timestamp}`;
    setMessages((current) => [...current, { id: `u-${timestamp}`, role: "user", text: clean }, { id: answerId, role: "assistant", text: "" }]);
    const controller = new AbortController(); abortRef.current = controller;
    let timedOut = false; let receivedText = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, assistantConfig.streamTimeoutMs);

    const onEvent = (event: StreamEvent) => {
      if (event.type === "status") setStatus("thinking");
      if (event.type === "delta") { receivedText = true; setStatus("streaming"); setMessages((current) => current.map((item) => item.id === answerId ? { ...item, text: item.text + event.text } : item)); }
      if (event.type === "done") { setStatus("complete"); setMessages((current) => current.map((item) => item.id === answerId ? { ...item, sources: event.sources || [], suggestedLinks: event.suggested_links || [], suggestedQuestions: event.suggested_questions || [] } : item)); }
      if (event.type === "error") throw new AssistantApiError(event.message || "The stream failed.", 0, event.code, event.request_id);
    };

    try {
      let active = await acquireSession(false, controller.signal);
      try { await streamChat(assistantConfig.apiBaseUrl, active, clean, onEvent, controller.signal); }
      catch (error) { if (!(error instanceof AssistantApiError) || error.status !== 401) throw error; clearSession(); active = await acquireSession(true, controller.signal); await streamChat(assistantConfig.apiBaseUrl, active, clean, onEvent, controller.signal); }
    } catch (error) {
      const stopped = error instanceof DOMException && error.name === "AbortError" && !timedOut;
      const rateLimited = error instanceof AssistantApiError && error.status === 429;
      const message = timedOut ? "The response timed out. Please retry." : stopped ? "Response stopped." : rateLimited ? STATUS_LABELS.rate_limited : "The assistant could not answer right now.";
      setStatus(rateLimited ? "rate_limited" : stopped ? "idle" : "error");
      setMessages((current) => current.map((item) => item.id === answerId ? { ...item, text: item.text || message, failed: !stopped && !receivedText } : item));
    } finally { window.clearTimeout(timeout); setSending(false); abortRef.current = null; }
  }

  function resetConversation() { abortRef.current?.abort(); clearMessages(); setMessages([]); setLastQuestion(""); setStatus(assistantConfig.available ? "idle" : "unavailable"); inputRef.current?.focus(); }

  return <div ref={dialogRef} className="tsinjo-ai" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <AssistantHeader titleId={titleId} onClear={resetConversation} onClose={onClose} />
    <div className={`tsinjo-ai__status is-${status}`} role="status"><span />{STATUS_LABELS[status]}</div>
    <div ref={listRef} className="tsinjo-ai__messages" aria-live="polite" aria-busy={sending}>
      {messages.length === 0 && <section className="tsinjo-ai__welcome"><div className="tsinjo-ai__orb"><Bot size={26} /></div><h3>Hi, I am Tsinjo AI.</h3><p>Ask about Tsinjo's RAG systems, AI agents, automation projects, or engineering experience.</p>{assistantConfig.available ? <QuickQuestions questions={INITIAL_QUESTIONS} onSelect={(question) => void ask(question)} /> : <p className="tsinjo-ai__unavailable">The portfolio remains available while the assistant configuration is restored.</p>}</section>}
      {messages.map((message) => <MessageBubble key={message.id} message={message} onQuestion={(question) => void ask(question)} />)}
      {sending && !messages.at(-1)?.text ? <TypingIndicator label={STATUS_LABELS[status]} /> : null}
    </div>
    {lastQuestion && !sending && messages.at(-1)?.failed ? <button type="button" className="tsinjo-ai__retry" onClick={() => void ask(lastQuestion)}><RotateCcw size={14} /> Retry</button> : null}
    <Composer value={input} maxLength={assistantConfig.maxMessageLength} sending={sending} disabled={!assistantConfig.available} inputRef={inputRef} onChange={setInput} onSend={() => void ask(input)} onStop={() => abortRef.current?.abort()} />
    <footer>Public portfolio data only · <a href="/privacy.html">Privacy</a></footer>
  </div>;
}
