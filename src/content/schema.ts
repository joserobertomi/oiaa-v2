// Imports relativos com extensão: o content:check roda direto no Node, sem alias do Next.

export type Source = "oiaa" | "complemento";
export type Track = "tabular" | "visao" | "texto";

/** `source` descreve a origem do item. Campos em `complement` são sempre do autor. */
export interface Model {
  slug: string;
  track: Track;
  name: string;
  profile: string;
  /** uma frase: o que o modelo é */
  summary: string;
  chooseIf: string;
  expect: string;
  pitfall: string;
  /** o que o caderno já traz pronto */
  ready: string;
  /** ids dos parâmetros, na ordem de exibição */
  params: string[];
  source: Source;
}

export interface Param {
  id: string;
  modelSlug: string;
  name: string;
  default?: string;
  suggested?: string;
  range?: string;
  what: string;
  /** um dos "botões que vocês mexem" na ficha do modelo */
  adjust?: boolean;
  /** ids do glossário citados na explicação */
  glossary?: string[];
  /** "se subir / se baixar / erro comum": quase nunca estão no material */
  complement?: { ifRaise?: string; ifLower?: string; commonMistake?: string };
  source: Source;
}

export type SymptomGroup = "silencioso" | "curvas" | "configuracao" | "metrica";

export interface Symptom {
  slug: string;
  /** como o aluno descreveria o problema */
  title: string;
  group: SymptomGroup;
  /** só nos erros silenciosos: a verificação de uma linha do /checklist */
  check?: string;
  likelyCauses: string[];
  fix: string;
  related: { models?: string[]; params?: string[]; theory?: string[] };
  source: Source;
}

export interface Theory {
  slug: string;
  title: string;
  /** a resposta em 1 ou 2 frases, no topo da página */
  short: string;
  explanation: string[];
  analogy?: string;
  /** resumo do laboratório do material, em uma regra de bolso */
  rule: string;
  commonMistake?: string;
  /** de onde vem no material, ex.: "Capítulo 1 · Laboratório 5" */
  lab?: string;
  glossary?: string[];
  source: Source;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  category: string;
  definition: string;
  source: Source;
}

export interface Content {
  models: Model[];
  params: Param[];
  symptoms: Symptom[];
  theory: Theory[];
  glossary: GlossaryEntry[];
}

/** Parâmetros esperados por modelo, conforme as tabelas do material (docs/). */
export const EXPECTED_PARAM_COUNTS: Record<string, number> = {
  "rede-densa": 10,
  "rede-densa-embeddings": 10,
  tabnet: 16,
  "efficientnet-b0": 12,
  "resnet-50": 14,
  "vit-b16": 12,
  "distilbert-multilingual": 12,
  bertimbau: 12,
  "xlm-roberta": 12,
};
