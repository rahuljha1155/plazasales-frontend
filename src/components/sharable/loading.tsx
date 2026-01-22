export default function ShareableLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 pb-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden bg-white dark:bg-zinc-900 animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-video bg-gray-200 dark:bg-zinc-800" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-2/3" />
              <div className="h-9 bg-gray-200 dark:bg-zinc-800 rounded w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
