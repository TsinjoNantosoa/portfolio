import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useWhatsAppUrl } from "@/hooks/use-whatsapp";
import AssistantHeader from "./AssistantHeader";
import Composer from "./Composer";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import TypingIndicator from "./TypingIndicator";
import { AssistantApiError, createPublicSession, streamChat } from "./assistant-api";
import { messageForAssistantApi } from "./assistant-language";
import { enrichAssistantMetadata } from "./contextual-suggestions";
import { assistantConfig, INITIAL_QUESTIONS } from "./assistant-config";
import { clearMessages, clearSession, getSession, readMessages, saveMessages, saveSession } from "./assistant-session";
import type { AssistantStatus, ChatMessage, SessionResponse, StreamEvent } from "./assistant-types";
import TsinjoAiMark from "@/components/brand/TsinjoAiMark";
import { useI18n } from "@/i18n/I18nProvider";
import "./portfolio-assistant.css";

export default function PortfolioAssistant({ onClose }: { onClose: () => void }) {
  const { language, t } = useI18n();
  const whatsappUrl = useWhatsAppUrl();
  const statusLabels: Record<AssistantStatus, string> = {
    connecting: t("assistant.connecting"),
    idle: t("assistant.idle"),
    thinking: t("assistant.searching"),
    streaming: t("assistant.writing"),
    complete: t("assistant.complete"),
    error: t("assistant.error"),
    rate_limited: t("assistant.rateLimited"),
    unavailable: t("assistant.unavailable"),
  };
  const initialQuestions = language === "fr"
    ? ["Systèmes RAG", "Agents IA", "Automatisation et n8n", "Ingénierie backend", "Expérience professionnelle", "Contacter Tsinjo"]
    : INITIAL_QUESTIONS;
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
  const retryQuestion = lastQuestion || [...messages].reverse().find((message) => message.role === "user")?.text || "";

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

  async function retryConnection() {
    if (!assistantConfig.available || sending) return;
    setStatus("connecting");
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      assistantConfig.sessionTimeoutMs,
    );
    try {
      clearSession();
      const fresh = await createPublicSession(
        assistantConfig.apiBaseUrl,
        controller.signal,
      );
      saveSession(fresh);
      setSession(fresh);
      setStatus("idle");
      inputRef.current?.focus();
    } catch (error) {
      setStatus(
        error instanceof AssistantApiError && error.status === 429
          ? "rate_limited"
          : "unavailable",
      );
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function ask(question: string, retryFailedAnswer = false) {
    const clean = question.trim().slice(0, assistantConfig.maxMessageLength);
    if (!clean || sending || !assistantConfig.available) return;
    setLastQuestion(clean); setInput(""); setSending(true); setStatus("connecting");
    const timestamp = Date.now(); const answerId = `a-${timestamp}`;
    setMessages((current) => {
      const replacesFailedPair = retryFailedAnswer
        && current.at(-1)?.role === "assistant"
        && current.at(-1)?.failed
        && current.at(-2)?.role === "user"
        && current.at(-2)?.text === clean;
      const base = replacesFailedPair ? current.slice(0, -2) : current;
      return [...base, { id: `u-${timestamp}`, role: "user", text: clean }, { id: answerId, role: "assistant", text: "" }];
    });
    const controller = new AbortController(); abortRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, assistantConfig.streamTimeoutMs);

    const onEvent = (event: StreamEvent) => {
      if (event.type === "status") setStatus("thinking");
      if (event.type === "delta") { setStatus("streaming"); setMessages((current) => current.map((item) => item.id === answerId ? { ...item, text: item.text + event.text } : item)); }
      if (event.type === "done") {
        setStatus("complete");
        const enriched = enrichAssistantMetadata(
          event.sources || [],
          event.suggested_links || [],
          event.suggested_questions || [],
          language,
        );
        setMessages((current) =>
          current.map((item) =>
            item.id === answerId
              ? {
                  ...item,
                  sources: enriched.sources,
                  suggestedLinks: enriched.suggestedLinks,
                  suggestedQuestions: enriched.suggestedQuestions,
                }
              : item,
          ),
        );
      }
      if (event.type === "error") throw new AssistantApiError(event.message || "The stream failed.", 0, event.code, event.request_id);
    };

    try {
      let active = await acquireSession(false, controller.signal);
      const apiMessage = messageForAssistantApi(
        clean,
        language,
        assistantConfig.maxMessageLength,
      );
      try {
        await streamChat(assistantConfig.apiBaseUrl, active, apiMessage, onEvent, controller.signal);
      } catch (error) {
        if (!(error instanceof AssistantApiError) || error.status !== 401) throw error;
        clearSession();
        active = await acquireSession(true, controller.signal);
        await streamChat(assistantConfig.apiBaseUrl, active, apiMessage, onEvent, controller.signal);
      }
    } catch (error) {
      const stopped = error instanceof DOMException && error.name === "AbortError" && !timedOut;
      const rateLimited = error instanceof AssistantApiError && error.status === 429;
      const message = timedOut ? (language === "fr" ? "La réponse a expiré. Réessayez." : "The response timed out. Please retry.") : stopped ? (language === "fr" ? "Réponse arrêtée." : "Response stopped.") : rateLimited ? statusLabels.rate_limited : t("assistant.unavailable");
      setStatus(rateLimited ? "rate_limited" : stopped ? "idle" : "error");
      setMessages((current) => current.map((item) => item.id === answerId ? { ...item, text: item.text || message, failed: !stopped } : item));
    } finally { window.clearTimeout(timeout); setSending(false); abortRef.current = null; }
  }

  function resetConversation() { abortRef.current?.abort(); clearMessages(); setMessages([]); setLastQuestion(""); setStatus(assistantConfig.available ? "idle" : "unavailable"); inputRef.current?.focus(); }

  return <div ref={dialogRef} className="tsinjo-ai" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <AssistantHeader titleId={titleId} status={status} statusLabel={statusLabels[status]} onClear={resetConversation} onClose={onClose} />
    <div ref={listRef} className="tsinjo-ai__messages" aria-live="polite" aria-busy={sending}>
      {messages.length === 0 && <section className="tsinjo-ai__welcome">
        <h3 className="sr-only">{t("assistant.ask")}</h3>
        <div className="tsinjo-ai__welcome-row">
          <div className="tsinjo-ai__orb"><TsinjoAiMark className="h-8 w-8" /></div>
          <div className="tsinjo-ai__welcome-bubble"><p>{t("assistant.greeting")}</p></div>
        </div>
        <p className="tsinjo-ai__choose">{t("assistant.choose")}</p>
        {assistantConfig.available ? <QuickQuestions questions={initialQuestions} onSelect={(question) => void ask(question)} /> : <p className="tsinjo-ai__unavailable">{t("assistant.configRestored")}</p>}
      </section>}
      {messages.map((message) => <MessageBubble key={message.id} message={message} onQuestion={(question) => void ask(question)} />)}
      {sending && !messages.at(-1)?.text ? <TypingIndicator label={statusLabels[status]} /> : null}
    </div>
    {!session && assistantConfig.available && !sending && (status === "error" || status === "unavailable" || status === "rate_limited") ? <button type="button" className="tsinjo-ai__retry" onClick={() => void retryConnection()}><RotateCcw size={14} /> {t("assistant.retryConnection")}</button> : null}
    {retryQuestion && !sending && messages.at(-1)?.failed ? <button type="button" className="tsinjo-ai__retry" onClick={() => void ask(retryQuestion, true)}><RotateCcw size={14} /> {t("assistant.retryAnswer")}</button> : null}
    <Composer value={input} maxLength={assistantConfig.maxMessageLength} sending={sending} disabled={!assistantConfig.available} inputRef={inputRef} onChange={setInput} onSend={() => void ask(input)} onStop={() => abortRef.current?.abort()} />
    <div className="tsinjo-ai__footer">
      {t("assistant.privacy")} · <a href="/privacy.html">{t("assistant.privacyLink")}</a>
      {whatsappUrl && (
        <p className="tsinjo-ai__human">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{t("whatsapp.assistantLink")}</a>
        </p>
      )}
    </div>
  </div>;
}
