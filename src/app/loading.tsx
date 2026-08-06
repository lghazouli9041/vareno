export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28" aria-busy="true" aria-live="polite">
      <div className="h-3 w-28 animate-pulse bg-surface" />
      <div className="mt-5 h-10 w-64 max-w-full animate-pulse bg-surface" />
      <div className="mt-4 h-4 w-full max-w-md animate-pulse bg-surface" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse bg-surface" />
        ))}
      </div>
    </div>
  );
}
