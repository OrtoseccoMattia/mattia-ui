# @mattia/ui

Componenti, hook e token di tema riusabili tra i siti (Next.js 16 + React 19 + Tailwind 4).
Responsive desktop/mobile già risolto: safe-area, tab bar, fogli che diventano bottom sheet, skeleton.

Il sito `examples/demo` è un secondo sito costruito sul kit con una palette diversa: è anche il catalogo
vivo (`npm run dev:demo`, porta 3013).

Questa è una repo indipendente: i siti (MyGeekManager compreso) lo installano come dipendenza.
Sviluppo: `npm install`, `npm test`, `npm run typecheck`, `npm run build:demo`.

## Rilasciare una nuova versione

1. Aggiorna `version` in `package.json` e committa.
2. Crea il tag: `git tag v0.2.0 && git push --tags`.
3. Nei siti, cambia il numero dopo `#` nella dipendenza e reinstalla.

Mentre sviluppi kit e sito insieme, in locale puoi usare `"@mattia/ui": "file:../mattia-ui"` nel sito
(non funziona su Vercel: tornare alla versione con tag prima del deploy).

## Cosa c'è

| Cosa | Dove |
| --- | --- |
| Shell: `AppFrame`, `TopNav`, `BottomTabBar`, `BottomTabBarAction` | `src/components` |
| shadcn: `button`, `dialog`, `sheet`, `dropdown-menu`, `select`, `calendar`, `switch`, `tooltip`, `sonner`… | `src/components` |
| Generici: `Icon`, `EmptyState`, `ErrorState`, `ConfirmationDialog`, `CollapsibleSection`, skeleton, `PeriodChips`, `VirtualRows` | `src/components` |
| `UIKitProvider` (testi, router, `Link`, icone extra) | `src/provider.tsx` |
| CSS: token, base shadcn, shell, componenti | `src/styles` |

## Creare un nuovo sito

1. Crea un'app Next.js 16 con Tailwind 4 e installa il kit da GitHub, fissando una versione (tag):

   ```json
   "@mattia/ui": "git+https://github.com/OrtoseccoMattia/mattia-ui.git#v0.1.0"
   ```

   **Attenzione al lockfile**: npm, per le dipendenze git, scrive in `package-lock.json` un indirizzo
   `git+ssh://git@github.com/...`. Sulla CI e su Vercel non ci sono chiavi ssh e l'installazione fallisce:
   dopo ogni `npm install` che tocca il kit, sostituisci `git+ssh://git@github.com/` con
   `git+https://github.com/` nella riga `resolved` del kit.

   Poi installa anche i peer: `next-themes` (e `react`, `react-dom`, `tailwindcss` che hai già).
   Per iniziare puoi copiare `examples/demo` (cambiando la dipendenza da `file:../..` a quella sopra).
   Se la repo è privata, Vercel ha bisogno di un token di accesso per installarla.
2. `next.config.ts`: `transpilePackages: ["@mattia/ui"]` (il kit è sorgente TypeScript, non è compilato).
3. CSS del sito:

   ```css
   @import "tailwindcss";
   @import "@mattia/ui/styles.css";   /* token + base + shell + componenti + @source del kit */
   ```

4. Layout: `viewport = { viewportFit: "cover" }` (serve alle utility di safe-area) e un provider:

   ```tsx
   <UIKitProvider Link={Link} navigation={{ push, replace }} labels={{ close: "Chiudi", … }}>
   ```

5. Costruisci le pagine con `AppFrame` + `TopNav` + `BottomTabBar` e passa le voci come props.

## Cambiare colori e aspetto

Tutto passa da variabili CSS, da sovrascrivere nel CSS del sito **dopo** l'import del kit.

- **Superfici** (`theme.css`): `--brand-surface-950/900/800/700`, `--brand-accent-1/2`, `--page-bg`,
  `--panel-bg`, `--panel-border`, `--panel-shadow`. Le utility `bg-midnight-*` (nome storico) le leggono.
- **Accenti di sezione**: definisci una scala con `@theme { --color-<nome>-500: var(--color-amber-500); … }`
  e usa `text-<nome>-600`, `from-<nome>-500 to-<nome>-alt-500` (vedi `examples/demo/app/globals.css`).
  Le classi vanno scritte per intero nel codice: Tailwind non vede quelle composte a runtime.
- **Componenti shadcn**: `--primary`, `--background`, `--card`, `--ring`… in `:root` e `.dark`.
- **Altezze barre**: `--appbar-h`, `--tabbar-h`. **Raggi**: `--radius-control/card/panel/hero`.
- **Font**: `--font-sans`.

## Testi, navigazione, icone

Niente è scritto a mano nei componenti: i testi stanno in `UIKitProvider labels` (default inglese),
la navigazione in `navigation` (default `window.location`), i link in `Link` (default `<a>`) e le
icone aggiuntive in `icons` (oltre alle ~300 già mappate su Lucide, referenziate per nome Material).

## Limiti noti

- Le classi di colore `slate-*` dei componenti sono neutre e restano fisse; solo superfici e accenti sono tokenizzati.
- `ConfirmationDialog` usa `rose` per l'azione distruttiva (semantico, non di brand).
- `CollapsibleSection` ha un default di accento verde: passare `accentClassName`.
- I nomi `midnight-*`, `cyber-*` sono storici; andrebbero rinominati (`surface-*`, `accent-*`).
- Non ancora nel kit: toolbar/filtri/ricerca (hanno molti testi in italiano), che restano nell'app.

## Licenza

MIT, vedi [LICENSE](./LICENSE).
