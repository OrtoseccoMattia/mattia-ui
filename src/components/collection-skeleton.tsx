/**
 * Scheletro della schermata collezione: intestazione con filtri più una
 * griglia di card.
 *
 * Sostituisce il `LoaderOverlay` a tutto schermo nei momenti di attesa
 * dentro l'area contenuto. Un rettangolo che ha già la forma di ciò che
 * arriverà comunica «sto caricando *questo*», mentre uno spinner al
 * centro dello schermo comunica solo «aspetta», e nasconde per intero la
 * struttura in cui l'utente si stava orientando.
 *
 * Le proporzioni ricalcano la griglia reale (`grid-cols-2` da telefono,
 * copertine `aspect-[2/3]`), così l'arrivo dei dati non fa saltare nulla.
 */
export function CollectionSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div className="flex flex-col gap-6 pt-2 sm:pt-8" aria-hidden="true">
      {/* Intestazione: titolo, ricerca, riga di filtri */}
      <div className="section-panel max-sm:!pt-0 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-8 w-52 rounded-lg" />
          <div className="skeleton h-3 w-64 rounded" />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="skeleton h-11 w-full rounded-full md:w-64" />
          <div className="flex gap-2">
            <div className="skeleton h-10 w-28 rounded-full" />
            <div className="skeleton h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
            <div className="skeleton h-3 w-4/5 rounded" />
            <div className="skeleton h-2.5 w-2/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
