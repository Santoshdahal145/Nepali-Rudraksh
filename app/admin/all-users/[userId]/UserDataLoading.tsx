"use client";

export default function UserDataLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-32 bg-amber-200/50 rounded-xl" />
      <div className="h-44 bg-amber-100/40 rounded-3xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-96 bg-white rounded-3xl border border-amber-900/10" />
        <div className="lg:col-span-2 h-96 bg-white rounded-3xl border border-amber-900/10" />
      </div>
    </div>
  );
}
