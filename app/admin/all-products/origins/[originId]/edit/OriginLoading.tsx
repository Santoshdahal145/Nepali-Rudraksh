"use client";

export default function OriginLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16">
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
        <span className="absolute text-lg">🌍</span>
      </div>
      <p className="text-sm font-semibold text-[#5c3a1e]/70 mt-2">
        Loading origin data…
      </p>
    </div>
  );
}
