import { Bot, RotateCcw, X } from "lucide-react";

export default function AssistantHeader({ titleId, onClear, onClose }: { titleId: string; onClear: () => void; onClose: () => void }) {
  return <header className="tsinjo-ai__header">
    <div className="tsinjo-ai__mark"><Bot size={19} aria-hidden="true" /></div>
    <div><h2 id={titleId}>Tsinjo AI</h2><p>Portfolio Assistant</p></div>
    <button type="button" onClick={onClear} className="tsinjo-ai__icon" aria-label="Clear conversation"><RotateCcw size={17} /></button>
    <button type="button" onClick={onClose} className="tsinjo-ai__icon no-margin" aria-label="Close assistant"><X size={19} /></button>
  </header>;
}
