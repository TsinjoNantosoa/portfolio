import { useI18n } from "@/i18n/I18nProvider";
import { buildWhatsAppUrl, getWhatsAppNumber } from "@/lib/whatsapp";

/** Click-to-chat URL with the pre-filled message in the site language, or undefined when WhatsApp is not configured. */
export function useWhatsAppUrl(): string | undefined {
  const { t } = useI18n();
  const number = getWhatsAppNumber();
  return number ? buildWhatsAppUrl(number, t("whatsapp.message")) : undefined;
}
