import Link from "next/link";
import { APP_NAME, NAV } from "@/lib/nav";
import { HeaderSearch } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="inline-block py-1.5 font-semibold">
          {APP_NAME}
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap gap-4 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="inline-block py-1.5 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex w-full items-center gap-3 sm:w-auto">
          <HeaderSearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
