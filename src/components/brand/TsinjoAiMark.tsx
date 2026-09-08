import { useId } from "react";

export default function TsinjoAiMark({ className = "" }: { className?: string }) {
  const titleId = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-labelledby={titleId}
      fill="none"
    >
      <title id={titleId}>Tsinjo AI</title>
      <path
        d="M16 2.5 27.7 9v14L16 29.5 4.3 23V9L16 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.5 10.2h13M16 10.2v12.1M11.3 22.3h9.4"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="25.8" cy="9.9" r="1.7" fill="currentColor" />
    </svg>
  );
}
