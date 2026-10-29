import { beforeAll, describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";
import { buildDocs, createSearch, groupResults } from "../src/lib/search.ts";
import type { SearchDoc } from "../src/lib/search.ts";

let search: (q: string) => SearchDoc[];
const top = (q: string, n: number) => search(q).slice(0, n).map((d) => d.id);

beforeAll(() => {
  search = createSearch(buildDocs(content));
});

describe("índice", () => {
  it("indexa todos os tipos de conteúdo", () => {
    const docs = buildDocs(content);
    const total =
      content.models.length + content.params.length + content.symptoms.length + content.theory.length + content.glossary.length;
    expect(docs).toHaveLength(total);
    expect(new Set(docs.map((d) => d.id)).size).toBe(total);
  });
});

describe("consultas-chave", () => {
  it("dropout acha o termo do glossário e o parâmetro", () => {
    const ids = top("dropout", 8);
    expect(ids).toContain("termo:dropout");
    expect(ids).toContain("parametro:rede-densa-dropout");
  });

  it("taxa acha o glossário e o sintoma de taxa alta", () => {
    const ids = top("taxa", 30);
    expect(ids).toContain("termo:taxa-de-aprendizado");
    expect(ids).toContain("sintoma:taxa-alta-demais");
  });

  it("fc leva à camada de saída da ResNet", () => {
    expect(top("fc", 5)).toContain("parametro:resnet-50-camada-saida");
  });

  it("virtual batch leva ao virtual_batch_size do TabNet em primeiro", () => {
    expect(top("virtual batch", 1)).toEqual(["parametro:tabnet-virtual-batch-size"]);
  });

  it("minúscula (com acento ou sem) leva ao do_lower_case", () => {
    expect(top("minúscula", 5)).toContain("parametro:bertimbau-do-lower-case");
    expect(top("minuscula", 5)).toContain("parametro:bertimbau-do-lower-case");
  });

  it("GPU leva ao sintoma de treino lento e ao termo", () => {
    const ids = top("GPU", 5);
    expect(ids).toContain("sintoma:caderno-lento-sem-gpu");
    expect(ids).toContain("termo:gpu");
  });
});

describe("sinônimos", () => {
  it("tokenizador e tradutor chegam às mesmas páginas de texto", () => {
    for (const q of ["tokenizador", "tradutor"]) {
      const ids = top(q, 10);
      expect(ids, q).toContain("teoria:pedacos-de-palavra");
      expect(ids, q).toContain("parametro:bertimbau-identificador");
    }
  });

  it("régua e scaler chegam à padronização", () => {
    for (const q of ["régua", "scaler"]) {
      expect(top(q, 8), q).toContain("parametro:rede-densa-padronizacao");
    }
  });

  it("batch chega ao termo lote", () => {
    expect(top("batch", 10)).toContain("termo:lote");
  });
});

describe("resultados", () => {
  it("palavras vazias não atrapalham a consulta", () => {
    expect(top("como configurar o dropout", 8)).toContain("termo:dropout");
  });

  it("consulta sem sentido não devolve nada", () => {
    expect(search("zzzzqqqq")).toEqual([]);
  });

  it("o primeiro item agrupado é o melhor resultado (é o que o Enter abre)", () => {
    for (const q of ["virtual batch", "fc", "minúscula"]) {
      expect(groupResults(search(q))[0].docs[0].id, q).toBe(search(q)[0].id);
    }
  });

  it("agrupa por tipo e limita cada grupo", () => {
    const groups = groupResults(search("taxa"), 3);
    expect(groups.every((g) => g.docs.length <= 3)).toBe(true);
    expect(groups.map((g) => g.type)).toEqual(
      expect.arrayContaining(["parametro", "termo"]),
    );
  });
});
