import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";

const paramsOf = (slug: string) => content.params.filter((p) => p.modelSlug === slug);
const byId = (id: string) => content.params.find((p) => p.id === id);

describe("trilha de visão", () => {
  it("tem os 3 modelos com 12, 14 e 12 parâmetros", () => {
    const slugs = content.models.filter((m) => m.track === "visao").map((m) => m.slug);
    expect(slugs).toEqual(["efficientnet-b0", "resnet-50", "vit-b16"]);
    expect(slugs.map((s) => paramsOf(s).length)).toEqual([12, 14, 12]);
  });

  it("destaca o nome da camada de saída de cada modelo", () => {
    expect(byId("resnet-50-camada-saida")?.suggested).toBe("model.fc");
    expect(byId("efficientnet-b0-camada-saida")?.suggested).toBe("model.classifier[1]");
    expect(byId("vit-b16-camada-saida")?.suggested).toBe("model.heads.head");
    expect(content.models.find((m) => m.slug === "efficientnet-b0")?.pitfall).toContain("classifier[1]");
  });

  it("mostra em destaque taxa 1e-5, lote 16 e entrada 224×224 no ViT", () => {
    for (const id of ["vit-b16-estagio2-taxa", "vit-b16-lote", "vit-b16-entrada"]) {
      expect(byId(id)?.adjust).toBe(true);
    }
    expect(byId("vit-b16-estagio2-taxa")?.suggested).toBe("1e-5");
    expect(byId("vit-b16-lote")?.suggested).toBe("16");
    expect(byId("vit-b16-entrada")?.suggested).toContain("224×224");
  });

  it("preserva as taxas das CNNs e as versões de pesos", () => {
    expect(byId("resnet-50-estagio2-taxa")?.suggested).toBe("1e-4");
    expect(byId("efficientnet-b0-estagio2-taxa")?.suggested).toBe("1e-4");
    expect(byId("resnet-50-pesos")?.suggested).toBe("IMAGENET1K_V2");
    expect(byId("efficientnet-b0-pesos")?.suggested).toBe("IMAGENET1K_V1");
  });
});
