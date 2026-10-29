import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";

const slugs = content.symptoms.map((s) => s.slug);

describe("diagnóstico", () => {
  it("tem ao menos 14 sintomas, cada um com causa e ajuste", () => {
    expect(content.symptoms.length).toBeGreaterThanOrEqual(14);
    for (const s of content.symptoms) {
      expect(s.likelyCauses.length, s.slug).toBeGreaterThan(0);
      expect(s.fix.length, s.slug).toBeGreaterThan(20);
    }
  });

  it("cobre os 4 casos de curva", () => {
    expect(slugs).toEqual(
      expect.arrayContaining(["curvas-caem-juntas", "sobreajuste", "subajuste", "taxa-alta-demais"]),
    );
  });

  it("o checklist tem exatamente os 10 erros silenciosos", () => {
    const checks = content.symptoms.filter((s) => s.check);
    expect(checks).toHaveLength(10);
    expect(checks.every((s) => s.group === "silencioso")).toBe(true);
    expect(content.symptoms.filter((s) => s.group === "silencioso")).toHaveLength(10);
  });

  it("os erros mais perigosos têm ligação com os parâmetros certos", () => {
    const rel = (slug: string) => content.symptoms.find((s) => s.slug === slug)?.related.params ?? [];
    expect(rel("erro-camada-saida")).toEqual(
      expect.arrayContaining(["resnet-50-camada-saida", "efficientnet-b0-camada-saida", "vit-b16-camada-saida"]),
    );
    expect(rel("tabnet-lote-virtual")).toContain("tabnet-virtual-batch-size");
    expect(rel("xlm-roberta-diverge")).toContain("xlm-roberta-taxa");
  });
});
