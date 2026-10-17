/**
 * WhatsApp contact links built from the official click-to-chat format, https://wa.me/<number>?text=<message>.
 * The number comes from `VITE_WHATSAPP_NUMBER` (set in Netlify, never in the code). When it is missing or
 * invalid every WhatsApp link is hidden. The message only pre-fills the chat: the visitor edits and sends it.
 */

/** International number, digits only: no "+", no spaces, no leading zero (E.164 allows 8 to 15 digits here). */
const WHATSAPP_NUMBER_PATTERN = /^[1-9]\d{7,14}$/;

export const parseWhatsAppNumber = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && WHATSAPP_NUMBER_PATTERN.test(trimmed) ? trimmed : undefined;
};

export const buildWhatsAppUrl = (number: string, message: string): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

/** Read on each call so the value can be stubbed in tests; Vite inlines it at build time. */
export const getWhatsAppNumber = (): string | undefined => parseWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER);

if (import.meta.env.PROD && import.meta.env.VITE_WHATSAPP_NUMBER?.trim() && !getWhatsAppNumber()) {
  // The value itself is never logged.
  console.warn("VITE_WHATSAPP_NUMBER is set but is not an international number (digits only, no + or spaces). WhatsApp links are hidden.");
}
