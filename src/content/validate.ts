import { EXPECTED_PARAM_COUNTS } from "./schema.ts";
import type { Content } from "./schema.ts";

const SOURCES = ["oiaa", "complemento"];

function duplicates(keys: string[]): string[] {
  return keys.filter((k, i) => keys.indexOf(k) !== i);
}

/** Devolve a lista de erros de integridade; vazia quando o conteúdo está íntegro. */
export function validateContent(
  c: Content,
  { checkCounts = true }: { checkCounts?: boolean } = {},
): string[] {
  const errors: string[] = [];

  const collections: [string, { source: unknown }[], string[]][] = [
    ["modelo", c.models, c.models.map((m) => m.slug)],
    ["parâmetro", c.params, c.params.map((p) => p.id)],
    ["sintoma", c.symptoms, c.symptoms.map((s) => s.slug)],
    ["teoria", c.theory, c.theory.map((t) => t.slug)],
    ["glossário", c.glossary, c.glossary.map((g) => g.id)],
  ];
  for (const [kind, items, keys] of collections) {
    items.forEach((item, i) => {
      if (!SOURCES.includes(item.source as string)) {
        errors.push(`${kind} "${keys[i]}": source ausente ou inválido`);
      }
    });
    for (const k of new Set(duplicates(keys))) errors.push(`${kind} "${k}" duplicado`);
  }

  const modelSlugs = new Set(c.models.map((m) => m.slug));
  const paramIds = new Set(c.params.map((p) => p.id));
  const theorySlugs = new Set(c.theory.map((t) => t.slug));
  const glossaryIds = new Set(c.glossary.map((g) => g.id));

  const need = (set: Set<string>, id: string, from: string) => {
    if (!set.has(id)) errors.push(`${from}: referência a "${id}" não existe`);
  };

  for (const m of c.models) {
    for (const id of m.params) need(paramIds, id, `modelo "${m.slug}"`);
  }

  for (const p of c.params) {
    need(modelSlugs, p.modelSlug, `parâmetro "${p.id}"`);
    const owner = c.models.find((m) => m.slug === p.modelSlug);
    if (owner && !owner.params.includes(p.id)) {
      errors.push(`parâmetro "${p.id}" não está listado em params do modelo "${owner.slug}"`);
    }
    for (const g of p.glossary ?? []) need(glossaryIds, g, `parâmetro "${p.id}"`);
  }

  for (const s of c.symptoms) {
    const from = `sintoma "${s.slug}"`;
    for (const x of s.related.models ?? []) need(modelSlugs, x, from);
    for (const x of s.related.params ?? []) need(paramIds, x, from);
    for (const x of s.related.theory ?? []) need(theorySlugs, x, from);
  }

  for (const t of c.theory) {
    for (const g of t.glossary ?? []) need(glossaryIds, g, `teoria "${t.slug}"`);
  }

  if (checkCounts) {
    for (const m of c.models) {
      const expected = EXPECTED_PARAM_COUNTS[m.slug];
      if (expected === undefined) continue;
      const actual = c.params.filter((p) => p.modelSlug === m.slug).length;
      if (actual !== expected) {
        errors.push(`modelo "${m.slug}": esperado ${expected} parâmetros, encontrado ${actual}`);
      }
    }
  }

  return errors;
}

/** Itens e campos de autoria própria, para o professor revisar. */
export function listComplements(c: Content): string[] {
  const out: string[] = [];
  for (const m of c.models) if (m.source === "complemento") out.push(`modelo ${m.slug}`);
  for (const p of c.params) {
    if (p.source === "complemento") out.push(`parâmetro ${p.id}`);
    for (const f of Object.keys(p.complement ?? {})) out.push(`parâmetro ${p.id} · ${f}`);
  }
  for (const s of c.symptoms) if (s.source === "complemento") out.push(`sintoma ${s.slug}`);
  for (const t of c.theory) if (t.source === "complemento") out.push(`teoria ${t.slug}`);
  for (const g of c.glossary) if (g.source === "complemento") out.push(`glossário ${g.id}`);
  return out;
}
