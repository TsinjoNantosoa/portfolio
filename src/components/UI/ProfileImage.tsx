import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  type Transition,
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import imgTsinjo from "./tsinjo.jpg";
import "./profile-image.css";

const RING_RADIUS = 48;
const RING_C = 2 * Math.PI * RING_RADIUS;
const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

type ProfileImageProps = {
  className?: string;
  /** Sync with Hero copy choreography (seconds). */
  entranceDelay?: number;
};

const TECH_NODES = [
  { x: 50, y: 4, linkX: 62, linkY: 14 },
  { x: 88, y: 58, linkX: 76, linkY: 52 },
  { x: 14, y: 72, linkX: 28, linkY: 62 },
];

const ProfileImage: React.FC<ProfileImageProps> = ({
  className = "",
  entranceDelay = 0.22,
}) => {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [finePointerDesktop, setFinePointerDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 120, damping: 22, mass: 0.6 });
  const springY = useSpring(0, { stiffness: 120, damping: 22, mass: 0.6 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setFinePointerDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const parallaxEnabled =
    finePointerDesktop && !isMobile && !reduceMotion;

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!parallaxEnabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.current = { x: nx, y: ny };
      springX.set(nx * 5);
      springY.set(ny * 5);
    },
    [parallaxEnabled, springX, springY],
  );

  const resetParallax = useCallback(() => {
    springX.set(0);
    springY.set(0);
  }, [springX, springY]);

  const entrance = useMemo(
    () =>
      reduceMotion
        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, scale: 0.9, filter: "blur(3px)" },
    [reduceMotion],
  );

  const entranceTransition: Transition = reduceMotion
    ? { duration: 0.35 }
    : {
        duration: isMobile ? 0.65 : 0.85,
        delay: entranceDelay,
        ease: EASE_OUT,
      };

  const enableIdleFloat = finePointerDesktop && !reduceMotion;

  const floatTransition: Transition = {
    duration: 6,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  };

  return (
    <div
      ref={containerRef}
      className={`profile-portrait relative ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={resetParallax}
    >
      <motion.div
        style={parallaxEnabled ? { x: springX, y: springY } : undefined}
        className="relative mx-auto aspect-square w-full max-w-md"
      >
        <motion.div
          className="profile-portrait__float relative h-full w-full"
          animate={enableIdleFloat ? { y: [0, -3, 0] } : undefined}
          transition={enableIdleFloat ? floatTransition : undefined}
        >
          <motion.div
            className="pointer-events-none absolute inset-[12%] rounded-full bg-[var(--brand-accent)] opacity-0 blur-3xl"
            aria-hidden
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: reduceMotion ? 0.12 : 0.22, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0.3 : 1,
              delay: reduceMotion ? 0 : entranceDelay + 0.05,
              ease: EASE_OUT,
            }}
          />

          <svg
            viewBox="0 0 100 100"
            className="profile-portrait__ring-svg absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="portrait-ring-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="45%" stopColor="var(--brand-accent)" stopOpacity="0.85" />
                <stop offset="55%" stopColor="var(--brand-accent)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--brand-accent)"
              strokeWidth="1.1"
              strokeOpacity="0.35"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              initial={
                reduceMotion
                  ? { pathLength: 1, opacity: 0.35 }
                  : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{
                pathLength: {
                  duration: reduceMotion ? 0.2 : 1.05,
                  delay: reduceMotion ? 0 : entranceDelay + 0.12,
                  ease: EASE_OUT,
                },
                opacity: {
                  duration: 0.4,
                  delay: reduceMotion ? 0 : entranceDelay + 0.1,
                },
              }}
            />
            {!reduceMotion && (
              <motion.g
                className="profile-portrait__ring-highlight"
                style={{ transformOrigin: "50px 50px" }}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 200, opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 1.15,
                  delay: entranceDelay + 0.35,
                  ease: EASE_OUT,
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#portrait-ring-highlight)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray={`14 ${RING_C - 14}`}
                  transform="rotate(-90 50 50)"
                />
              </motion.g>
            )}
            {!reduceMotion &&
              TECH_NODES.map((node, index) => (
                <g key={index} className="profile-portrait__nodes">
                  <motion.line
                    x1={node.linkX}
                    y1={node.linkY}
                    x2={node.x}
                    y2={node.y}
                    stroke="var(--brand-accent)"
                    strokeWidth="0.6"
                    strokeOpacity="0.35"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.45, 0.12] }}
                    transition={{
                      duration: 0.9,
                      delay: entranceDelay + 0.25 + index * 0.08,
                      ease: EASE_OUT,
                    }}
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="1.4"
                    fill="var(--brand-accent)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.7, 0.18], scale: 1 }}
                    transition={{
                      duration: 0.75,
                      delay: entranceDelay + 0.3 + index * 0.08,
                      ease: EASE_OUT,
                    }}
                  />
                </g>
              ))}
          </svg>

          <motion.div
            className="profile-portrait__frame relative mx-auto aspect-square w-full overflow-hidden rounded-full border border-white/15 bg-[var(--surface-2)] p-1 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            initial={entrance}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={entranceTransition}
            whileHover={
              reduceMotion ? undefined : { scale: isMobile ? 1 : 1.025 }
            }
          >
            <div className="overflow-hidden rounded-full border border-neon/20 transition-colors duration-500 group-hover:border-neon/35">
              <img
                src={imgTsinjo}
                alt="Sandaniaina Tsinjo Nantosoa"
                width={480}
                height={480}
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileImage;
