/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTFOLIO_AI_API_URL?: string;
  readonly VITE_CONTACT_API_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
