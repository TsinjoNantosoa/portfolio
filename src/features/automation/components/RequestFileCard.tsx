import type { AutomationCopy } from "../copy";
import type { AutomationRun } from "../types";

interface Props {
  copy: AutomationCopy;
  run: AutomationRun;
}

const RequestFileCard = ({ copy, run }: Props) => {
  const rfqCreated = run.steps.find((step) => step.id === "rfq_created")?.state === "done";
  const body = run.steps.find((step) => step.id === "message_received")?.payload?.body;
  const { extraction, priority, classification } = run;

  const fields: Array<[string, string]> = [
    [copy.fieldIntent, classification?.intent ?? "—"],
    [copy.fieldOrigin, extraction?.origin ?? "—"],
    [copy.fieldDestination, extraction?.destination ?? "—"],
    [copy.fieldPassengers, extraction ? String(extraction.passengers) : "—"],
    [copy.fieldCabin, extraction ? copy.cabins[extraction.cabin] : "—"],
    [copy.fieldPriority, priority ? `${priority.level} (${priority.score})` : "—"],
    [copy.fieldRfq, rfqCreated ? run.rfqId : "—"],
    [copy.fieldStatus, run.status],
    [copy.fieldDesk, run.desk ? copy.desks[run.desk] : "—"],
  ];

  return (
    <aside aria-label={copy.extractedFields} className="rounded-lg border border-white/10 bg-[var(--surface-1)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{copy.extractedFields}</h3>
        {classification ? (
          <span className="rounded-full border border-amber-400/40 px-2.5 py-1 font-mono text-[10px] text-[var(--warn)]">
            {copy.simulatedAi}
          </span>
        ) : null}
      </div>

      {typeof body === "string" ? (
        <figure className="mt-4 border-l-2 border-neon/50 pl-3">
          <figcaption className="font-mono text-[11px] uppercase text-[var(--text-muted)]">{copy.result.clientMessage}</figcaption>
          <blockquote className="mt-1 text-sm italic leading-relaxed text-[var(--text-secondary)]">{body}</blockquote>
        </figure>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0 border-t border-white/10 pt-2">
            <dt className="font-mono text-[10px] uppercase text-[var(--text-muted)]">{label}</dt>
            <dd className="mt-0.5 break-words">{value}</dd>
          </div>
        ))}
      </dl>

      {priority ? (
        <div className="mt-5 border-t border-white/10 pt-4">
          <h4 className="font-mono text-[11px] uppercase text-neon">{copy.fieldPriority}</h4>
          {priority.breakdown.length > 0 ? (
            <ul className="mt-2 space-y-1 text-[13px]">
              {priority.breakdown.map((hit) => (
                <li key={hit.rule} className="flex justify-between gap-3">
                  <span className="text-[var(--text-secondary)]">{copy.priorityRules[hit.rule]}</span>
                  <span className="font-mono text-neon">+{hit.points}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-2 text-xs text-[var(--text-muted)]">{copy.priorityNoAi}</p>
        </div>
      ) : null}
    </aside>
  );
};

export default RequestFileCard;
