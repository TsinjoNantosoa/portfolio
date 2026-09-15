import QuickQuestions from "./QuickQuestions";
import SourceCards from "./SourceCards";
import type { AssistantSource, SuggestedLink } from "./assistant-types";
import { useI18n } from "@/i18n/I18nProvider";

export default function SuggestedActions({
  sources,
  links,
  questions,
  onQuestion,
}: {
  sources?: AssistantSource[];
  links?: SuggestedLink[];
  questions?: string[];
  onQuestion: (question: string) => void;
}) {
  const { t } = useI18n();
  const hasLinks = Boolean(links?.length);
  const hasQuestions = Boolean(questions?.length);
  if (!sources?.length && !hasLinks && !hasQuestions) return null;

  return (
    <>
      <SourceCards sources={sources} links={links} />
      {hasQuestions ? (
        <QuickQuestions
          questions={questions!}
          onSelect={onQuestion}
          label={t("assistant.followUp")}
        />
      ) : null}
    </>
  );
}
