"use client";

export function CartSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-28 rounded-2xl bg-amber-950/5 animate-pulse border border-amber-900/10"
          />
        ))}
      </div>
      <div className="lg:col-span-4">
        <div className="h-80 rounded-3xl bg-amber-950/5 animate-pulse border border-amber-900/10" />
      </div>
    </div>
  );
}
