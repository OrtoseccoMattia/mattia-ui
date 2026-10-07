import { MouseEvent } from "react";
import { Icon } from "./icon";
import { cn } from "../lib/utils";

const SIZE_CLASSES = {
  sm: { circle: "!w-5 !h-5 !border", check: "!text-xs" },
  md: { circle: "!w-6 !h-6 !border", check: "!text-[14px]" },
  lg: { circle: "", check: "!text-[16px]" }, // default 28px da .selection-circle
} as const;

interface SelectionToggleProps {
  checked: boolean;
  /** Testo per aria-label, es. `Seleziona "Chainsaw Man"` — l'unico modo per
   * uno screen reader di sapere COSA sta selezionando, dato che il cerchio
   * non ha testo visibile. */
  label: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  size?: keyof typeof SIZE_CLASSES;
  /** Stato "alcuni ma non tutti" selezionati (checkbox master). */
  indeterminate?: boolean;
  className?: string;
}

/**
 * Prima era un `<div onClick>`: nessun `tabIndex`, nessuna gestione di
 * Invio/Spazio, nessun ruolo né stato per uno screen reader — l'intera
 * selezione multipla (bulk actions) era irraggiungibile senza mouse o dito,
 * su ogni dominio (giochi/anime/manga, collezione e wishlist). Un
 * `<button role="checkbox">` ottiene gratis dal browser sia il focus da
 * tastiera che l'attivazione con Invio/Spazio; `aria-checked` comunica lo
 * stato a chi non lo vede. Stesso aspetto visivo di prima (la classe
 * `.selection-circle` in globals.css è invariata), stessa API di chiamata
 * (checked/onClick) dei vecchi `<div onClick>` che sostituisce.
 */
export function SelectionToggle({ checked, label, onClick, size = "lg", indeterminate = false, className }: SelectionToggleProps) {
  const sizing = SIZE_CLASSES[size];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={onClick}
      className={cn(
        // Il cerchio è piccolo ma l'area di tocco no: lo pseudo-elemento la porta oltre i 44px.
        "selection-circle relative cursor-pointer appearance-none p-0 leading-none before:absolute before:-inset-3 before:content-['']",
        checked ? "selected" : "unselected",
        sizing.circle,
        className
      )}
    >
      {checked && <Icon name="check" className={cn("!text-white", sizing.check)} />}
      {indeterminate && !checked && <span className="w-2.5 h-0.5 bg-white rounded-full" />}
    </button>
  );
}
