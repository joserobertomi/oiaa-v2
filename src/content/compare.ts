import type { Track } from "./schema.ts";

export interface CompareRow {
  label: string;
  /** id do parâmetro que responde a esta linha, por slug de modelo */
  params: Record<string, string>;
}

export interface TrackCompare {
  /** perguntas curtas que levam a cada modelo */
  howToChoose: { question: string; model: string }[];
  rows: CompareRow[];
}

const same = (suffix: string, slugs: string[]): Record<string, string> =>
  Object.fromEntries(slugs.map((s) => [s, `${s}-${suffix}`]));

const TABULAR = ["rede-densa", "rede-densa-embeddings", "tabnet"];
const VISAO = ["efficientnet-b0", "resnet-50", "vit-b16"];
const TEXTO = ["distilbert-multilingual", "bertimbau", "xlm-roberta"];

export const COMPARE: Record<Track, TrackCompare> = {
  tabular: {
    howToChoose: [
      { question: "Quer começar rápido e entender cada linha do modelo?", model: "rede-densa" },
      { question: "A tabela tem colunas de categoria com muitos valores diferentes?", model: "rede-densa-embeddings" },
      { question: "O relatório vai se apoiar em explicar por que o modelo decidiu?", model: "tabnet" },
    ],
    rows: [
      { label: "Taxa de aprendizado", params: same("taxa", TABULAR) },
      {
        label: "Tamanho do lote",
        params: {
          "rede-densa": "rede-densa-lote",
          "rede-densa-embeddings": "rede-densa-embeddings-lote",
          tabnet: "tabnet-batch-size",
        },
      },
    ],
  },
  visao: {
    howToChoose: [
      { question: "Quer rodar muitos experimentos no mesmo tempo (a mais barata)?", model: "efficientnet-b0" },
      { question: "Quer previsibilidade e tempo sobrando para interpretar em vez de depurar?", model: "resnet-50" },
      { question: "Quer testar uma ideia diferente e tem orçamento de GPU?", model: "vit-b16" },
    ],
    rows: [
      { label: "Pesos", params: same("pesos", VISAO) },
      { label: "Camada de saída", params: same("camada-saida", VISAO) },
      { label: "Taxa do estágio 2", params: same("estagio2-taxa", VISAO) },
      { label: "Tamanho do lote", params: same("lote", VISAO) },
      { label: "Tamanho do modelo", params: same("tamanho", VISAO) },
    ],
  },
  texto: {
    howToChoose: [
      { question: "Quer espaço para testar várias configurações em vez de esperar treino?", model: "distilbert-multilingual" },
      { question: "Quer o melhor resultado pelo menor risco?", model: "bertimbau" },
      { question: "Quer testar se muito mais treino compensa não ser especialista?", model: "xlm-roberta" },
    ],
    rows: [
      { label: "Identificador", params: same("identificador", TEXTO) },
      { label: "Arquitetura", params: same("arquitetura", TEXTO) },
      { label: "Taxa de aprendizado", params: same("taxa", TEXTO) },
      { label: "Tamanho do lote", params: same("lote", TEXTO) },
      { label: "Épocas", params: same("epocas", TEXTO) },
    ],
  },
};
