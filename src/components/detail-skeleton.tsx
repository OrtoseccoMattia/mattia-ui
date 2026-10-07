/**
 * Scheletro delle pagine di dettaglio: stessa impalcatura (copertina e
 * pannelli a sinistra, titolo e trama a destra) così al caricamento non
 * cambia il layout, al posto dello spinner centrato.
 */
export function DetailSkeleton() {
  return (
    <div role="status" aria-busy="true" className="min-h-svh pb-20">
      <span className="sr-only">Caricamento in corso…</span>
      <div className="py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="h-3 w-32 rounded skeleton" />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="w-40 sm:w-64 mx-auto lg:mx-0 aspect-[2/3] rounded-2xl skeleton" />
          <div className="section-panel flex flex-col gap-4">
            <div className="h-4 w-1/3 rounded skeleton" />
            <div className="h-3 w-full rounded skeleton" />
            <div className="h-3 w-5/6 rounded skeleton" />
            <div className="h-3 w-2/3 rounded skeleton" />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-3 items-center lg:items-start">
            <div className="flex gap-2">
              <div className="h-7 w-20 rounded-full skeleton" />
              <div className="h-7 w-24 rounded-full skeleton" />
            </div>
            <div className="h-9 w-3/4 rounded skeleton" />
            <div className="h-4 w-1/3 rounded skeleton" />
          </div>
          <div className="hidden lg:flex gap-4">
            <div className="h-12 w-44 rounded-xl skeleton" />
            <div className="h-12 w-36 rounded-xl skeleton" />
          </div>
          <div className="section-panel flex flex-col gap-3">
            <div className="h-4 w-28 rounded skeleton" />
            <div className="h-3 w-full rounded skeleton" />
            <div className="h-3 w-full rounded skeleton" />
            <div className="h-3 w-4/5 rounded skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}
