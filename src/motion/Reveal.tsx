import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useReveal } from "./useReveal";

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render; use "article" or "li" when the markup around it relies on first/last-child selectors. */
  as?: "div" | "article" | "section" | "li";
  /** Position in a group: later items start a little later (capped so a long list never lags). */
  index?: number;
  children: ReactNode;
};

export default function Reveal({ as: Tag = "div", index = 0, children, style, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>();
  const merged = { ...style, "--reveal-index": Math.min(index, 5) } as CSSProperties;
  return (
    <Tag ref={ref as never} style={merged} {...rest}>
      {children}
    </Tag>
  );
}
