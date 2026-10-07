"use client";

import { useUIKit } from "../provider";

const OPTIONS = [3, 6, 12] as const;
export type SpendingMonths = (typeof OPTIONS)[number];

const ACTIVE: Record<string, string> = {
  emerald: "bg-emerald-600 text-white border-emerald-600",
  blue: "bg-blue-600 text-white border-blue-600",
};

/** Selettore del periodo (ultimi 3, 6 o 12 mesi) per i grafici di spesa. */
export function PeriodChips({ value, onChange, accent }: { value: SpendingMonths; onChange: (months: SpendingMonths) => void; accent: string }) {
  const { labels } = useUIKit();
  return (
    <div role="group" aria-label={labels.period} className="flex items-center gap-2">
      {OPTIONS.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={value === m}
          onClick={() => onChange(m)}
          className={`h-9 px-4 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
            value === m ? (ACTIVE[accent] ?? accent) : "bg-white dark:bg-midnight-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-midnight-800"
          }`}
        >
          {m} {labels.months}
        </button>
      ))}
    </div>
  );
}
