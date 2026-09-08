export function resolveApiConfiguration(configuredValue: string | undefined, isDevelopment: boolean) {
  const configuredUrl = configuredValue?.trim().replace(/\/$/, "") || "";
  return { apiBaseUrl: configuredUrl || (isDevelopment ? "http://localhost:8000" : ""), available: Boolean(configuredUrl || isDevelopment) };
}

const api = resolveApiConfiguration(import.meta.env.VITE_PORTFOLIO_AI_API_URL, import.meta.env.DEV);

export const assistantConfig = {
  ...api,
  maxMessageLength: 800,
  sessionTimeoutMs: 60_000,
  streamTimeoutMs: 90_000,
} as const;

export const INITIAL_QUESTIONS = ["Explore RAG projects", "AI Agents and LangGraph", "Automation with n8n", "Professional experience", "Backend engineering", "Contact Tsinjo"];

if (import.meta.env.PROD && !api.available) {
  console.error("[Tsinjo AI] VITE_PORTFOLIO_AI_API_URL is missing. The assistant is disabled.");
}
