import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioAssistantLauncher from "./PortfolioAssistantLauncher";

vi.mock("./PortfolioAssistant", () => ({ default: ({ onClose }: { onClose: () => void }) => <div role="dialog"><button onClick={onClose}>Close assistant</button></div> }));

describe("PortfolioAssistantLauncher", () => {
  it("is closed by default, opens explicitly, closes, and restores focus", async () => {
    render(<PortfolioAssistantLauncher />);
    const launcher = screen.getByRole("button", { name: /Ask Tsinjo AI/ });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(launcher);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close assistant" }));
    await waitFor(() => expect(screen.getByRole("button", { name: /Ask Tsinjo AI/ })).toHaveFocus());
  });

  describe("invitation", () => {
    beforeEach(() => {
      window.sessionStorage.clear();
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    const prompt = /Building an AI product/;

    it("appears after a delay, then hides by itself and does not return in the session", () => {
      const { unmount } = render(<PortfolioAssistantLauncher />);
      expect(screen.queryByRole("button", { name: prompt })).not.toBeInTheDocument();
      act(() => { vi.advanceTimersByTime(2600); });
      expect(screen.getByRole("button", { name: prompt })).toBeInTheDocument();
      act(() => { vi.advanceTimersByTime(9100); });
      expect(screen.queryByRole("button", { name: prompt })).not.toBeInTheDocument();
      unmount();
      render(<PortfolioAssistantLauncher />);
      act(() => { vi.advanceTimersByTime(3000); });
      expect(screen.queryByRole("button", { name: prompt })).not.toBeInTheDocument();
    });

    it("can be dismissed, and the chatbot launcher stays available", () => {
      render(<PortfolioAssistantLauncher />);
      act(() => { vi.advanceTimersByTime(2600); });
      act(() => { screen.getByRole("button", { name: "Dismiss suggestion" }).click(); });
      expect(screen.queryByRole("button", { name: prompt })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Ask Tsinjo AI" })).toBeInTheDocument();
    });

    it("shows a calm attention cue on the avatar until the assistant has been opened once", async () => {
      const { container, unmount } = render(<PortfolioAssistantLauncher />);
      expect(container.querySelector(".assistant-launcher__badge")).toHaveTextContent("1");
      expect(container.querySelector(".assistant-launcher__pulse")).toBeInTheDocument();
      expect(container.querySelector(".assistant-launcher__badge")).toHaveAttribute("aria-hidden", "true");
      await act(async () => { screen.getByRole("button", { name: "Ask Tsinjo AI" }).click(); });
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      unmount();
      const again = render(<PortfolioAssistantLauncher />);
      expect(again.container.querySelector(".assistant-launcher__badge")).not.toBeInTheDocument();
      expect(again.container.querySelector(".assistant-launcher__pulse")).not.toBeInTheDocument();
    });

    it("opens the assistant from the invitation text", async () => {
      render(<PortfolioAssistantLauncher />);
      act(() => { vi.advanceTimersByTime(2600); });
      await act(async () => { screen.getByRole("button", { name: prompt }).click(); });
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });
  });
});

