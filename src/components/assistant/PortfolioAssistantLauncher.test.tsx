import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PortfolioAssistantLauncher from "./PortfolioAssistantLauncher";

vi.mock("./PortfolioAssistant", () => ({ default: ({ onClose }: { onClose: () => void }) => <div role="dialog"><button onClick={onClose}>Close assistant</button></div> }));

describe("PortfolioAssistantLauncher", () => {
  it("is closed by default, opens explicitly, closes, and restores focus", async () => {
    render(<PortfolioAssistantLauncher />);
    const launcher = screen.getByRole("button", { name: "Open Tsinjo AI portfolio assistant" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(launcher);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close assistant" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Open Tsinjo AI portfolio assistant" })).toHaveFocus());
  });
});
