import { lazy, Suspense, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import TsinjoAiMark from "@/components/brand/TsinjoAiMark";
import { useI18n } from "@/i18n/I18nProvider";

const PortfolioAssistant = lazy(() => import("./PortfolioAssistant"));

export default function PortfolioAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();
  const close = () => { setOpen(false); window.setTimeout(() => launcherRef.current?.focus(), 0); };

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] pb-0 sm:bottom-6 sm:right-6 lg:z-[70]">
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="assistant-launcher group relative block h-[68px] w-[68px] text-sm font-semibold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-[145px] sm:w-[350px]"
          aria-haspopup="dialog"
          aria-label={`${t("assistant.prompt")} ${t("assistant.ask")}`}
        >
          <span className="assistant-launcher__copy absolute left-0 top-0 hidden min-h-20 w-[316px] items-center rounded-xl border border-[var(--border-medium)] bg-[var(--surface-1)]/95 px-5 pr-[4.75rem] text-left text-[15px] leading-snug shadow-[0_16px_50px_rgba(0,0,0,.35)] backdrop-blur transition group-hover:border-accent/60 group-hover:text-accent sm:flex">
            {t("assistant.prompt")}
            <span className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-[var(--border-medium)] bg-[var(--surface-1)]" aria-hidden />
          </span>
          <span className="assistant-launcher__avatar absolute bottom-0 right-0 grid h-[68px] w-[68px] place-items-center rounded-full border border-accent/55 bg-[#07110d] shadow-[0_10px_35px_rgba(13,255,163,.24)] transition group-hover:scale-105 group-hover:border-accent sm:h-[80px] sm:w-[80px]">
            <TsinjoAiMark className="h-[52px] w-[52px] sm:h-[61px] sm:w-[61px]" />
          </span>
        </button>
      )}
      {open && (
        <Suspense
          fallback={
            <div className="grid h-24 w-64 place-items-center rounded-2xl border border-white/10 bg-[var(--surface-1)] text-sm text-muted-foreground shadow-2xl">
              <span className="flex items-center gap-2"><LoaderCircle className="animate-spin" size={16} /> {t("assistant.loading")}</span>
            </div>
          }
        >
          <PortfolioAssistant onClose={close} />
        </Suspense>
      )}
    </div>
  );
}
