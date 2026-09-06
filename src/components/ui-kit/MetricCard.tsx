import React from "react";

interface MetricCardProps {
  value: string;
  label: string;
  hint?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, hint }) => {
  return (
    <div className="h-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-5 py-4 transition hover:border-[var(--border-medium)]">
      <p className="font-mono text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold leading-none text-neon">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{label}</p>
      {hint && <p className="mt-1 text-[13px] leading-snug text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
};

export default MetricCard;
