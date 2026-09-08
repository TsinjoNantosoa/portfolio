import { useMemo, useState } from "react";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "./assistant-types";
import QuickQuestions from "./QuickQuestions";
import SourceCards, { isSafeAssistantUrl } from "./SourceCards";
import { useI18n } from "@/i18n/I18nProvider";

export default function MessageBubble({ message, onQuestion }: { message: ChatMessage; onQuestion: (question: string) => void }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const allowedUrls = useMemo(
    () => new Set([
      ...(message.sources || []).map((source) => source.url),
      ...(message.suggestedLinks || []).map((link) => link.url),
    ]),
    [message.sources, message.suggestedLinks],
  );

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return <article className={`tsinjo-ai__message tsinjo-ai__message--${message.role}${message.failed ? " is-error" : ""}`}>
    {message.role === "assistant" ? (
      <div className="tsinjo-ai__markdown">
        <ReactMarkdown
          skipHtml
          components={{
            a: ({ href = "", children }) => {
              if (!isSafeAssistantUrl(href) || !allowedUrls.has(href)) return <span>{children}</span>;
              const external = !href.startsWith("/");
              return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
            },
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    ) : <p>{message.text}</p>}
    <SourceCards sources={message.sources} links={message.suggestedLinks} />
    {message.suggestedQuestions?.length ? <QuickQuestions questions={message.suggestedQuestions} onSelect={onQuestion} label={t("assistant.followUp")} /> : null}
    {message.role === "assistant" && message.text && !message.failed ? (
      <div className="tsinjo-ai__message-tools">
        <button type="button" onClick={() => void copyAnswer()} aria-label={t("assistant.copy")}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? t("assistant.copied") : t("assistant.copy")}</span>
        </button>
        <button type="button" aria-label={t("assistant.helpful")} aria-pressed={feedback === "up"} onClick={() => setFeedback(feedback === "up" ? null : "up")}><ThumbsUp size={13} /></button>
        <button type="button" aria-label={t("assistant.notHelpful")} aria-pressed={feedback === "down"} onClick={() => setFeedback(feedback === "down" ? null : "down")}><ThumbsDown size={13} /></button>
      </div>
    ) : null}
  </article>;
}
