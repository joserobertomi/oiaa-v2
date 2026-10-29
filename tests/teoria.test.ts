import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";

describe("teoria", () => {
  it("tem ao menos 9 páginas, cada uma com resposta curta e regra de bolso", () => {
    expect(content.theory.length).toBeGreaterThanOrEqual(9);
    for (const t of content.theory) {
      expect(t.short.length, t.slug).toBeGreaterThan(30);
      expect(t.rule.length, t.slug).toBeGreaterThan(20);
      expect(t.explanation.length, t.slug).toBeGreaterThan(0);
    }
  });

  it("cobre os conceitos centrais do material", () => {
    const slugs = content.theory.map((t) => t.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "backpropagation",
        "taxa-epocas-lote",
        "transferencia-de-aprendizado",
        "curvas-de-treino",
        "matriz-de-confusao",
        "desempenho-por-grupo",
        "vazamento",
      ]),
    );
  });

  it("todo conceito aparece em algum sintoma ou é consultável pelo índice", () => {
    // Conceitos sem sintoma próprio ficam acessíveis só por /teoria, e isso é aceito.
    const linked = new Set(content.symptoms.flatMap((s) => s.related.theory ?? []));
    expect(linked.size).toBeGreaterThanOrEqual(10);
  });

  it("os sintomas dos 4 casos de curva apontam para curvas-de-treino", () => {
    for (const slug of ["curvas-caem-juntas", "sobreajuste", "subajuste"]) {
      expect(content.symptoms.find((s) => s.slug === slug)?.related.theory).toContain("curvas-de-treino");
    }
  });
});
