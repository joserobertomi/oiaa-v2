import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";

const paramsOf = (slug: string) => content.params.filter((p) => p.modelSlug === slug);
const byId = (id: string) => content.params.find((p) => p.id === id);
const SLUGS = ["distilbert-multilingual", "bertimbau", "xlm-roberta"];

describe("trilha de texto", () => {
  it("tem os 3 modelos com 12 parâmetros cada", () => {
    const slugs = content.models.filter((m) => m.track === "texto").map((m) => m.slug);
    expect(slugs).toEqual(SLUGS);
    expect(slugs.map((s) => paramsOf(s).length)).toEqual([12, 12, 12]);
  });

  it("repete em cada ficha a regra tokenizador = mesmo nome do modelo", () => {
    for (const slug of SLUGS) {
      const model = content.models.find((m) => m.slug === slug);
      expect(model?.pitfall).toContain("mesmo nome");
      expect(byId(`${slug}-identificador`)?.what).toContain("tokenizador");
    }
  });

  it("trata do_lower_case=False do BERTimbau como obrigatório", () => {
    const p = byId("bertimbau-do-lower-case");
    expect(p?.suggested).toBe("False");
    expect(p?.what).toContain("Obrigatório");
  });

  it("preserva as taxas e os identificadores do material", () => {
    expect(byId("distilbert-multilingual-taxa")?.suggested).toBe("3e-5 a 5e-5");
    expect(byId("bertimbau-taxa")?.suggested).toBe("2e-5");
    expect(byId("xlm-roberta-taxa")?.suggested).toBe("1e-5 a 2e-5");
    expect(byId("bertimbau-identificador")?.suggested).toBe("neuralmind/bert-base-portuguese-cased");
    expect(byId("distilbert-multilingual-identificador")?.suggested).toBe("distilbert-base-multilingual-cased");
  });

  it("usa <s> como token inicial do XLM-RoBERTa e avisa que diverge do material", () => {
    const p = byId("xlm-roberta-token-inicial");
    expect(p?.suggested).toBe("<s>");
    expect(p?.complement?.note).toContain("Diverge do material");
  });
});
