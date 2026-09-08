import type { KeyboardEvent, RefObject } from "react";
import { ArrowUp, Square } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Composer({ value, maxLength, sending, disabled, inputRef, onChange, onSend, onStop }: { value: string; maxLength: number; sending: boolean; disabled: boolean; inputRef: RefObject<HTMLTextAreaElement>; onChange: (value: string) => void; onSend: () => void; onStop: () => void }) {
  const { t } = useI18n();
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); } };
  return <div><form className="tsinjo-ai__composer" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
    <textarea ref={inputRef} value={value} onChange={(event) => onChange(event.target.value.slice(0, maxLength))} onKeyDown={onKeyDown} maxLength={maxLength} rows={1} placeholder={disabled ? t("assistant.unavailable") : t("assistant.placeholder")} aria-label={t("assistant.messageLabel")} disabled={disabled || sending} />
    {sending ? <button type="button" onClick={onStop} aria-label={t("assistant.stop")}><Square size={15} /></button> : <button type="submit" disabled={disabled || !value.trim()} aria-label={t("assistant.send")}><ArrowUp size={17} /></button>}
  </form>{value.length >= maxLength * .8 ? <div className="tsinjo-ai__counter">{value.length}/{maxLength}</div> : null}</div>;
}
