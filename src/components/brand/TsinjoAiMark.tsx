import { useId } from "react";

export default function TsinjoAiMark({ className = "" }: { className?: string }) {
  const titleId = useId();
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-labelledby={titleId}
      fill="none"
    >
      <title id={titleId}>Tsinjo AI</title>
      <defs>
        <linearGradient id={gradientId} x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#36F2AE" />
          <stop offset="1" stopColor="#08A873" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.75C8.7 2.75 3.25 7.7 3.25 14.35c0 4.15 2.15 7.65 5.65 9.7L7.2 28.7l5.05-2.55c1.2.3 2.45.45 3.75.45 7.3 0 12.75-4.95 12.75-12.25S23.3 2.75 16 2.75Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M11.25 10.2c.55-2.1 2.25-3.35 4.75-3.35s4.2 1.25 4.75 3.35"
        stroke="#E8FFF6"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <rect x="8.1" y="9.2" width="15.8" height="12.6" rx="5.6" fill="#061510" stroke="#D9FFF1" strokeWidth="1.2" />
      <rect x="6.8" y="12.25" width="2.3" height="6.2" rx="1.15" fill="#D9FFF1" />
      <rect x="22.9" y="12.25" width="2.3" height="6.2" rx="1.15" fill="#D9FFF1" />
      <path d="M11.4 15.2c.85-1 2.4-1 3.2 0" stroke="#8CFFD3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17.4 15.2c.85-1 2.4-1 3.2 0" stroke="#8CFFD3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.25 18.2c.55.8 1.1 1.15 1.75 1.15s1.2-.35 1.75-1.15" stroke="#8CFFD3" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
