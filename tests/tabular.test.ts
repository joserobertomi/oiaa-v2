import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";

const paramsOf = (slug: string) => content.params.filter((p) => p.modelSlug === slug);
const byId = (id: string) => content.params.find((p) => p.id === id);

describe("trilha tabular", () => {
  it("tem os 3 modelos com 10, 10 e 16 parâmetros", () => {
    const tabular = content.models.filter((m) => m.track === "tabular").map((m) => m.slug);
    expect(tabular).toEqual(["rede-densa", "rede-densa-embeddings", "tabnet"]);
    expect(tabular.map((s) => paramsOf(s).length)).toEqual([10, 10, 16]);
  });

  it("marca 3 botões de ajuste por modelo", () => {
    for (const slug of ["rede-densa", "rede-densa-embeddings", "tabnet"]) {
      expect(paramsOf(slug).filter((p) => p.adjust)).toHaveLength(3);
    }
  });

  it("preserva os valores críticos do material", () => {
    expect(byId("rede-densa-taxa")?.suggested).toBe("1e-3");
    expect(byId("tabnet-taxa")?.suggested).toBe("2e-2");
    expect(byId("tabnet-virtual-batch-size")?.suggested).toBe("128");
    expect(byId("tabnet-batch-size")?.suggested).toBe("1024");
    expect(byId("rede-densa-dropout")).toMatchObject({ default: "0.0", suggested: "0.3" });
  });

  it("avisa da pegadinha do lote virtual no TabNet", () => {
    expect(content.models.find((m) => m.slug === "tabnet")?.pitfall).toContain("virtual_batch_size");
  });
});
