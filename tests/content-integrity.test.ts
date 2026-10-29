import { describe, expect, it } from "vitest";
import { content } from "../src/content/index.ts";
import type { Content, Model, Param } from "../src/content/schema.ts";
import { listComplements, validateContent } from "../src/content/validate.ts";

const model = (over: Partial<Model> = {}): Model => ({
  slug: "tabnet",
  track: "tabular",
  name: "TabNet",
  profile: "avançada",
  summary: "Decide em vários passos.",
  chooseIf: "quer explicar as decisões",
  expect: "mostra as colunas usadas",
  pitfall: "virtual_batch_size precisa dividir batch_size",
  ready: "O laço de treino.",
  params: ["tabnet-n-steps"],
  source: "oiaa",
  ...over,
});

const param = (over: Partial<Param> = {}): Param => ({
  id: "tabnet-n-steps",
  modelSlug: "tabnet",
  name: "n_steps",
  suggested: "4",
  range: "3 a 10",
  what: "Quantos passos de decisão.",
  source: "oiaa",
  ...over,
});

const base = (over: Partial<Content> = {}): Content => ({
  models: [model()],
  params: [param()],
  symptoms: [],
  theory: [],
  glossary: [{ id: "epoca", term: "Época", category: "treino", definition: "Uma passada pelo treino.", source: "oiaa" }],
  ...over,
});

// O TabNet real tem 16 parâmetros; nos testes de estrutura liberamos a contagem.
const semContagem = { checkCounts: false };

describe("validateContent", () => {
  it("aceita conteúdo íntegro", () => {
    expect(validateContent(base(), semContagem)).toEqual([]);
  });

  it("falha quando falta source", () => {
    const m = model({ source: undefined as never });
    expect(validateContent(base({ models: [m] }), semContagem)).toContainEqual(
      expect.stringContaining("source"),
    );
  });

  it("falha com source inválido", () => {
    const p = param({ source: "inventado" as never });
    expect(validateContent(base({ params: [p] }), semContagem)).toContainEqual(
      expect.stringContaining("source"),
    );
  });

  it("falha com slug de modelo duplicado", () => {
    const errs = validateContent(base({ models: [model(), model()] }), semContagem);
    expect(errs).toContainEqual(expect.stringContaining("duplicado"));
  });

  it("falha com id de parâmetro duplicado", () => {
    const errs = validateContent(
      base({ params: [param(), param()], models: [model({ params: ["tabnet-n-steps", "tabnet-n-steps"] })] }),
      semContagem,
    );
    expect(errs).toContainEqual(expect.stringContaining("duplicado"));
  });

  it("falha quando o modelo referencia parâmetro inexistente", () => {
    const m = model({ params: ["tabnet-n-steps", "nao-existe"] });
    expect(validateContent(base({ models: [m] }), semContagem)).toContainEqual(
      expect.stringContaining("nao-existe"),
    );
  });

  it("falha quando o parâmetro aponta para modelo inexistente", () => {
    const p = param({ modelSlug: "fantasma" });
    expect(validateContent(base({ params: [p] }), semContagem)).toContainEqual(
      expect.stringContaining("fantasma"),
    );
  });

  it("falha quando o parâmetro não está listado no modelo dono", () => {
    const m = model({ params: [] });
    expect(validateContent(base({ models: [m] }), semContagem)).toContainEqual(
      expect.stringContaining("tabnet-n-steps"),
    );
  });

  it("falha com termo de glossário inexistente em parâmetro", () => {
    const p = param({ glossary: ["nada"] });
    expect(validateContent(base({ params: [p] }), semContagem)).toContainEqual(
      expect.stringContaining("nada"),
    );
  });

  it("falha com referência quebrada em sintoma", () => {
    const symptoms = [
      {
        slug: "val-sobe",
        title: "Validação sobe",
        group: "curvas" as const,
        likelyCauses: ["decorando"],
        fix: "parada antecipada",
        related: { models: ["x"], params: ["y"], theory: ["z"] },
        source: "oiaa" as const,
      },
    ];
    const errs = validateContent(base({ symptoms }), semContagem);
    expect(errs).toEqual(
      expect.arrayContaining([
        expect.stringContaining('"x"'),
        expect.stringContaining('"y"'),
        expect.stringContaining('"z"'),
      ]),
    );
  });

  it("falha com termo de glossário inexistente em teoria", () => {
    const theory = [{ slug: "perda", title: "Perda", short: "Mede o erro.", explanation: [], rule: "Menor é melhor.", glossary: ["nada"], source: "oiaa" as const }];
    expect(validateContent(base({ theory }), semContagem)).toContainEqual(
      expect.stringContaining("nada"),
    );
  });

  it("confere a contagem de parâmetros do modelo contra a spec", () => {
    const errs = validateContent(base());
    expect(errs).toContainEqual(expect.stringMatching(/tabnet.*16.*1/));
  });

  it("não cobra contagem de modelos que ainda não existem", () => {
    expect(validateContent(base({ models: [], params: [] }))).toEqual([]);
  });
});

describe("listComplements", () => {
  it("lista itens e campos de complemento", () => {
    const p = param({ complement: { ifRaise: "mais capacidade" } });
    const m = model({ source: "complemento" });
    const out = listComplements(base({ models: [m], params: [p] }));
    expect(out).toEqual(
      expect.arrayContaining([
        expect.stringContaining("tabnet"),
        expect.stringContaining("tabnet-n-steps"),
      ]),
    );
  });

  it("devolve vazio quando tudo é do material", () => {
    expect(listComplements(base())).toEqual([]);
  });
});

describe("conteúdo real", () => {
  it("passa em todas as regras", () => {
    expect(validateContent(content)).toEqual([]);
  });
});
