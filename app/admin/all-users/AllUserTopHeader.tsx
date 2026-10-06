export default function AllUserTopHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
          All Users Management
        </h1>
        <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
          Search devotee directory, manage administrator privileges, check
          linked authentication accounts, and verify devotee details.
        </p>
      </div>
    </div>
  );
}
