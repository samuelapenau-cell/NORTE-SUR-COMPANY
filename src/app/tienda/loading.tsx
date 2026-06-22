export default function TiendaLoading() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-gold/30" />
            <span className="h-3 w-16 bg-smoke border border-border/50 animate-pulse rounded-sm" />
          </div>
          <div className="h-14 w-48 bg-smoke border border-border/50 animate-pulse rounded-sm mb-2" />
          <div className="h-14 w-64 bg-smoke border border-border/50 animate-pulse rounded-sm mb-4" />
          <div className="h-4 w-80 bg-smoke border border-border/50 animate-pulse rounded-sm" />
        </div>
        <div className="flex gap-10">
          <aside className="hidden md:block w-[220px] flex-shrink-0 space-y-8">
            <div className="space-y-3">
              <div className="h-3 w-20 bg-smoke border border-border/50 animate-pulse rounded-sm" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-24 bg-smoke border border-border/50 animate-pulse rounded-sm" />
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-3 w-12 bg-smoke border border-border/50 animate-pulse rounded-sm" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-8 w-12 bg-smoke border border-border/50 animate-pulse rounded-sm" />
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-smoke border border-border/50 animate-pulse rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
