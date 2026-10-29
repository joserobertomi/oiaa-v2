import type { Content } from "./schema.ts";
import { tabularModels } from "./models/tabular.ts";
import { tabularParams } from "./params/tabular.ts";
import { visaoModels } from "./models/visao.ts";
import { visaoParams } from "./params/visao.ts";
import { textoModels } from "./models/texto.ts";
import { textoParams } from "./params/texto.ts";
import { glossary } from "./glossary.ts";
import { symptoms } from "./symptoms.ts";
import { theory } from "./theory.ts";

export const content: Content = {
  models: [...tabularModels, ...visaoModels, ...textoModels],
  params: [...tabularParams, ...visaoParams, ...textoParams],
  symptoms,
  theory,
  glossary,
};

export const TRACKS = {
  tabular: "Tabelas",
  visao: "Imagens",
  texto: "Texto",
} as const;
