import React, { useEffect, useRef } from "react";
// WebP derived from the original portrait (720x680): 360w for 1x desktop, 720w for 2x phones.
import imgTsinjo360 from "./tsinjo-360.webp";
import imgTsinjo720 from "./tsinjo-720.webp";
import "./profile-image.css";

type ProfileImageProps = {
  className?: string;
};

/**
 * Knowledge-graph motif around the portrait: a few nodes on and just outside the frame, joined by thin links.
 * Coordinates are in the same 0-100 space as the photo; the SVG extends 8% past the frame on every side.
 * Purely decorative: aria-hidden, drawn once by CSS, with a slow pulse only on large screens with a mouse.
 */
const NODES = [
  { x: 50, y: -5 },
  { x: 100, y: 22 },
  { x: 104, y: 72 },
  { x: 64, y: 106 },
  { x: 8, y: 92 },
  { x: -6, y: 40 },
];

// Links join neighbouring nodes (the outer chain) and each node to the edge of the photo.
const LINKS = [
  { x1: 50, y1: -5, x2: 100, y2: 22 },
  { x1: 100, y1: 22, x2: 104, y2: 72 },
  { x1: 104, y1: 72, x2: 64, y2: 106 },
  { x1: 64, y1: 106, x2: 8, y2: 92 },
  { x1: 8, y1: 92, x2: -6, y2: 40 },
  { x1: -6, y1: 40, x2: 50, y2: -5 },
  { x1: 50, y1: -5, x2: 50, y2: 1 },
  { x1: 100, y1: 22, x2: 93, y2: 25 },
  { x1: 104, y1: 72, x2: 97, y2: 70 },
  { x1: 64, y1: 106, x2: 62, y2: 98 },
  { x1: 8, y1: 92, x2: 14, y2: 86 },
  { x1: -6, y1: 40, x2: 2, y2: 41 },
];

const ProfileImage: React.FC<ProfileImageProps> = ({ className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  // A very light parallax for mouse users on large screens: the portrait group follows the pointer by a few pixels.
  // It only writes two CSS variables (no React state), and is never attached for touch or reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return undefined;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--px", x.toFixed(3));
        root.style.setProperty("--py", y.toFixed(3));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      root.style.setProperty("--px", "0");
      root.style.setProperty("--py", "0");
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={`profile-portrait relative ${className}`}>
      <div className="profile-portrait__shift relative mx-auto aspect-square w-full max-w-md">
        <div className="profile-portrait__glow pointer-events-none absolute inset-[12%] rounded-full bg-[var(--brand-accent)] blur-3xl" aria-hidden />

        <svg viewBox="-8 -8 116 116" className="profile-portrait__network" aria-hidden focusable="false">
          <circle className="profile-portrait__ring" cx="50" cy="50" r="52" pathLength="1" />
          <circle className="profile-portrait__sweep" cx="50" cy="50" r="52" pathLength="1" />
          {LINKS.map((link, index) => (
            <line
              key={index}
              className="profile-portrait__link"
              pathLength="1"
              style={{ "--n": index } as React.CSSProperties}
              {...link}
            />
          ))}
          {NODES.map((node, index) => (
            <circle
              key={index}
              className="profile-portrait__node"
              cx={node.x}
              cy={node.y}
              r="1.6"
              style={{ "--n": index } as React.CSSProperties}
            />
          ))}
        </svg>

        <div className="profile-portrait__frame relative mx-auto aspect-square w-full overflow-hidden rounded-full border border-white/15 bg-[var(--surface-2)] p-1 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <div className="overflow-hidden rounded-full border border-neon/20">
            <img
              src={imgTsinjo720}
              srcSet={`${imgTsinjo360} 360w, ${imgTsinjo720} 720w`}
              sizes="(max-width: 1023px) 310px, 330px"
              alt="Sandaniaina Tsinjo Nantosoa"
              width={480}
              height={480}
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
