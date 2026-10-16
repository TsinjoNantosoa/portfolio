import { useId, useMemo, useState } from "react";
import { Briefcase, Building2, PenLine, Play } from "lucide-react";
import type { AutomationCopy } from "../copy";
import { addDays, daysBetween, toIsoDate } from "../dates";
import { CABINS, MAX_NOTE_LENGTH, validateInput } from "../rules";
import { customScenario, presetScenarios } from "../scenarios";
import type { Scenario, ScenarioInput, ValidationIssue } from "../types";

type ScenarioId = Scenario["id"];

const icons = { "business-travel": Briefcase, "corporate-travel": Building2, custom: PenLine };
const order: ScenarioId[] = ["business-travel", "corporate-travel", "custom"];

interface FormState {
  origin: string;
  destination: string;
  passengers: string;
  cabin: ScenarioInput["cabin"];
  departureDate: string;
  returnDate: string;
  note: string;
  vipAgency: boolean;
  urgent: boolean;
}

const initialForm = (): FormState => ({
  origin: "Lisbon",
  destination: "Nairobi",
  passengers: "2",
  cabin: "BUSINESS",
  departureDate: toIsoDate(addDays(new Date(), 14)),
  returnDate: "",
  note: "",
  vipAgency: false,
  urgent: false,
});

const toInput = (form: FormState): ScenarioInput => ({
  origin: form.origin,
  destination: form.destination,
  passengers: form.passengers.trim() === "" ? Number.NaN : Number(form.passengers),
  cabin: form.cabin,
  departureDate: form.departureDate,
  daysToDeparture: daysBetween(toIsoDate(new Date()), form.departureDate),
  returnDate: form.returnDate || undefined,
  note: form.note || undefined,
  vipAgency: form.vipAgency,
  urgent: form.urgent,
});

interface Props {
  copy: AutomationCopy;
  onRun: (scenario: Scenario) => ValidationIssue[];
}

const fieldClass =
  "mt-1 min-h-11 w-full rounded-md border border-white/15 bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-neon aria-[invalid=true]:border-red-400";

