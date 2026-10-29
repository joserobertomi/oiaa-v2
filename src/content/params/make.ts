import type { Param } from "../schema.ts";

type Fields = Omit<Param, "id" | "modelSlug" | "source">;

/** Cria o construtor de parâmetros de um modelo: o id vira `<modelo>-<id>`. */
export const make =
  (modelSlug: string) =>
  (id: string, fields: Fields): Param => ({
    id: `${modelSlug}-${id}`,
    modelSlug,
    source: "oiaa",
    ...fields,
  });
