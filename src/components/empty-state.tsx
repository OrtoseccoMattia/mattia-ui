import { Icon } from "./icon";

/** Accenti predefiniti; qualunque altra stringa è usata come classe di sfondo (es. `bg-brand-600`). */
export type StateAccent = "orange" | "emerald" | "blue" | "rose" | "violet" | (string & {});

const PRIMARY: Record<string, string> = {
  orange: "bg-orange-600",
  emerald: "bg-emerald-600",
  blue: "bg-blue-600",
  rose: "bg-rose-600",
  violet: "bg-violet-600",
};

export interface StateAction {
  label: string;
  onClick: () => void;
}

/**
 * Stato vuoto unico per tutta l'app. Distingue "non c'è ancora nulla" (azione
 * principale: aggiungere) da "i filtri non trovano nulla" (azione: rimuoverli),
 * che prima mostravano entrambi "Nessun X trovato / Aggiungi il primo".
 */
export function EmptyState({
  icon,
  title,
  description,
  accent,
  primary,
  secondary,
}: {
  icon: string;
  title: string;
  description?: string;
  accent: StateAccent;
  primary?: StateAction;
  secondary?: StateAction;
}) {
  return (
    <div role="status" className="glass-panel flex flex-col items-center justify-center text-center gap-2 py-16 sm:py-24 px-6">
      <Icon name={icon} className="!text-[56px] mb-2 opacity-50 text-slate-300 dark:text-slate-200" />
      <p className="text-sm font-bold text-slate-700 dark:text-slate-100">{title}</p>
      {description && <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 max-w-sm">{description}</p>}
      {(primary || secondary) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {primary && (
            <button onClick={primary.onClick} className={`rounded-xl px-6 h-11 text-xs font-bold text-white cursor-pointer ${PRIMARY[accent] ?? accent}`}>
              {primary.label}
            </button>
          )}
          {secondary && (
            <button onClick={secondary.onClick} className="rounded-xl px-6 h-11 text-xs font-bold border border-slate-200 dark:border-midnight-700 text-slate-700 dark:text-slate-200 cursor-pointer">
              {secondary.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
