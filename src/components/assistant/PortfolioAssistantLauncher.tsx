import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import TsinjoAiMark from "@/components/brand/TsinjoAiMark";
import WhatsAppIcon from "@/components/brand/WhatsAppIcon";
import { useWhatsAppUrl } from "@/hooks/use-whatsapp";
import { useI18n } from "@/i18n/I18nProvider";

const PortfolioAssistant = lazy(() => import("./PortfolioAssistant"));

/** The invitation shows once per browser session, a moment after load, then gets out of the way. */
const INVITE_SEEN_KEY = "tsinjo:assistant-invite-seen";
/** The pulse and the "1" badge on the avatar stay until the visitor opens the assistant once in this session. */
const OPENED_KEY = "tsinjo:assistant-opened";
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

/**
 * True while the element with this id is on screen. Used to hide the floating WhatsApp button where an inline
 * one exists. The element can appear late (lazy page) or disappear (route change), so the lookup follows the DOM.
 */
function useSectionInView(id: string) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || typeof MutationObserver === "undefined") return undefined;
    let target: HTMLElement | null = null;
    const intersection = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    const sync = () => {
      const element = document.getElementById(id);
      if (element === target) return;
      if (target) intersection.unobserve(target);
      target = element;
      if (target) intersection.observe(target);
      else setInView(false);
    };
    sync();
    const mutations = new MutationObserver(sync);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      intersection.disconnect();
    };
  }, [id]);
  return inView;
}

const assistantAlreadyOpened = () => {
  try {
    return window.sessionStorage.getItem(OPENED_KEY) === "1";
  } catch {
    return false;
  }
};

export default function PortfolioAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [unread, setUnread] = useState(() => !assistantAlreadyOpened());
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const whatsappUrl = useWhatsAppUrl();
  const contactInView = useSectionInView("contact");

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
    setUnread(false);
    try {
      window.sessionStorage.setItem(OPENED_KEY, "1");
    } catch {
      /* storage unavailable: the badge simply shows again next time */
    }
    setOpen(true);
  };
  const close = () => { setOpen(false); window.setTimeout(() => launcherRef.current?.focus(), 0); };

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] pb-0 sm:bottom-6 sm:right-6 lg:z-[70]">
      {!open && (
        <div className="relative flex flex-col items-end gap-3">
          {whatsappUrl && !contactInView && (
            <aside aria-label={t("whatsapp.region")}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("whatsapp.floatingLabel")}
                title={t("whatsapp.contactLink")}
                className="whatsapp-fab grid h-12 w-12 place-items-center rounded-full border border-[var(--border-medium)] bg-[var(--surface-1)] shadow-[0_8px_24px_rgba(0,0,0,.28)] transition hover:scale-105 hover:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-[52px] sm:w-[52px]"
              >
                <WhatsAppIcon className="h-6 w-6" />
              </a>
            </aside>
          )}
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
          <div className="relative">
            {unread && <span className="assistant-launcher__pulse" aria-hidden />}
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
            {unread && (
              <span className="assistant-launcher__badge" aria-hidden>
                1
              </span>
            )}
          </div>
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
