"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

/**
 * Elenco a righe "virtualizzato": nel DOM restano solo le righe vicine allo
 * schermo, non tutte quelle della lista. Con centinaia di titoli la vista a
 * elenco resta fluida e leggera, e lo scroll è quello normale della pagina.
 *
 * Le altezze si misurano da sole (una riga può espandersi, come le serie
 * manga), per questo `estimateSize` è solo un'ipotesi iniziale.
 */
export function VirtualRows<T>({
  items,
  getKey,
  renderRow,
  estimateSize = 88,
  overscan = 8,
}: {
  items: T[];
  getKey: (item: T, index: number) => string | number;
  renderRow: (item: T, index: number) => ReactNode;
  estimateSize?: number;
  overscan?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Distanza del contenitore dall'inizio della pagina: serve a sapere quando le righe entrano nello schermo.
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) setScrollMargin(containerRef.current.getBoundingClientRect().top + window.scrollY);
    };
    update();
    window.addEventListener("resize", update);
    // Se sopra la lista cambia qualcosa (categorie che arrivano dopo, filtri che si espandono)
    // la pagina si allunga: senza ricalcolare, le righe finiscono nel posto sbagliato.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    overscan,
    scrollMargin,
    getItemKey: (index) => getKey(items[index], index),
  });

  return (
    <div ref={containerRef} style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
      {virtualizer.getVirtualItems().map((row) => (
        <div
          key={row.key}
          data-index={row.index}
          ref={virtualizer.measureElement}
          className={row.index < items.length - 1 ? "border-b border-slate-100 dark:border-midnight-800" : undefined}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${row.start - scrollMargin}px)` }}
        >
          {renderRow(items[row.index], row.index)}
        </div>
      ))}
    </div>
  );
}
