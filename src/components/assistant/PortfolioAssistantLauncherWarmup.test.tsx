import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioAssistantLauncher from "./PortfolioAssistantLauncher";
import { warmAssistantService } from "./assistant-warmup";

vi.mock("./PortfolioAssistant", () => ({ default: () => <div role="dialog" /> }));
vi.mock("./assistant-warmup", () => ({ warmAssistantService: vi.fn() }));

describe("PortfolioAssistantLauncher pre-warm", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.mocked(warmAssistantService).mockClear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("wakes the assistant service shortly after load, not before", () => {
    render(<PortfolioAssistantLauncher />);
    expect(warmAssistantService).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(warmAssistantService).toHaveBeenCalledOnce();
  });

  it("does nothing if the visitor leaves before the delay", () => {
    const { unmount } = render(<PortfolioAssistantLauncher />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(warmAssistantService).not.toHaveBeenCalled();
  });
});
