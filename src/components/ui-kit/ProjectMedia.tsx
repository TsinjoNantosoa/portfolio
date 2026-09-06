import React from "react";
import type { PlaceholderKind } from "@/types/portfolio";

interface ProjectMediaProps {
  title: string;
  label?: string;
  src?: string;
  alt: string;
  usePlaceholder?: boolean;
  placeholderKind?: PlaceholderKind;
  placeholderSteps?: string[];
  aspectClassName?: string;
  className?: string;
  objectPosition?: string;
}

const ProjectMedia: React.FC<ProjectMediaProps> = ({
  title,
  label,
  src,
  alt,
  usePlaceholder = false,
  placeholderSteps,
  aspectClassName = "aspect-[16/10]",
  className = "",
  objectPosition = "object-top",
}) => {
  const [failed, setFailed] = React.useState(false);
  const showPlaceholder = usePlaceholder || !src || failed;

  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-2)] ${aspectClassName} ${className}`}
    >
      {!showPlaceholder ? (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            width={1280}
            height={800}
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${objectPosition}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/75 via-transparent to-transparent" />
        </>
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-[radial-gradient(circle_at_top_right,rgba(13,255,163,0.08),transparent_40%),linear-gradient(160deg,#0B1014,#111820)] p-5 sm:p-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-neon/90">
              {label || "Architecture"}
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
              {title}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(placeholderSteps || ["Input", "Process", "Decision", "Output"]).map(
              (step, index, arr) => (
                <React.Fragment key={step}>
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-white/75">
                    {step}
                  </span>
                  {index < arr.length - 1 && (
                    <span className="font-mono text-xs text-neon/70" aria-hidden>
                      →
                    </span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
            Temporary architecture placeholder
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectMedia;
