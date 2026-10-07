"use client";

import type { ReactNode } from "react";

import { cn } from "../lib/utils";

export interface AppFrameProps {
  /** <TopNav> (o altra barra in alto). Assente = pagina senza barra. */
  header?: ReactNode;
  /** <BottomTabBar>. */
  tabBar?: ReactNode;
  /**
   * Colori (CSS) delle due macchie sfocate dietro la pagina, solo da
   * desktop. Cambiano con transizione quando cambia la sezione.
   */
  backdrop?: [string, string];
  /** Pagina a tutta larghezza, senza padding per le barre (home, landing). */
  bare?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Telaio dell'app: fascia della barra di stato iOS, sfondo, barre e area
 * contenuto con i padding giusti per non finire sotto le barre fisse.
 */
export function AppFrame({ header, tabBar, backdrop, bare = false, children, className }: AppFrameProps) {
  return (
    <>
      {/* Con l'app installata `black-translucent` disegna ora e batteria
          in bianco sopra la pagina: in tema chiaro, sulla navbar bianca,
          sparivano. Una fascia scura alta quanto la safe-area le rende
          leggibili. In Safari la safe-area superiore vale 0: non esiste. */}
      <div aria-hidden className="fixed top-0 inset-x-0 z-[55] h-[env(safe-area-inset-top)] bg-slate-900 dark:bg-midnight-950 pointer-events-none" />

      {/* Solo da desktop: su telefono le macchie sfocate animate
          costringevano Safari a ridipingere di continuo. */}
      {backdrop && (
        <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 animate-blob transition-colors duration-1000"
            style={{ backgroundColor: backdrop[0] }}
          />
          <div
            className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full blur-[120px] opacity-15 animate-blob animation-delay-2000 transition-colors duration-1000"
            style={{ backgroundColor: backdrop[1] }}
          />
        </div>
      )}

      {header}
      {tabBar}

      {/* pt-appbar: la navbar è alta 4rem + safe-area. pb-tabbar tiene
          l'ultima riga sopra la tab bar e la home indicator; da lg in su
          nessuna delle due esiste. */}
      <main className={cn("transition-all duration-300 min-h-svh relative z-10", !bare && "pt-appbar pb-tabbar lg:pb-8", className)}>
        <div className={cn("mx-auto px-4 lg:px-8", bare ? "max-w-none !p-0" : "container")}>{children}</div>
      </main>
    </>
  );
}
