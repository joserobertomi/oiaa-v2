import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAV } from "@/lib/nav";

describe("navegação", () => {
  it.each(NAV)("$href tem página", ({ href }) => {
    expect(existsSync(`src/app${href}/page.tsx`)).toBe(true);
  });
});
