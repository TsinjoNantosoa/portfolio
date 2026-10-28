import { memo, useId } from "react";
import type { OrbState } from "./orb-state";
import "./AnimatedAIOrb.css";

type AnimatedAIOrbProps = {
  state?: OrbState;
  /** "fill" takes the size of its container. */
  size?: "small" | "medium" | "fill";
  /** Plays a short fade-and-grow once, when the orb first appears. */
  entrance?: boolean;
  className?: string;
};

const PARTICLES = [0, 130, 250];

/**
 * Decorative orb: a glowing sphere, two slow rings and, while the assistant works, a few particles on an orbit.
 * It carries no logic and no text (the chat status text is the accessible signal), so it is hidden from assistive
 * technology. Every animation is CSS on `transform` and `opacity`, driven by `data-state`, and none of them
 * depends on how many tokens arrive. With reduced motion the orb is a still picture that still tells the
 * states apart (orbit visible while working, a flag on error).
 */
function AnimatedAIOrb({ state = "idle", size = "fill", entrance = false, className = "" }: AnimatedAIOrbProps) {
  const id = useId();
  const bodyId = `${id}-body`;
  const shineId = `${id}-shine`;
  return (
    <span
      className={`ai-orb ai-orb--${size}${entrance ? " ai-orb--enter" : ""}${className ? ` ${className}` : ""}`}
      data-state={state}
      aria-hidden="true"
    >
      <span className="ai-orb__halo" />

      <svg className="ai-orb__layer ai-orb__sphere" viewBox="0 0 100 100" focusable="false">
        <defs>
          <radialGradient id={bodyId} cx="0.36" cy="0.3" r="0.85">
            <stop offset="0" className="ai-orb__stop ai-orb__stop--core" />
            <stop offset="0.5" className="ai-orb__stop ai-orb__stop--mid" />
            <stop offset="1" className="ai-orb__stop ai-orb__stop--edge" />
          </radialGradient>
          <radialGradient id={shineId} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill={`url(#${bodyId})`} />
        <circle cx="50" cy="50" r="45.5" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
        <ellipse cx="37" cy="29" rx="19" ry="10" fill={`url(#${shineId})`} transform="rotate(-28 37 29)" />
        <g className="ai-orb__flag">
          <circle cx="82" cy="18" r="12" fill="#fb923c" stroke="#07110d" strokeWidth="4" />
          <path d="M82 12.5v6.5" stroke="#07110d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="82" cy="24" r="1.9" fill="#07110d" />
        </g>
      </svg>

      <svg className="ai-orb__layer ai-orb__rings" viewBox="0 0 100 100" focusable="false">
        <ellipse cx="50" cy="50" rx="47" ry="18" transform="rotate(-28 50 50)" />
        <ellipse cx="50" cy="50" rx="47" ry="18" transform="rotate(62 50 50)" />
      </svg>

      <svg className="ai-orb__layer ai-orb__orbit" viewBox="0 0 100 100" focusable="false">
        <circle cx="50" cy="50" r="47" className="ai-orb__orbit-path" />
        {PARTICLES.map((angle, index) => (
          <circle
            key={angle}
            cx={50 + 47 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 47 * Math.sin((angle * Math.PI) / 180)}
            r={index === 0 ? 3.2 : 2.2}
            className="ai-orb__particle"
          />
        ))}
      </svg>
    </span>
  );
}

// Memoised so the streamed text re-rendering the chat never re-renders the orb.
export default memo(AnimatedAIOrb);
