import { ArrowUpRight } from "lucide-react";
import type { ChatMessage } from "./assistant-types";
import QuickQuestions from "./QuickQuestions";

const isInternal = (url: string) => url.startsWith("/") && !url.startsWith("//");
const isSafeLink = (url: string) => isInternal(url) || /^https:\/\//i.test(url);

function SmartLink({ url, label, className }: { url: string; label: string; className?: string }) {
  if (!isSafeLink(url)) return null;
  const external = !isInternal(url);
  return <a href={url} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span>{label}</span><ArrowUpRight size={13} aria-hidden="true" /></a>;
}

export default function MessageBubble({ message, onQuestion }: { message: ChatMessage; onQuestion: (question: string) => void }) {
  return <article className={`tsinjo-ai__message tsinjo-ai__message--${message.role}${message.failed ? " is-error" : ""}`}>
    <p>{message.text}</p>
    {message.sources?.length ? <div className="tsinjo-ai__sources"><strong>Sources</strong>{message.sources.map((source) => <SmartLink key={`${source.url}-${source.section}`} url={source.url} label={`${source.title}${source.section ? ` · ${source.section}` : ""}`} />)}</div> : null}
    {message.suggestedLinks?.length ? <div className="tsinjo-ai__actions"><strong>Explore</strong>{message.suggestedLinks.map((link) => <SmartLink key={`${link.url}-${link.label}`} url={link.url} label={link.label} />)}</div> : null}
    {message.suggestedQuestions?.length ? <QuickQuestions questions={message.suggestedQuestions} onSelect={onQuestion} label="Follow-up questions" /> : null}
  </article>;
}
