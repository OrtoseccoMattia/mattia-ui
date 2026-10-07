"use client";

import { useUIKit } from "../provider";
import { Icon } from "./icon";

/** Errore di caricamento con "Riprova": stesso aspetto su tutte le pagine che leggono dati. */
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { labels } = useUIKit();
  return (
    <div role="alert" className="glass-panel p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4">
      <Icon name="error_outline" className="!text-[48px] text-rose-400 opacity-50" />
      <p className="text-slate-600 dark:text-slate-300 font-bold">{message ?? labels.loadError}</p>
      {onRetry && (
        <button onClick={onRetry} className="rounded-xl h-11 px-6 text-xs font-bold border border-slate-200 dark:border-midnight-700 text-slate-700 dark:text-slate-200 cursor-pointer">
          {labels.retry}
        </button>
      )}
    </div>
  );
}
