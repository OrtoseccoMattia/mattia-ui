"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icon";

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  /** Classi colore per icona/testo dell'intestazione, un accento per dominio. */
  accentClassName?: string;
}

/**
 * Sezione richiudibile per i form di aggiunta/modifica (manga/anime/game-dialog): i campi
 * facoltativi (voto, prezzo, data acquisto, note) restavano tutti a schermo nello stesso scroll
 * dei campi obbligatori — su telefono erano diverse schermate per aggiungere un solo titolo.
 * Chiusa di default: il percorso rapido (titolo → risultato ricerca → salva) resta breve, e chi
 * vuole i dettagli extra li apre esplicitamente.
 */
export function CollapsibleSection({ title, icon = "tune", defaultOpen = false, children, accentClassName = "text-emerald-600 dark:text-emerald-400" }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between gap-2 py-1 cursor-pointer"
      >
        <span className={`flex items-center gap-2 text-xs font-bold ${accentClassName}`}>
          <Icon name={icon} className="!text-[18px]" />
          {title}
        </span>
        <Icon name={open ? "expand_less" : "expand_more"} className="!text-[20px] text-slate-400" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
