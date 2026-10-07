/**
 * Scheletro della sola griglia di card (senza intestazione/filtri), per i
 * momenti in cui il resto della UI è già montato e interattivo e solo i
 * dati stanno ancora arrivando — a differenza di `CollectionSkeleton`, che
 * copre l'intera schermata al primo caricamento della route.
 *
 * Prima di questo componente ogni vista di collezione/wishlist/calendario
 * reimplementava lo stesso blocco inline, con conteggio card e colonne
 * leggermente diversi da un file all'altro senza un motivo di dominio.
 */
interface CollectionGridSkeletonProps {
  /** Numero di card placeholder da renderizzare. */
  count?: number;
  /** Aggiunge le due righe di testo sotto la copertina (titolo + sottotitolo),
   * come nelle viste di collezione/wishlist. Le pagine calendario mostrano
   * solo la copertina, quindi passano `false`. */
  withLabels?: boolean;
}

export function CollectionGridSkeleton({ count = 12, withLabels = true }: CollectionGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) =>
        withLabels ? (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[2/3] rounded-2xl skeleton" />
            <div className="h-4 w-3/4 rounded skeleton" />
            <div className="h-3 w-1/2 rounded skeleton" />
          </div>
        ) : (
          <div key={i} className="aspect-[2/3] rounded-2xl skeleton" />
        )
      )}
    </div>
  );
}