const ScenarioPicker = ({ copy, onRun }: Props) => {
  const groupId = useId();
  const [selected, setSelected] = useState<ScenarioId>("business-travel");
  const [form, setForm] = useState<FormState>(initialForm);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const preset = useMemo(() => presetScenarios.find((scenario) => scenario.id === selected), [selected]);
  const issueFor = (field: keyof ScenarioInput) => issues.find((issue) => issue.field === field);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (issues.length > 0) setIssues([]);
  };

  const run = () => {
    if (preset) {
      setIssues(onRun(preset));
      return;
    }
    const input = toInput(form);
    const found = validateInput(input);
    setIssues(found);
    if (found.length === 0) setIssues(onRun(customScenario(input)));
  };

  const errorId = (field: keyof ScenarioInput) => `${groupId}-${field}-error`;
  const describe = (field: keyof ScenarioInput) => (issueFor(field) ? errorId(field) : undefined);
  const message = (field: keyof ScenarioInput) => {
    const issue = issueFor(field);
    return issue ? (
      <p id={errorId(field)} role="alert" className="mt-1 text-xs text-[var(--danger)]">
        {copy.validation[issue.code]}
      </p>
    ) : null;
  };

  return (
    <section aria-labelledby={`${groupId}-title`} className="rounded-lg border border-white/10 bg-[var(--surface-1)] p-5 sm:p-7">
      <h2 id={`${groupId}-title`} className="font-mono text-xs uppercase text-neon">
        {copy.chooseScenario}
      </h2>

      <div role="radiogroup" aria-label={copy.scenarioGroup} className="mt-4 grid gap-3 md:grid-cols-3">
        {order.map((id) => {
          const Icon = icons[id];
          const active = selected === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setSelected(id);
                setIssues([]);
              }}
              className={`min-h-11 rounded-lg border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon ${
                active ? "border-neon bg-neon/[0.06]" : "border-white/10 hover:border-neon/50"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon size={16} className="text-neon" aria-hidden />
                {copy.scenarios[id].title}
              </span>
              <span className="mt-2 block text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {copy.scenarios[id].description}
              </span>
            </button>
          );
        })}
      </div>

      {preset ? (
        <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            [copy.route, `${preset.input.origin} → ${preset.input.destination}`],
            [copy.travelers, String(preset.input.passengers)],
            [copy.cabin, copy.cabins[preset.input.cabin]],
            [copy.departure, `${preset.input.departureDate} · ${copy.inDays(preset.input.daysToDeparture)}`],
            [copy.returnDate, preset.input.returnDate ?? "—"],
            [copy.agency, preset.input.vipAgency ? copy.vip : copy.standard],
            [copy.urgent, preset.input.urgent ? "✓" : "—"],
          ].map(([label, value]) => (
            <div key={label} className="border-t border-white/10 pt-2">
              <dt className="font-mono text-[11px] uppercase text-[var(--text-muted)]">{label}</dt>
              <dd className="mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <fieldset className="mt-5 grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">{copy.customForm.legend}</legend>
          <label className="block text-sm">
            {copy.customForm.origin}
            <input
              className={fieldClass}
              value={form.origin}
              onChange={(event) => update("origin", event.target.value)}
              aria-invalid={Boolean(issueFor("origin"))}
              aria-describedby={describe("origin")}
              autoComplete="off"
            />
            {message("origin")}
          </label>
          <label className="block text-sm">
            {copy.customForm.destination}
            <input
              className={fieldClass}
              value={form.destination}
              onChange={(event) => update("destination", event.target.value)}
              aria-invalid={Boolean(issueFor("destination"))}
              aria-describedby={describe("destination")}
              autoComplete="off"
            />
            {message("destination")}
          </label>
          <label className="block text-sm">
            {copy.customForm.passengers}
            <input
              type="number"
              inputMode="numeric"
              className={fieldClass}
              value={form.passengers}
              onChange={(event) => update("passengers", event.target.value)}
              aria-invalid={Boolean(issueFor("passengers"))}
              aria-describedby={describe("passengers")}
            />
            {message("passengers")}
          </label>
          <label className="block text-sm">
            {copy.customForm.cabin}
            <select
              className={fieldClass}
              value={form.cabin}
              onChange={(event) => update("cabin", event.target.value as ScenarioInput["cabin"])}
              aria-invalid={Boolean(issueFor("cabin"))}
            >
              {CABINS.map((cabin) => (
                <option key={cabin} value={cabin}>
                  {copy.cabins[cabin]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            {copy.customForm.departureDate}
            <input
              type="date"
              className={fieldClass}
              value={form.departureDate}
              onChange={(event) => update("departureDate", event.target.value)}
              aria-invalid={Boolean(issueFor("departureDate") || issueFor("daysToDeparture"))}
              aria-describedby={describe("departureDate") ?? describe("daysToDeparture")}
            />
            {message("departureDate") ?? message("daysToDeparture")}
          </label>
          <label className="block text-sm">
            {copy.customForm.returnDate}
            <input
              type="date"
              className={fieldClass}
              value={form.returnDate}
              onChange={(event) => update("returnDate", event.target.value)}
              aria-invalid={Boolean(issueFor("returnDate"))}
              aria-describedby={describe("returnDate")}
            />
            {message("returnDate")}
          </label>
          <label className="block text-sm sm:col-span-2">
            {copy.customForm.note}
            <textarea
              className={`${fieldClass} min-h-20 py-2`}
              value={form.note}
              onChange={(event) => update("note", event.target.value)}
              aria-invalid={Boolean(issueFor("note"))}
              aria-describedby={`${groupId}-note-hint ${describe("note") ?? ""}`.trim()}
              rows={2}
            />
            <span id={`${groupId}-note-hint`} className="mt-1 flex justify-between gap-3 text-xs text-[var(--text-muted)]">
              <span>{copy.customForm.noteHint}</span>
              <span aria-hidden>
                {form.note.length}/{MAX_NOTE_LENGTH}
              </span>
            </span>
            {message("note")}
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={form.vipAgency} onChange={(event) => update("vipAgency", event.target.checked)} />
            {copy.customForm.vip}
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={form.urgent} onChange={(event) => update("urgent", event.target.checked)} />
            {copy.customForm.urgent}
          </label>
        </fieldset>
      )}

      {issues.length > 0 ? (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          {copy.customForm.fixErrors}
        </p>
      ) : null}

      <button
        type="button"
        onClick={run}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-neon px-5 text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
      >
        <Play size={16} aria-hidden />
        {copy.run}
      </button>
    </section>
  );
};

export default ScenarioPicker;
