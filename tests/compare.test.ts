import { describe, expect, it } from "vitest";
import { COMPARE } from "../src/content/compare.ts";
import { content } from "../src/content/index.ts";
import type { Track } from "../src/content/schema.ts";

const tracks = Object.keys(COMPARE) as Track[];

describe.each(tracks)("comparador · %s", (track) => {
  const models = content.models.filter((m) => m.track === track);
  const compare = COMPARE[track];

  it("compara 3 modelos", () => {
    expect(models).toHaveLength(3);
  });

  it("cada pergunta de decisão leva a um modelo da trilha", () => {
    for (const { model } of compare.howToChoose) {
      expect(models.map((m) => m.slug)).toContain(model);
    }
    expect(compare.howToChoose.map((h) => h.model).sort()).toEqual(models.map((m) => m.slug).sort());
  });

  it("cada linha aponta, para cada modelo, um parâmetro que existe e pertence a ele", () => {
    for (const row of compare.rows) {
      for (const m of models) {
        const id = row.params[m.slug];
        const param = content.params.find((p) => p.id === id);
        expect(param, `${row.label} · ${m.slug}`).toBeDefined();
        expect(param?.modelSlug).toBe(m.slug);
      }
    }
  });
});
