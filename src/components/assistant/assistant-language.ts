import type { Language } from "@/i18n/I18nProvider";

const HINT_EN =
  "[Portfolio UI language: English. Prefer English in your answer unless the visitor clearly wrote in another language.]";
const HINT_FR =
  "[Langue de l’interface : français. Privilégiez le français sauf si le visiteur a clairement écrit dans une autre langue.]";

export function messageForAssistantApi(
  visibleMessage: string,
  language: Language,
  maxLength: number,
): string {
  const hint = language === "fr" ? HINT_FR : HINT_EN;
  const prefix = `${hint}\n\n`;
  const budget = Math.max(0, maxLength - prefix.length);
  return `${prefix}${visibleMessage.slice(0, budget)}`;
}
