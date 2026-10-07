export function StatsSkeleton({ variant = "with-budget" }: { variant?: "with-budget" | "simple" }) {
  const statTiles = variant === "with-budget" ? 3 : 2;

  return (
    <>
      <div className={`grid grid-cols-1 gap-6 ${statTiles === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {Array.from({ length: statTiles }).map((_, i) => (
          <div key={i} className="glass-panel p-6">
            <div className="h-3 w-24 skeleton rounded mb-2" />
            <div className="h-12 w-20 skeleton rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {variant === "with-budget" && (
          <div className="col-span-1 md:col-span-2 glass-panel p-6 sm:p-8 min-h-[350px] md:min-h-[450px]">
            <div className="h-6 w-48 skeleton rounded mb-8" />
            <div className="w-full h-64 skeleton rounded-2xl" />
          </div>
        )}
        <div className="glass-panel p-6 sm:p-8 min-h-[350px] md:min-h-[450px]">
          <div className="h-6 w-32 skeleton rounded mb-8" />
          <div className="w-full h-64 skeleton rounded-2xl" />
        </div>
        <div className="glass-panel p-6 sm:p-8 min-h-[350px] md:min-h-[450px]">
          <div className="h-6 w-32 skeleton rounded mb-8" />
          <div className="w-full h-64 skeleton rounded-2xl" />
        </div>
      </div>
    </>
  );
}
