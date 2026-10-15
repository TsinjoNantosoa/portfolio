import { Languages, Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useTheme } from "@/theme/ThemeProvider";

export default function PreferencesControls({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const nextLanguage = language === "en" ? "fr" : "en";
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const languageLabel = nextLanguage === "fr" ? t("language.switchFrench") : t("language.switchEnglish");
  const themeLabel = nextTheme === "light" ? t("theme.switchLight") : t("theme.switchDark");

  return (
    <div className={`preference-controls ${compact ? "is-compact" : ""}`}>
      <button
        type="button"
        className="preference-button language-toggle"
        onClick={() => setLanguage(nextLanguage)}
        aria-label={languageLabel}
        title={languageLabel}
      >
        <Languages size={15} aria-hidden />
        <span>{language.toUpperCase()}</span>
      </button>
      <button
        type="button"
        className="preference-button theme-toggle"
        onClick={() => setTheme(nextTheme)}
        aria-label={themeLabel}
        title={themeLabel}
      >
        {resolvedTheme === "dark" ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
      </button>
    </div>
  );
}
