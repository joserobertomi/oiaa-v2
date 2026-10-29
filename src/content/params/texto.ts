import type { Param } from "../schema.ts";
import { make } from "./make.ts";

const dis = make("distilbert-multilingual");
const ber = make("bertimbau");
const xlm = make("xlm-roberta");

export const textoParams: Param[] = [
  // ───── DistilBERT multilíngue (12) ─────
  dis("identificador", {
    name: "identificador",
    suggested: "distilbert-base-multilingual-cased",
    glossary: ["pedaco-de-palavra"],
    what: "O nome que carrega o modelo. O tokenizador (o \"tradutor\" do material) sai deste mesmo nome.",
    complement: {
      commonMistake: "Trocar o nome do modelo e esquecer o do tokenizador: roda e o resultado despenca, sem erro.",
    },
  }),
  dis("arquitetura", {
    name: "arquitetura",
    suggested: "6 camadas · 768",
    what: "Metade das camadas de um BERT. Cerca de 134 milhões de pesos.",
  }),
  dis("taxa", {
    name: "taxa de aprendizado",
    suggested: "3e-5 a 5e-5",
    adjust: true,
    glossary: ["taxa-de-aprendizado"],
    what: "Tolera um passo um pouco maior que os outros dois desta trilha.",
    complement: {
      ifRaise: "Acima de 5e-5 o ajuste fino fica instável e a validação pode despencar.",
      ifLower: "Mais estável, mas pode não chegar ao melhor ponto em 3 épocas.",
    },
  }),
  dis("lote", {
    name: "tamanho do lote",
    suggested: "32 ou 64",
    adjust: true,
    glossary: ["lote"],
    what: "O mais leve dos três: cabe lote maior.",
  }),
  dis("epocas", {
    name: "épocas",
    suggested: "3 a 4",
    adjust: true,
    glossary: ["epoca"],
    what: "Acima disso começa a decorar.",
    complement: {
      ifRaise: "A validação costuma atingir o melhor ponto na 2ª ou 3ª época; depois só piora.",
    },
  }),
  dis("otimizador", {
    name: "otimizador",
    suggested: "AdamW",
    glossary: ["otimizador"],
    what: "Padrão da trilha.",
  }),
  dis("decaimento", {
    name: "decaimento de peso",
    suggested: "0.01",
    glossary: ["sobreajuste"],
    what: "Padrão da trilha.",
  }),
  dis("aquecimento", {
    name: "aquecimento",
    default: "0",
    suggested: "10% dos passos",
    what: "Começa com passos minúsculos para o modelo não se perder no início.",
  }),
  dis("max-length", {
    name: "max_length",
    suggested: "128",
    glossary: ["pedaco-de-palavra"],
    what: "Quantos pedaços de palavra o modelo lê por texto; o resto é cortado. 128 cobre a maioria das avaliações. O teto da arquitetura é 512.",
    complement: {
      ifRaise: "Perde menos texto, mas treina mais devagar e usa mais memória.",
      ifLower: "Mais rápido, porém corta o final de avaliações longas.",
    },
  }),
  dis("preenchimento", {
    name: "preenchimento",
    default: "fixo",
    suggested: "dinâmico por lote",
    what: "Preencher só até o maior texto de cada lote economiza bastante tempo.",
  }),
  dis("precisao-mista", {
    name: "precisão mista",
    default: "desligada",
    suggested: "ligada",
    what: "Padrão da trilha: números menores na conta, mais rápido e mais leve.",
  }),
  dis("limpeza", {
    name: "limpeza do texto",
    suggested: "nenhuma",
    glossary: ["pedaco-de-palavra"],
    what: "Sem tirar acento, pontuação ou palavra comum. O tokenizador cuida disso.",
    complement: {
      commonMistake: "Aplicar a limpeza da Fase 1 (minúsculas, sem acento, sem stopwords): destrói informação que o modelo usa.",
    },
  }),

  // ───── BERTimbau (12) ─────
  ber("identificador", {
    name: "identificador",
    suggested: "neuralmind/bert-base-portuguese-cased",
    glossary: ["pedaco-de-palavra"],
    what: "O sufixo cased avisa que ele usa maiúsculas e acentos. O tokenizador (o \"tradutor\" do material) sai deste mesmo nome.",
    complement: {
      commonMistake: "Carregar o tokenizador do DistilBERT com os pesos do BERTimbau: roda e o resultado despenca, sem erro.",
    },
  }),
  ber("arquitetura", {
    name: "arquitetura",
    suggested: "12 camadas · 768",
    what: "Cerca de 110 milhões de pesos.",
  }),
  ber("taxa", {
    name: "taxa de aprendizado",
    suggested: "2e-5",
    adjust: true,
    glossary: ["taxa-de-aprendizado"],
    what: "Faixa estreita. Quase todo trabalho da área usa entre 1e-5 e 5e-5.",
    complement: {
      ifRaise: "Passo grande demais apaga o português que o modelo já sabe.",
      ifLower: "Mais seguro, mas o ajuste pode ficar curto em 3 épocas. Mexa pouco.",
    },
  }),
  ber("lote", {
    name: "tamanho do lote",
    suggested: "32",
    adjust: true,
    glossary: ["lote"],
    what: "Padrão da trilha.",
  }),
  ber("epocas", {
    name: "épocas",
    suggested: "3",
    adjust: true,
    glossary: ["epoca"],
    what: "Padrão para o ajuste fino de BERT.",
  }),
  ber("otimizador", {
    name: "otimizador",
    suggested: "AdamW com eps 1e-8",
    glossary: ["otimizador"],
    what: "Padrão da trilha.",
  }),
  ber("decaimento", {
    name: "decaimento de peso",
    suggested: "0.01",
    glossary: ["sobreajuste"],
    what: "Padrão da trilha.",
  }),
  ber("aquecimento", {
    name: "aquecimento",
    default: "0",
    suggested: "10% dos passos",
    what: "Padrão da trilha.",
  }),
  ber("dropout", {
    name: "dropout",
    default: "0.1",
    suggested: "0.1",
    glossary: ["dropout"],
    what: "Não alterar: é o valor com que o modelo foi pré-treinado.",
  }),
  ber("do-lower-case", {
    name: "do_lower_case",
    suggested: "False",
    what: "Obrigatório. Passar o texto para minúsculas destrói informação que o modelo usa.",
    complement: {
      commonMistake: "Deixar `True` ou aplicar `.lower()` no texto antes de tokenizar, como se fazia na Fase 1.",
    },
  }),
  ber("max-length", {
    name: "max_length",
    suggested: "128",
    glossary: ["pedaco-de-palavra"],
    what: "Padrão da trilha.",
    complement: {
      ifRaise: "Perde menos texto, mas treina mais devagar e usa mais memória.",
      ifLower: "Mais rápido, porém corta o final de avaliações longas.",
    },
  }),
  ber("semente", {
    name: "semente",
    suggested: "fixa",
    what: "O ajuste fino de BERT varia entre execuções. A semente precisa ser a mesma para todas as equipes.",
    complement: {
      commonMistake: "Comparar duas execuções com sementes diferentes e achar que uma configuração é melhor que a outra.",
    },
  }),

  // ───── XLM-RoBERTa (12) ─────
  xlm("identificador", {
    name: "identificador",
    suggested: "xlm-roberta-base",
    glossary: ["pedaco-de-palavra"],
    what: "O tokenizador (o \"tradutor\" do material) sai deste mesmo nome.",
    complement: {
      commonMistake: "Trocar o nome do modelo e esquecer o do tokenizador: roda e o resultado despenca, sem erro.",
    },
  }),
  xlm("arquitetura", {
    name: "arquitetura",
    suggested: "12 camadas · 768",
    what: "Cerca de 270 milhões de pesos, e a maior parte é o vocabulário.",
  }),
  xlm("vocabulario", {
    name: "vocabulário",
    suggested: "250 mil pedaços",
    glossary: ["pedaco-de-palavra"],
    what: "Sozinho responde por cerca de 192 dos 270 milhões de pesos.",
  }),
  xlm("taxa", {
    name: "taxa de aprendizado",
    suggested: "1e-5 a 2e-5",
    adjust: true,
    glossary: ["taxa-de-aprendizado"],
    what: "A menor da trilha: é o modelo que mais diverge.",
    complement: {
      ifRaise: "O treino diverge: a curva sobe e o F1 despenca.",
      ifLower: "Mais estável; é a primeira coisa a tentar se o treino divergir.",
    },
  }),
  xlm("lote", {
    name: "tamanho do lote",
    suggested: "16 ou 32",
    adjust: true,
    glossary: ["lote"],
    what: "Depende da memória disponível.",
  }),
  xlm("epocas", {
    name: "épocas",
    suggested: "3",
    glossary: ["epoca"],
    what: "Padrão da trilha.",
  }),
  xlm("otimizador", {
    name: "otimizador",
    suggested: "AdamW",
    glossary: ["otimizador"],
    what: "Padrão da trilha.",
  }),
  xlm("aquecimento", {
    name: "aquecimento",
    default: "0",
    suggested: "mais longo que 10%",
    adjust: true,
    what: "É o modelo que mais se beneficia de começar devagar.",
    complement: {
      ifLower: "Sem aquecimento longo, o início do treino pode divergir.",
    },
  }),
  xlm("max-length", {
    name: "max_length",
    suggested: "128",
    glossary: ["pedaco-de-palavra"],
    what: "Padrão da trilha.",
  }),
  xlm("precisao-mista", {
    name: "precisão mista",
    default: "desligada",
    suggested: "ligada",
    what: "O mais pesado da trilha: aqui faz diferença real.",
  }),
  xlm("token-inicial", {
    name: "token inicial",
    suggested: "[CLS]",
    what: "Outra convenção. As classes automáticas resolvem isso sozinhas.",
    complement: {
      commonMistake: "Escrever o token inicial à mão. Use as classes automáticas e confira o valor na documentação do modelo.",
    },
  }),
  xlm("estabilidade", {
    name: "estabilidade",
    suggested: "a menor dos três",
    glossary: ["taxa-de-aprendizado"],
    what: "Se o treino divergir, a primeira coisa a fazer é baixar a taxa.",
  }),
];
