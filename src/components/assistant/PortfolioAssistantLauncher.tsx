import { lazy, Suspense, useRef, useState } from "react";
import { Bot, LoaderCircle, Sparkles } from "lucide-react";

const PortfolioAssistant = lazy(() => import("./PortfolioAssistant"));

export default function PortfolioAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); window.setTimeout(() => launcherRef.current?.focus(), 0); };

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group flex min-h-12 items-center gap-2 rounded-full border border-accent/35 bg-[#0D1318]/95 px-4 py-3 text-sm font-semibold text-foreground shadow-[0_16px_50px_rgba(0,0,0,.45)] backdrop-blur transition hover:border-accent/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-haspopup="dialog"
          aria-label="Open Tsinjo AI portfolio assistant"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
            <Bot size={17} aria-hidden="true" />
            <Sparkles className="absolute -right-1 -top-1" size={11} aria-hidden="true" />
          </span>
          Ask my AI
        </button>
      )}
      {open && (
        <Suspense
          fallback={
            <div className="grid h-24 w-64 place-items-center rounded-2xl border border-white/10 bg-[#0D1318] text-sm text-muted-foreground shadow-2xl">
              <span className="flex items-center gap-2"><LoaderCircle className="animate-spin" size={16} /> Loading assistant…</span>
            </div>
          }
        >
          <PortfolioAssistant onClose={close} />
        </Suspense>
      )}
    </div>
  );
}
