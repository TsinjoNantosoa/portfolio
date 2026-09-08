import { RotateCcw, X } from "lucide-react";
import TsinjoAiMark from "@/components/brand/TsinjoAiMark";
import { useI18n } from "@/i18n/I18nProvider";

export default function AssistantHeader({ titleId, onClear, onClose }: { titleId: string; onClear: () => void; onClose: () => void }) {
  const { t } = useI18n();
  return <header className="tsinjo-ai__header">
    <div className="tsinjo-ai__mark"><TsinjoAiMark className="h-6 w-6" /></div>
    <div><h2 id={titleId}>{t("assistant.title")}</h2><p>{t("assistant.subtitle")}</p></div>
    <button type="button" onClick={onClear} className="tsinjo-ai__icon" aria-label={t("assistant.clear")}><RotateCcw size={17} /></button>
    <button type="button" onClick={onClose} className="tsinjo-ai__icon no-margin" aria-label={t("assistant.close")}><X size={19} /></button>
  </header>;
}
