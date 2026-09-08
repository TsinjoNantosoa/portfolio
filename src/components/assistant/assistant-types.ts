export type AssistantStatus = "connecting" | "idle" | "thinking" | "streaming" | "complete" | "error" | "rate_limited" | "unavailable";

export type AssistantSource = { title: string; url: string; section?: string };
export type SuggestedLink = { label: string; url: string };
export type SessionResponse = { token: string; expires_at: string; session_id: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: AssistantSource[];
  suggestedLinks?: SuggestedLink[];
  suggestedQuestions?: string[];
  failed?: boolean;
};

export type StreamEvent =
  | { type: "status"; status?: AssistantStatus; message?: string; request_id?: string }
  | { type: "delta"; text: string }
  | { type: "done"; sources?: AssistantSource[]; suggested_links?: SuggestedLink[]; suggested_questions?: string[]; request_id?: string }
  | { type: "error"; code?: string; message?: string; request_id?: string };
