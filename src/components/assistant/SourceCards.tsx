/* eslint-disable react-refresh/only-export-components */
import { ArrowUpRight } from "lucide-react";
import type { AssistantSource, SuggestedLink } from "./assistant-types";
import { useI18n } from "@/i18n/I18nProvider";

export const isSafeAssistantUrl = (url: string) =>
  (url.startsWith("/") && !url.startsWith("//")) || /^https:\/\//i.test(url);

function SafeLink({
  url,
  label,
  className,
}: {
  url: string;
  label: string;
  className?: string;
}) {
  if (!isSafeAssistantUrl(url)) return null;
  const external = !url.startsWith("/");
  return (
    <a
      href={url}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{label}</span>
      <ArrowUpRight size={13} aria-hidden />
    </a>
  );
}

export default function SourceCards({
  sources = [],
  links = [],
}: {
  sources?: AssistantSource[];
  links?: SuggestedLink[];
}) {
  const { t } = useI18n();
  return (
    <>
      {sources.length ? (
        <div className="tsinjo-ai__sources">
          <strong>{t("assistant.sources")}</strong>
          <div className="tsinjo-ai__source-grid">
            {sources.slice(0, 3).map((source, index) => (
              <SafeLink
                key={`${source.url}-${source.section}-${index}`}
                url={source.url}
                label={`${source.title}${source.section ? ` · ${source.section}` : ""}`}
              />
            ))}
          </div>
        </div>
      ) : null}
      {links.length ? (
        <div className="tsinjo-ai__actions">
          <strong>{t("assistant.explore")}</strong>
          {links.slice(0, 3).map((link, index) => (
            <SafeLink
              key={`${link.url}-${link.label}-${index}`}
              url={link.url}
              label={link.label}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
