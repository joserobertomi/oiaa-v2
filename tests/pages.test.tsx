import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { content } from "../src/content/index.ts";

// A busca usa o roteador do Next, que não existe fora do app.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
  usePathname: () => "/",
}));

const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

describe("caminhos até uma ficha de modelo", () => {
  it("a home leva ao comparador e ao diagnóstico, em um clique", async () => {
    const { default: Home } = await import("../src/app/page.tsx");
    const links = hrefs(renderToStaticMarkup(<Home />));
    expect(links).toEqual(expect.arrayContaining(["/modelos", "/diagnostico", "/parametros", "/teoria", "/glossario", "/checklist"]));
  });

  it("a home traz a busca em destaque", async () => {
    const { default: Home } = await import("../src/app/page.tsx");
    expect(renderToStaticMarkup(<Home />)).toContain('role="combobox"');
  });

  it("o comparador linka os 9 modelos: home → Modelos → ficha, 2 cliques", async () => {
    const { default: Modelos } = await import("../src/app/modelos/page.tsx");
    const links = hrefs(renderToStaticMarkup(<Modelos />));
    for (const m of content.models) expect(links, m.slug).toContain(`/modelos/${m.slug}`);
  });
});
