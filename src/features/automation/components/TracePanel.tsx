import { ArrowRight } from "lucide-react";
import { describeTrace, type AutomationCopy } from "../copy";
import type { AutomationRun } from "../types";

interface Props {
  copy: AutomationCopy;
  language: "en" | "fr";
  run: AutomationRun;
}

const TracePanel = ({ copy, language, run }: Props) => (
  <section aria-labelledby="trace-title" className="rounded-lg border border-white/10 bg-[var(--surface-1)] p-5 sm:p-7">
    <h2 id="trace-title" className="font-mono text-xs uppercase text-neon">
      {copy.trace.title}
    </h2>
    <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.trace.note}</p>
    <div className="mt-4 overflow-x-auto rounded-md border border-white/10">
      <table className="w-full min-w-[40rem] text-left text-[13px]">
        <thead className="bg-[var(--bg-primary)] font-mono text-[11px] uppercase text-[var(--text-muted)]">
          <tr>
            <th scope="col" className="px-3 py-2">{copy.trace.seq}</th>
            <th scope="col" className="px-3 py-2">{copy.trace.actor}</th>
            <th scope="col" className="px-3 py-2">{copy.trace.event}</th>
            <th scope="col" className="px-3 py-2">{copy.trace.transition}</th>
          </tr>
        </thead>
        <tbody>
          {run.trace.map((event) => (
            <tr key={event.seq} className="border-t border-white/10 align-top">
              <td className="px-3 py-2 font-mono text-xs text-neon">{event.seq}</td>
              <td className="px-3 py-2 text-[var(--text-muted)]">{copy.actors[event.actor]}</td>
              <td className="px-3 py-2 text-[var(--text-secondary)]">{describeTrace(language, event)}</td>
              <td className="px-3 py-2 font-mono text-[11px]">
                {event.from && event.to ? (
                  <span className="inline-flex flex-wrap items-center gap-1">
                    {event.from}
                    <ArrowRight size={11} aria-hidden />
                    <span className="text-neon">{event.to}</span>
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default TracePanel;
