import { ShieldCheck } from "lucide-react";
import type { AutomationCopy } from "../copy";
import type { Quote } from "../types";

interface Props {
  copy: AutomationCopy;
  quote: Quote;
  selectedOptionId?: string;
}

const usd = (value: number) => `USD ${value.toLocaleString("en-US")}`;

const QuotePanel = ({ copy, quote, selectedOptionId }: Props) => (
  <div>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-base font-semibold">
        {copy.quoteTitle}
        {quote.version}
      </h3>
      <span className="rounded-full border border-amber-400/40 px-2.5 py-1 font-mono text-[11px] text-[var(--warn)]">
        {copy.quoteDemoData}
      </span>
    </div>

    <div className="overflow-x-auto rounded-md border border-white/10">
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">
          {copy.quoteTitle}
          {quote.version}
        </caption>
        <thead className="bg-[var(--bg-primary)] font-mono text-[11px] uppercase text-[var(--text-muted)]">
          <tr>
            <th scope="col" className="px-3 py-2">ID</th>
            <th scope="col" className="px-3 py-2">{copy.carrier}</th>
            <th scope="col" className="px-3 py-2">{copy.cabin}</th>
            <th scope="col" className="px-3 py-2">{copy.perPassenger}</th>
            <th scope="col" className="px-3 py-2">{copy.total}</th>
          </tr>
        </thead>
        <tbody>
          {quote.options.map((option) => {
            const changed = quote.revisionNote?.optionId === option.id;
            return (
              <tr
                key={option.id}
                className={`border-t border-white/10 ${selectedOptionId === option.id ? "bg-neon/[0.07]" : ""}`}
              >
                <td className="px-3 py-3 font-mono text-xs text-neon">{option.id}</td>
                <td className="px-3 py-3">
                  <span className="block font-medium">{option.carrier}</span>
                  <span className="block text-xs text-[var(--text-muted)]">
                    {copy.stops(option.stops)} · {option.departure} → {option.arrival}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-[var(--text-secondary)]">
                  {option.fareClass} · {option.baggage}
                  <span className="block">{option.refundable ? copy.refundable : copy.nonRefundable}</span>
                </td>
                <td className={`px-3 py-3 ${changed ? "font-semibold text-neon" : ""}`}>{usd(option.perPassengerUsd)}</td>
                <td className={`px-3 py-3 font-medium ${changed ? "text-neon" : ""}`}>{usd(option.totalUsd)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {quote.revisionNote ? (
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        {copy.revisionNote(quote.revisionNote.optionId, quote.revisionNote.deltaPerPassengerUsd)}
      </p>
    ) : null}
    <p className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
      <ShieldCheck size={14} className="text-neon" aria-hidden />
      {quote.numbersVerified ? copy.numbersVerified : "—"} · {copy.demoOnly}
    </p>
  </div>
);

export default QuotePanel;
