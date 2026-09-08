import { Monitor, Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { useTheme, type ThemePreference } from "@/theme/ThemeProvider";

const themeIcons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export default function PreferencesControls({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const ThemeIcon = themeIcons[theme];

  return (
    <div className={`preference-controls ${compact ? "is-compact" : ""}`}>
      <div className="language-selector" role="group" aria-label={t("language.label")}>
        {(["en", "fr"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={language === value}
            onClick={() => setLanguage(value)}
          >
            {value.toUpperCase()}
          </button>
        ))}
      </div>
      <label className="theme-selector">
        <ThemeIcon size={14} aria-hidden />
        <span className="sr-only">{t("theme.label")}</span>
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemePreference)}
          aria-label={t("theme.label")}
        >
          <option value="system">{t("theme.system")}</option>
          <option value="light">{t("theme.light")}</option>
          <option value="dark">{t("theme.dark")}</option>
        </select>
      </label>
    </div>
  );
}
