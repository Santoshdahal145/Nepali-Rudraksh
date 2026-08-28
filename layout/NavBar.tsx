import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Home", hash: "top" },
  { label: "Shop", hash: "shop" },
  { label: "Collections", hash: "collections" },
  { label: "Offers", hash: "offers" },
  { label: "Our Story", hash: "story" },
];

export default function NavBar() {
  return (
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl text-primary">🕉</span>
        <span className="font-display text-xl font-semibold tracking-tight">
          Nepali Rudraksh
        </span>
      </Link>

      <nav className="hidden items-center gap-7 lg:flex">
        {links.map((l) => (
          <Link
            key={l.hash}
            href="/"

            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <Button variant="ghost">
          <Link href="/login">Login / Register</Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Cart"
          className="relative"
        >
          <ShoppingBag className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            2
          </span>
        </Button>
        <Sheet>
          <SheetTrigger>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="font-display text-xl">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-4">
              {links.map((l) => (
                <Link
                  key={l.hash}
                  href="/"

                  className="text-base font-medium text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
