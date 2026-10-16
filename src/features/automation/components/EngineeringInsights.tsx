import type { ReactNode } from "react";
import { Github } from "lucide-react";
import type { AutomationCopy } from "../copy";
import { PRIORITY_WEIGHTS } from "../rules";

export const OFFSHORE_REPO_URL = "https://github.com/TsinjoNantosoa/offshore-fares-ai-automation";

interface Props {
  copy: AutomationCopy;
}

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <article className="rounded-lg border border-white/10 bg-[var(--surface-1)] p-5 sm:p-6">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{children}</div>
  </article>
);

const EngineeringInsights = ({ copy }: Props) => {
  const { insights } = copy;
  const weights = Object.entries(PRIORITY_WEIGHTS) as Array<[keyof typeof PRIORITY_WEIGHTS, number]>;

  return (
    <section id={insights.id} aria-labelledby="insights-title" className="scroll-mt-24 border-t border-white/10 py-12 sm:py-16">
      <div className="site-container">
        <p className="eyebrow mb-2">{insights.eyebrow}</p>
        <h2 id="insights-title" className="text-3xl font-semibold tracking-normal sm:text-4xl">
          {insights.title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">{insights.intro}</p>

        <div className="mt-8 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">{insights.realVsDemo}</caption>
            <thead className="bg-[var(--bg-primary)] font-mono text-[11px] uppercase text-[var(--text-muted)]">
              <tr>
                <th scope="col" className="px-4 py-3">{insights.colAspect}</th>
                <th scope="col" className="px-4 py-3">{insights.colReal}</th>
                <th scope="col" className="px-4 py-3">{insights.colDemo}</th>
              </tr>
            </thead>
            <tbody>
              {insights.comparison.map(([aspect, real, demo]) => (
                <tr key={aspect} className="border-t border-white/10 align-top">
                  <th scope="row" className="px-4 py-3 font-medium">{aspect}</th>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{real}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{demo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Block title={insights.rules.title}>
            <p>{insights.rules.text}</p>
            <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {weights.map(([rule, points]) => (
                <li key={rule} className="flex justify-between gap-3 border-b border-white/5 py-1">
                  <span>{copy.priorityRules[rule]}</span>
                  <span className="font-mono text-neon">+{points}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">{insights.rules.levels}</p>
            <p className="mt-2">{insights.rules.routing}</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">{insights.rules.realOnly}</p>
          </Block>

          <Block title={insights.humanApproval.title}>
            <ul className="list-disc space-y-2 pl-5">
              {insights.humanApproval.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>

          <Block title={insights.reliability.title}>
            <ul className="list-disc space-y-2 pl-5">
              {insights.reliability.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>

          <Block title={insights.n8n.title}>
            <p>{insights.n8n.text}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {insights.n8n.nodes.map(([name, count]) => (
                <li key={name} className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px]">
                  {name} <span className="text-neon">×{count}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">{insights.n8n.note}</p>
            <p className="mt-3 text-xs text-[var(--text-muted)]">{insights.n8n.workflows}</p>
          </Block>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Block title={insights.v2.title}>
            <p>{insights.v2.text}</p>
          </Block>
          <div className="flex flex-col justify-center rounded-lg border border-white/10 bg-[var(--surface-1)] p-5 sm:p-6">
            <a
              href={OFFSHORE_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/20 px-4 text-sm font-semibold transition hover:border-neon/60 hover:text-neon"
            >
              <Github size={16} aria-hidden />
              {copy.ctaGithub}
            </a>
            <p className="mt-3 text-center text-xs text-[var(--text-muted)]">{insights.source}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringInsights;
