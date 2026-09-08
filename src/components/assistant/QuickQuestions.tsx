import { useI18n } from "@/i18n/I18nProvider";

export default function QuickQuestions({ questions, onSelect, label }: { questions: string[]; onSelect: (question: string) => void; label?: string }) {
  const { t } = useI18n();
  return <div className="tsinjo-ai__questions" aria-label={label || t("assistant.followUp")}>{questions.map((question) => <button key={question} type="button" onClick={() => onSelect(question)}>{question}</button>)}</div>;
}
