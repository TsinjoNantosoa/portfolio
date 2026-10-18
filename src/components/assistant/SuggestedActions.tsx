import QuickQuestions from "./QuickQuestions";
import SourceCards from "./SourceCards";
import type { AssistantSource, SuggestedLink } from "./assistant-types";
import { translate, useI18n, type Language } from "@/i18n/I18nProvider";

export default function SuggestedActions({
  sources,
  links,
  questions,
  onQuestion,
  language,
}: {
  sources?: AssistantSource[];
  links?: SuggestedLink[];
  questions?: string[];
  onQuestion: (question: string) => void;
  /** Language of the message these belong to; defaults to the site language. */
  language?: Language;
}) {
  const { language: siteLanguage } = useI18n();
  const lang = language ?? siteLanguage;
  const hasLinks = Boolean(links?.length);
  const hasQuestions = Boolean(questions?.length);
  if (!sources?.length && !hasLinks && !hasQuestions) return null;

  return (
    <>
      <SourceCards sources={sources} links={links} language={lang} />
      {hasQuestions ? (
        <QuickQuestions
          questions={questions!}
          onSelect={onQuestion}
          label={translate("assistant.followUp", lang)}
        />
      ) : null}
    </>
  );
}
