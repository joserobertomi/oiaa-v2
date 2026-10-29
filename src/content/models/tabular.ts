import type { Model } from "../schema.ts";
import { tabularParams } from "../params/tabular.ts";

const paramsOf = (slug: string) =>
  tabularParams.filter((p) => p.modelSlug === slug).map((p) => p.id);

export const tabularModels: Model[] = [
  {
    slug: "rede-densa",
    track: "tabular",
    name: "Rede densa",
    profile: "entrada",
    summary: "Camadas de neurônios empilhadas, sem nenhuma ideia além disso.",
    chooseIf: "Você quer começar rápido e entender cada linha do modelo. Treina em minutos.",
    expect: "Rápida, simples e mais competitiva do que parece. Não explica nada sobre as decisões.",
    pitfall:
      "Sem a régua (padronização) nas colunas numéricas, o modelo trava. É a única das três que não perdoa isso.",
    ready: "O otimizador, a parada antecipada e o laço de treino.",
    params: paramsOf("rede-densa"),
    source: "oiaa",
  },
  {
    slug: "rede-densa-embeddings",
    track: "tabular",
    name: "Rede densa com embeddings",
    profile: "intermediária",
    summary: "A mesma rede, mas cada categoria vira um punhado de números que o treino ajusta.",
    chooseIf: "A tabela tem colunas de categoria com muitos valores diferentes, como gênero musical.",
    expect: "Costuma ganhar da rede densa quando há categorias grandes. Mesmo código, mesma velocidade.",
    pitfall:
      "Ela precisa saber quantos valores diferentes cada coluna de categoria tem (número que sai do Bloco 1). Se estiver errado, quebra na hora de prever.",
    ready: "Tudo o que vem na rede densa, mais a construção dos embeddings.",
    params: paramsOf("rede-densa-embeddings"),
    source: "oiaa",
  },
  {
    slug: "tabnet",
    track: "tabular",
    name: "TabNet",
    profile: "avançada",
    summary: "Decide em vários passos e, em cada um, escolhe quais colunas vai olhar.",
    chooseIf: "O relatório vai se apoiar em explicar por que o modelo decidiu.",
    expect: "É o único que mostra quais colunas usou em cada previsão. Tem mais botões para ajustar.",
    pitfall:
      "O tamanho do lote virtual (virtual_batch_size) precisa dividir exatamente o batch_size. Se não dividir, dá erro na hora de rodar.",
    ready: "A normalização de entrada e o laço de treino, parecido com o da Fase 1.",
    params: paramsOf("tabnet"),
    source: "oiaa",
  },
];
