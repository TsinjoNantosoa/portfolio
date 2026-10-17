import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import TsinjoAiMark from "@/components/brand/TsinjoAiMark";
import { useI18n } from "@/i18n/I18nProvider";

const PortfolioAssistant = lazy(() => import("./PortfolioAssistant"));

/** The invitation shows once per browser session, a moment after load, then gets out of the way. */
const INVITE_SEEN_KEY = "tsinjo:assistant-invite-seen";
const INVITE_DELAY_MS = 2500;
const INVITE_VISIBLE_MS = 9000;

const inviteAlreadySeen = () => {
  try {
    return window.sessionStorage.getItem(INVITE_SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const rememberInviteSeen = () => {
  try {
    window.sessionStorage.setItem(INVITE_SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the invitation simply shows again on the next visit */
  }
};

export default function PortfolioAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const hideInvite = useCallback(() => {
    // Keep keyboard focus on the launcher if it was inside the invitation that is going away.
    if (inviteRef.current?.contains(document.activeElement)) launcherRef.current?.focus();
    setInviteVisible(false);
    rememberInviteSeen();
  }, []);

  useEffect(() => {
    if (inviteAlreadySeen()) return undefined;
    const showTimer = window.setTimeout(() => setInviteVisible(true), INVITE_DELAY_MS);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!inviteVisible) return undefined;
    const hideTimer = window.setTimeout(hideInvite, INVITE_VISIBLE_MS);
    return () => window.clearTimeout(hideTimer);
  }, [inviteVisible, hideInvite]);

  const openAssistant = () => {
    setInviteVisible(false);
    rememberInviteSeen();
    setOpen(true);
  };
  const close = () => { setOpen(false); window.setTimeout(() => launcherRef.current?.focus(), 0); };

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] pb-0 sm:bottom-6 sm:right-6 lg:z-[70]">
      {!open && (
        <div className="relative">
          {inviteVisible && (
            <div
              ref={inviteRef}
              className="assistant-launcher__copy absolute bottom-[calc(100%+0.75rem)] right-0 hidden w-[min(316px,calc(100vw-3rem))] items-stretch rounded-xl border border-[var(--border-medium)] bg-[var(--surface-1)] text-left text-[15px] leading-snug shadow-[0_16px_50px_rgba(0,0,0,.35)] backdrop-blur sm:flex"
            >
              <button
                type="button"
                onClick={openAssistant}
                className="min-h-[3.75rem] flex-1 rounded-l-xl py-3 pl-5 pr-2 text-left font-semibold text-[var(--text-primary)] transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {t("assistant.prompt")}
              </button>
              <button
                type="button"
                onClick={hideInvite}
                aria-label={t("assistant.dismissInvite")}
                className="grid w-11 shrink-0 place-items-center rounded-r-xl text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={16} aria-hidden />
              </button>
              <span className="pointer-events-none absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-[var(--border-medium)] bg-[var(--surface-1)]" aria-hidden />
            </div>
          )}
          <button
            ref={launcherRef}
            type="button"
            onClick={openAssistant}
            className="assistant-launcher group grid h-[68px] w-[68px] place-items-center rounded-full text-sm font-semibold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-[80px] sm:w-[80px]"
            aria-haspopup="dialog"
            aria-label={t("assistant.ask")}
          >
            <span className="assistant-launcher__avatar grid h-full w-full place-items-center rounded-full border border-accent/55 bg-[#07110d] shadow-[0_10px_35px_rgba(13,255,163,.24)] transition group-hover:scale-105 group-hover:border-accent">
              <TsinjoAiMark className="h-[52px] w-[52px] sm:h-[61px] sm:w-[61px]" />
            </span>
          </button>
        </div>
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
