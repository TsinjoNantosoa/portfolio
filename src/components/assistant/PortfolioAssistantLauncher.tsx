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
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[70] sm:bottom-6 sm:right-6">
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-accent/35 bg-[var(--surface-1)]/95 px-3 text-sm font-semibold text-[var(--text-primary)] shadow-[0_16px_50px_rgba(0,0,0,.35)] backdrop-blur transition hover:border-accent/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-4"
          aria-haspopup="dialog"
          aria-label={t("assistant.ask")}
        >
          <span className="grid h-8 w-8 place-items-center text-accent">
            <TsinjoAiMark className="h-7 w-7" />
          </span>
          <span className="hidden sm:inline">{t("assistant.ask")}</span>
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
