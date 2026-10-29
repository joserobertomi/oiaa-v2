"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { TYPE_LABELS } from "../lib/search-types.ts";
import type { SearchDoc } from "../lib/search-types.ts";

type Engine = typeof import("../lib/search.ts");
type Group = ReturnType<Engine["groupResults"]>[number];

/** Na home a busca grande já está na página, então o cabeçalho não repete. */
export function HeaderSearch() {
  return usePathname() === "/" ? null : <SearchBox />;
}

export function SearchBox({ variant = "compact" }: { variant?: "compact" | "hero" }) {
  const hero = variant === "hero";
  const router = useRouter();
  const listId = useId();
  const engine = useRef<{ mod: Engine; run: (q: string) => SearchDoc[] } | null>(null);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const flat = groups.flatMap((g) => g.docs);

  // O índice (e o conteúdo todo) só é baixado no primeiro uso da busca.
  async function load() {
    if (engine.current) return engine.current;
    const [mod, { content }] = await Promise.all([
      import("../lib/search.ts"),
      import("../content/index.ts"),
    ]);
    engine.current = { mod, run: mod.createSearch(mod.buildDocs(content)) };
    return engine.current;
  }

  async function onChange(value: string) {
    setQuery(value);
    setOpen(true);
    setActive(0);
    if (value.trim().length < 2) return setGroups([]);
    const { mod, run } = await load();
    setGroups(mod.groupResults(run(value)));
  }

  function go(doc: SearchDoc) {
    setOpen(false);
    setQuery("");
    setGroups([]);
    router.push(doc.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    if (!flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      go(flat[active]);
    }
  }

  const showEmpty = open && query.trim().length >= 2 && flat.length === 0;

  return (
    <div
      className={`relative w-full ${hero ? "" : "sm:w-64"}`}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <input
        type="search"
        role="combobox"
        aria-label="Buscar no guia"
        aria-expanded={open && flat.length > 0}
        aria-controls={listId}
        aria-activedescendant={open && flat.length ? `${listId}-${active}` : undefined}
        aria-autocomplete="list"
        placeholder={hero ? "Busque um modelo, parâmetro ou erro: dropout, fc, lote…" : "Buscar: dropout, fc, lote…"}
        value={query}
        onFocus={() => {
          void load();
          setOpen(true);
        }}
        onChange={(e) => void onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full bg-background ${hero ? "rounded-lg border-2 px-4 py-3 text-lg" : "rounded-md border px-3 py-2 text-sm"}`}
      />

      {open && (flat.length > 0 || showEmpty) && (
        <div
          id={listId}
          role="listbox"
          aria-label="Resultados"
          className={`absolute right-0 left-0 z-10 mt-1 max-h-96 overflow-y-auto rounded-md border bg-background p-1 shadow-lg ${hero ? "" : "sm:left-auto sm:w-96"}`}
        >
          {showEmpty && <p className="p-2 text-sm">Nada encontrado. Tente outro termo.</p>}
          {groups.map((g) => (
            <div key={g.type} role="group" aria-label={TYPE_LABELS[g.type]}>
              <p className="px-2 pt-2 text-xs font-semibold opacity-70">{TYPE_LABELS[g.type]}</p>
              {g.docs.map((d) => {
                const index = flat.indexOf(d);
                return (
                  <div
                    key={d.id}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={index === active}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(d)}
                    onMouseEnter={() => setActive(index)}
                    className={`cursor-pointer rounded px-2 py-1 text-sm ${
                      index === active ? "bg-black/10 dark:bg-white/15" : ""
                    }`}
                  >
                    <span>{d.title}</span>
                    {d.subtitle && <span className="opacity-70"> · {d.subtitle}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
