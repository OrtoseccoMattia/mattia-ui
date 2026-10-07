"use client";

import { useState } from "react";
import { Icon } from "./icon";

const KEY = "swipe-hint-seen";

function wasSeen(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Suggerimento una tantum sopra gli elenchi: lo scorrimento delle righe non ha nulla di visibile
 * che lo annunci, e chi non lo sa non lo scopre. Si chiude con un tocco e non torna più.
 */
export function SwipeHint() {
  const [seen, setSeen] = useState(() => (typeof window === "undefined" ? true : wasSeen()));
  if (seen) return null;

  return (
    <div role="note" className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-200 bg-slate-50 dark:bg-white/5 rounded-xl">
      <Icon name="front_hand" className="!text-[20px] shrink-0 text-slate-400" />
      <p className="flex-1 min-w-0">Scorri una riga: verso destra la completi, verso sinistra la elimini.</p>
      <button
        type="button"
        onClick={() => {
          setSeen(true);
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            // Spazio locale non disponibile: il suggerimento tornerà alla prossima visita.
          }
        }}
        className="min-h-11 px-3 text-xs font-bold text-purple-600 dark:text-purple-300 cursor-pointer shrink-0"
      >
        Ho capito
      </button>
    </div>
  );
}
