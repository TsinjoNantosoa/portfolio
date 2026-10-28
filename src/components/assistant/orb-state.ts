import type { AssistantStatus } from "./assistant-types";

/**
 * What the orb shows. It is a presentation state derived from the chat status, never a second state machine.
 * The API only reports "searching" and then the streamed text, so retrieval and generation are not told apart:
 * both are `processing`.
 */
export type OrbState = "idle" | "processing" | "streaming" | "success" | "error";

export function toOrbState(status: AssistantStatus): OrbState {
  switch (status) {
    case "connecting":
    case "thinking":
      return "processing";
    case "streaming":
      return "streaming";
    case "complete":
      return "success";
    case "error":
    case "rate_limited":
    case "unavailable":
      return "error";
    default:
      return "idle";
  }
}
