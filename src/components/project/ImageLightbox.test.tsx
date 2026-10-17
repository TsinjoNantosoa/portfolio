import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ImageLightbox from "./ImageLightbox";

const images = [
  { src: "/a.png", alt: "First screen", caption: "First caption" },
  { src: "/b.png", alt: "Second screen", caption: "Second caption" },
  { src: "/c.png", alt: "Third screen", caption: "Third caption" },
];
const labels = { close: "Close viewer", previous: "Previous", next: "Next" };

function Harness({ start }: { start: number | null }) {
  const [index, setIndex] = useState<number | null>(start);
  return (
    <>
      <button type="button" onClick={() => setIndex(0)}>
        open
      </button>
      <ImageLightbox images={images} index={index} onIndexChange={setIndex} labels={labels} />
    </>
  );
}

describe("ImageLightbox", () => {
  it("renders nothing while closed", () => {
    render(<Harness start={null} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the full image with its caption and position", () => {
    render(<Harness start={1} />);
    expect(screen.getByRole("dialog", { name: "Second caption" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Second screen" })).toHaveAttribute("src", "/b.png");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("moves with the buttons and arrow keys, wrapping around", async () => {
    render(<Harness start={0} />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("closes with Escape and with the close button", async () => {
    render(<Harness start={0} />);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "open" }));
    await userEvent.click(screen.getByRole("button", { name: "Close viewer" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
