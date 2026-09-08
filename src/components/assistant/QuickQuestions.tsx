export default function QuickQuestions({ questions, onSelect, label = "Suggested questions" }: { questions: string[]; onSelect: (question: string) => void; label?: string }) {
  return <div className="tsinjo-ai__questions" aria-label={label}>{questions.map((question) => <button key={question} type="button" onClick={() => onSelect(question)}>{question}</button>)}</div>;
}
