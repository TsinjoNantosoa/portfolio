export type OperationsStatus = "available" | "no_data" | "disabled" | "stale";

export type OperationsMetrics = {
  requests: number | null;
  successful_requests: number | null;
  errors: number | null;
  success_rate: number | null;
  error_rate: number | null;
  refusals: number | null;
  p50_latency_ms: number | null;
  p95_latency_ms: number | null;
  retrieval_p95_ms: number | null;
  generation_p95_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
};

export type OperationsSummary = {
  status: OperationsStatus;
  period: "24h";
  period_start: string;
  period_end: string;
  metrics: OperationsMetrics;
  request_distribution: Record<"assistant" | "playground" | "test" | "demo", number>;
  error_distribution: Record<string, number>;
  last_event_at: string | null;
  last_updated: string;
  measurement_note: string;
};

