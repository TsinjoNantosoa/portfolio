export type PlaygroundCorpus = "projects" | "engineering_lab";
export type PlaygroundExecutionMode = "live" | "guarded" | "no_evidence";
export type PlaygroundStepId =
  | "query"
  | "processing"
  | "retrieval"
  | "context"
  | "generation"
  | "answer"
  | "citations";

export type PlaygroundEvidence = {
  id: string;
  rank: number;
  title: string;
  section: string;
  url: string;
  excerpt: string;
  score: number;
};

export type PlaygroundTraceStep = {
  id: PlaygroundStepId;
  status: "completed" | "skipped" | "error";
  detail: string;
  duration_ms?: number | null;
};

export type PlaygroundResponse = {
  answer: string;
  corpus: PlaygroundCorpus;
  execution_mode: PlaygroundExecutionMode;
  grounded: boolean;
  refusal_reason?: "prompt_injection" | "out_of_scope" | "no_evidence" | null;
  evidence: PlaygroundEvidence[];
  trace: PlaygroundTraceStep[];
  retrieval_strategy: string;
  selected_passages: number;
  response_time_ms: number;
  limitations: string[];
  request_id: string;
};

export type PlaygroundHistoryItem = {
  id: string;
  question: string;
  corpus: PlaygroundCorpus;
  response?: PlaygroundResponse;
  error?: string;
};
