export default function TypingIndicator({ label }: { label: string }) {
  return <div className="tsinjo-ai__typing" role="status"><span /><span /><span /><span className="sr-only">{label}</span></div>;
}
