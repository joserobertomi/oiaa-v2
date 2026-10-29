import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";

describe("glossário", () => {
  it("tem os 31 termos do material, com definição", () => {
    expect(content.glossary).toHaveLength(31);
    for (const g of content.glossary) expect(g.definition.length).toBeGreaterThan(10);
  });

  it("usa só as 6 categorias conhecidas", () => {
    const cats = new Set(content.glossary.map((g) => g.category));
    expect([...cats].sort()).toEqual(["ambiente", "avaliação", "conceito", "dados", "texto", "treino"]);
  });

  it("linka termos nas fichas tabulares (o content:check garante que existem)", () => {
    const dropout = content.params.find((p) => p.id === "rede-densa-dropout");
    expect(dropout?.glossary).toContain("dropout");
    expect(content.params.filter((p) => p.glossary?.length).length).toBeGreaterThanOrEqual(20);
  });
});
