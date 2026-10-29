import MiniSearch from "minisearch";
import type { Content } from "../content/schema.ts";
import type { SearchDoc } from "./search-types.ts";

export type { DocType, SearchDoc } from "./search-types.ts";
export { TYPE_LABELS } from "./search-types.ts";

export function buildDocs(c: Content): SearchDoc[] {
  const modelName = new Map(c.models.map((m) => [m.slug, m.name]));
  return [
    ...c.models.map((m): SearchDoc => ({
      id: `modelo:${m.slug}`,
      type: "modelo",
      title: m.name,
      subtitle: m.profile,
      text: [m.summary, m.chooseIf, m.expect, m.pitfall].join(" "),
      href: `/modelos/${m.slug}`,
    })),
    ...c.params.map((p): SearchDoc => ({
      id: `parametro:${p.id}`,
      type: "parametro",
      title: p.name,
      subtitle: modelName.get(p.modelSlug),
      text: [p.what, p.suggested, p.default, p.range].filter(Boolean).join(" "),
      href: `/modelos/${p.modelSlug}#${p.id}`,
    })),
    ...c.symptoms.map((s): SearchDoc => ({
      id: `sintoma:${s.slug}`,
      type: "sintoma",
      title: s.title,
      text: [...s.likelyCauses, s.fix].join(" "),
      href: `/diagnostico/${s.slug}`,
    })),
    ...c.theory.map((t): SearchDoc => ({
      id: `teoria:${t.slug}`,
      type: "teoria",
      title: t.title,
      text: [t.short, t.rule].join(" "),
      href: `/teoria/${t.slug}`,
    })),
    ...c.glossary.map((g): SearchDoc => ({
      id: `termo:${g.id}`,
      type: "termo",
      title: g.term,
      text: g.definition,
      href: `/glossario#${g.id}`,
    })),
  ];
}

const strip = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

const STOPWORDS = new Set(["a", "o", "e", "de", "do", "da", "um", "uma", "que", "para", "com", "no", "na", "em", "os", "as", "como"]);

// Termos que o aluno usa com o mesmo sentido (já sem acento). Vale na indexação e na consulta.
const SYNONYM_GROUPS = [
  ["tokenizador", "tradutor", "tokenizer"],
  ["regua", "scaler", "padronizacao", "normalizacao"],
  ["batch", "lote"],
  ["lower", "lowercase", "minuscula", "minusculas"],
  ["gpu", "cuda"],
  ["overfitting", "sobreajuste", "decorar", "decoreba"],
  ["underfitting", "subajuste"],
  ["epoch", "epoca", "epocas"],
];

const SYNONYMS = new Map<string, string[]>(
  SYNONYM_GROUPS.flatMap((g) => g.map((t): [string, string[]] => [t, g.filter((x) => x !== t)])),
);

function processTerm(term: string): string | string[] | null {
  const t = strip(term.toLowerCase());
  if (STOPWORDS.has(t)) return null;
  const syn = SYNONYMS.get(t);
  return syn ? [t, ...syn] : t;
}

export function createSearch(docs: SearchDoc[]) {
  const engine = new MiniSearch<SearchDoc>({
    fields: ["title", "subtitle", "text"],
    storeFields: [],
    processTerm,
    searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, subtitle: 1.5 } },
  });
  engine.addAll(docs);
  const byId = new Map(docs.map((d) => [d.id, d]));
  return (query: string): SearchDoc[] =>
    engine.search(query).map((r) => byId.get(r.id as string)!);
}

/** Agrupa por tipo, na ordem em que cada tipo aparece no ranking, limitando cada grupo para nenhum tipo esconder os outros. */
export function groupResults(results: SearchDoc[], perType = 4) {
  const types = [...new Set(results.map((d) => d.type))];
  return types.map((type) => ({
    type,
    docs: results.filter((d) => d.type === type).slice(0, perType),
  }));
}
