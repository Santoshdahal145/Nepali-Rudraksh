import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Authlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen">
      <Link
        href="/"
        className="group fixed left-4 top-4 z-50 flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/80 px-4 py-2 text-sm font-medium text-[#713f12] shadow-md shadow-amber-900/5 backdrop-blur-sm transition-all hover:border-amber-900/30 hover:bg-white hover:shadow-lg hover:shadow-amber-900/10 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Home</span>
      </Link>
      {children}
    </main>
  );
}
