import { assistantConfig } from "@/components/assistant/assistant-config";
import type { OperationsSummary } from "./types";

export async function getOperationsSummary(signal?: AbortSignal): Promise<OperationsSummary> {
  if (!assistantConfig.available) {
    throw new Error("Operations API is not configured.");
  }
  const response = await fetch(`${assistantConfig.apiBaseUrl}/api/public/operations/summary`, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    throw new Error(`Operations summary failed with HTTP ${response.status}.`);
  }
  return response.json();
}

