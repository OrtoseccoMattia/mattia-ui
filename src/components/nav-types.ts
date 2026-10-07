/** Una voce della navigazione principale (barra in alto e tab bar). */
export interface NavItem {
  href: string;
  label: string;
  /** Nome icona, risolto da <Icon>. */
  icon: string;
}

/**
 * Colore di accento della sezione corrente. Sono classi Tailwind complete
 * (Tailwind non vede quelle composte a runtime): basta passare quelle di
 * una scala definita in theme.css, per esempio `text-manga-600`.
 */
export interface NavAccent {
  /** `from-… to-…`, usato su icona del marchio e indicatore della tab. */
  gradient: string;
  /** Colore del testo/icona attivi. */
  text: string;
  /** Classe del bordo inferiore/superiore delle barre. */
  border: string;
}
