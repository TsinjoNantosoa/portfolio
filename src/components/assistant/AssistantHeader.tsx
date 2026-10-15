import { RotateCcw, X } from "lucide-react";
import TsinjoAiMark from "@/components/brand/TsinjoAiMark";
import { useI18n } from "@/i18n/I18nProvider";
import type { AssistantStatus } from "./assistant-types";

export default function AssistantHeader({ titleId, status, statusLabel, onClear, onClose }: { titleId: string; status: AssistantStatus; statusLabel: string; onClear: () => void; onClose: () => void }) {
  const { t } = useI18n();
  return <header className="tsinjo-ai__header">
    <div className="tsinjo-ai__mark"><TsinjoAiMark className="h-9 w-9" /></div>
    <div className="tsinjo-ai__identity">
      <p className="tsinjo-ai__eyebrow">{t("assistant.chatWith")}</p>
      <h2 id={titleId}>{t("assistant.title")}</h2>
      <p className={`tsinjo-ai__header-status is-${status}`} role="status"><span />{statusLabel}</p>
    </div>
    <button type="button" onClick={onClear} className="tsinjo-ai__icon" aria-label={t("assistant.clear")}><RotateCcw size={17} /></button>
    <button type="button" onClick={onClose} className="tsinjo-ai__icon no-margin" aria-label={t("assistant.close")}><X size={19} /></button>
  </header>;
}
