"use client";

export default function EditProductLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin" />
        <span className="absolute text-xl">🌿</span>
      </div>
      <div className="text-center">
        <p className="text-base font-bold text-[#422006]">
          Loading Product for Editing
        </p>
        <p className="text-xs text-[#5c3a1e]/70 mt-1 max-w-sm">
          Fetching current details and specifications...
        </p>
      </div>
    </div>
  );
}
