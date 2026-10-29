import type { Param } from "../schema.ts";
import { make } from "./make.ts";

const densa = make("rede-densa");
const emb = make("rede-densa-embeddings");
const tab = make("tabnet");

export const tabularParams: Param[] = [
  // ───── Rede densa (10) ─────
  densa("camadas", {
    name: "camadas ocultas",
    suggested: "2",
    range: "1 a 3",
    what: "Quantas camadas de neurônios ficam entre a entrada e a saída. Acima de 3 o ganho é pequeno e o risco de decorar cresce.",
    complement: {
      ifRaise: "Mais capacidade, mas também mais chance de decorar o treino e mais tempo de treino.",
      ifLower: "Modelo mais simples; se as duas curvas ficarem paradas no alto, é sinal de subajuste.",
    },
  }),
  densa("largura", {
    name: "largura das camadas",
    suggested: "256 e 128",
    range: "64 a 512",
    adjust: true,
    what: "Quantos neurônios há em cada camada. Mais largo aprende padrões mais finos e decora mais fácil.",
    complement: {
      ifRaise: "Aprende detalhes mais finos; a distância entre treino e validação tende a crescer.",
      ifLower: "Mais difícil de decorar; se ficar simples demais, não aprende o suficiente.",
    },
  }),
  densa("ativacao", {
    glossary: ["funcao-de-ativacao"],
    name: "ativação",
    suggested: "ReLU",
    what: "A conta que decide o que sai de cada neurônio. É ela que faz empilhar camadas valer a pena: sem ativação, várias camadas viram uma só.",
    complement: {
      commonMistake: "Usar ativação linear nas camadas escondidas. A rede continua rodando, mas se comporta como uma reta.",
    },
  }),
  densa("dropout", {
    glossary: ["dropout", "sobreajuste"],
    name: "dropout",
    default: "0.0",
    suggested: "0.3",
    range: "0 a 0,5",
    adjust: true,
    what: "Desliga neurônios ao acaso durante o treino. É o principal freio ao sobreajuste desta rede. Comecem em 0,3.",
    complement: {
      ifRaise: "Mais freio ao sobreajuste; passando de 0,5 a rede passa a aprender de menos.",
      ifLower: "Menos freio: se a validação sobe enquanto o treino cai, aumente o dropout.",
      commonMistake: "Esquecer de desligar o dropout na avaliação (modelo.eval()): a métrica muda a cada execução.",
    },
  }),
  densa("otimizador", {
    glossary: ["otimizador"],
    name: "otimizador",
    suggested: "AdamW",
    what: "A regra que decide como os pesos mudam a cada passo. O AdamW guarda memória dos passos anteriores: acelera onde a descida é consistente.",
  }),
  densa("taxa", {
    glossary: ["taxa-de-aprendizado"],
    name: "taxa de aprendizado",
    suggested: "1e-3",
    adjust: true,
    what: "O tamanho do passo do ajuste. Uma rede treinada do zero aceita um passo mil vezes maior que um modelo pré-treinado.",
    complement: {
      ifRaise: "Aprende mais rápido, mas a curva de perda pode serrilhar ou subir.",
      ifLower: "Mais estável, porém exige mais épocas para chegar ao fundo.",
      commonMistake: "Copiar a taxa de um modelo pré-treinado (1e-4 ou menor): esta rede começa do zero e fica lenta demais.",
    },
  }),
  densa("decaimento", {
    glossary: ["sobreajuste", "peso"],
    name: "decaimento de peso",
    default: "0.0",
    suggested: "1e-4",
    what: "Puxa os pesos levemente para zero a cada passo. É outro freio ao sobreajuste.",
    complement: {
      ifRaise: "Freia mais o sobreajuste; muito alto deixa a rede simples demais.",
    },
  }),
  densa("lote", {
    glossary: ["lote"],
    name: "tamanho do lote",
    suggested: "512",
    what: "Quantos exemplos o modelo vê antes de ajustar os pesos uma vez. Tabela é leve: cabe lote grande, e o treino fica rápido.",
    complement: {
      ifRaise: "Treino mais rápido, com ajustes em saltos maiores.",
      ifLower: "Mais passos por época e curva mais irregular.",
    },
  }),
  densa("epocas", {
    glossary: ["epoca", "parada-antecipada"],
    name: "épocas",
    suggested: "até 30",
    what: "Quantas vezes o modelo percorre o treino inteiro. Com parada antecipada por F1-macro, raramente precisa das 30.",
    complement: {
      commonMistake: "Rodar as 30 sem parada antecipada: o modelo passa do melhor ponto e começa a decorar.",
    },
  }),
  densa("padronizacao", {
    glossary: ["normalizacao", "vazamento"],
    name: "padronização",
    suggested: "obrigatória",
    what: "Colocar as colunas numéricas na mesma escala. Sem a régua nas colunas numéricas, este modelo trava: é a única das três que não perdoa isso.",
    complement: {
      commonMistake: "Ajustar a régua com a tabela inteira. Isso é vazamento: ajuste só no treino, depois da separação.",
    },
  }),

  // ───── Rede densa com embeddings (10) ─────
  emb("cardinalidades", {
    glossary: ["embedding"],
    name: "cardinalidades",
    suggested: "obrigatório",
    what: "Uma lista com quantos valores diferentes cada coluna de categoria tem. Sem isso, o modelo não roda.",
    complement: {
      commonMistake: "Contar errado (ou só no treino). O número certo vem do Bloco 1; se estiver errado, quebra na hora de prever.",
    },
  }),
  emb("dim-embedding", {
    glossary: ["embedding"],
    name: "tamanho do embedding (dim_embedding)",
    suggested: "8",
    range: "2 a 16",
    adjust: true,
    what: "Quantos números o modelo aprende para representar cada categoria. Pequeno já resolve.",
    complement: {
      ifRaise: "Representa a categoria com mais detalhe, mas cada embedding passa a decorar mais fácil.",
      ifLower: "Representação mais enxuta; para categorias com poucos valores, 2 a 4 costuma bastar.",
    },
  }),
  emb("camadas", {
    name: "camadas ocultas",
    suggested: "2",
    what: "Igual à rede densa.",
  }),
  emb("largura", {
    name: "largura das camadas",
    suggested: "256 e 128",
    range: "64 a 512",
    adjust: true,
    what: "Igual à rede densa.",
  }),
  emb("dropout", {
    glossary: ["dropout", "sobreajuste"],
    name: "dropout",
    default: "0.0",
    suggested: "0.3",
    range: "0 a 0,5",
    adjust: true,
    what: "Igual à rede densa.",
  }),
  emb("otimizador", {
    glossary: ["otimizador"],
    name: "otimizador",
    suggested: "AdamW",
    what: "Igual à rede densa.",
  }),
  emb("taxa", {
    glossary: ["taxa-de-aprendizado"],
    name: "taxa de aprendizado",
    suggested: "1e-3",
    what: "Igual à rede densa.",
  }),
  emb("decaimento", {
    glossary: ["sobreajuste", "peso"],
    name: "decaimento de peso",
    default: "0.0",
    suggested: "1e-4",
    what: "Igual à rede densa.",
  }),
  emb("lote", {
    glossary: ["lote"],
    name: "tamanho do lote",
    suggested: "512",
    what: "Igual à rede densa.",
  }),
  emb("padronizacao", {
    glossary: ["embedding", "normalizacao"],
    name: "padronização",
    suggested: "só nas numéricas",
    what: "As colunas de categoria já entram como índices e viram embeddings; a régua vale apenas para as numéricas.",
    complement: {
      commonMistake: "Padronizar também os índices das categorias: o número de uma categoria não tem ordem nem escala.",
    },
  }),

  // ───── TabNet (16) ─────
  tab("n-d-n-a", {
    name: "n_d / n_a",
    default: "8 / 8",
    suggested: "16 / 16",
    range: "8 a 64",
    adjust: true,
    what: "Largura da decisão (n_d) e da atenção (n_a). A documentação pede que sejam iguais.",
    complement: {
      ifRaise: "Mais capacidade e mais tempo de treino.",
      commonMistake: "Usar valores diferentes para n_d e n_a. Mantenha os dois iguais.",
    },
  }),
  tab("n-steps", {
    name: "n_steps",
    default: "3",
    suggested: "4",
    range: "3 a 10",
    adjust: true,
    what: "Quantos passos de decisão o modelo dá. Mais passos, mais capacidade e mais tempo de treino.",
    complement: {
      ifRaise: "Mais capacidade para padrões complexos; mais risco de decorar e treino mais lento.",
      ifLower: "Modelo mais rápido e mais simples.",
    },
  }),
  tab("gamma", {
    name: "gamma",
    default: "1.3",
    suggested: "1.5",
    range: "1.0 a 2.0",
    what: "O quanto uma variável pode ser reaproveitada entre os passos.",
    complement: {
      ifRaise: "Cada coluna tende a ser usada em menos passos; o modelo fica mais seletivo.",
      ifLower: "A mesma coluna pode aparecer em vários passos.",
    },
  }),
  tab("lambda-sparse", {
    name: "lambda_sparse",
    default: "1e-3",
    suggested: "1e-3",
    what: "Força o modelo a olhar poucas colunas por passo. Quanto maior, mais seletivo.",
    complement: {
      ifRaise: "Olha menos colunas e fica mais fácil de explicar; se subir demais, perde sinal útil.",
    },
  }),
  tab("mask-type", {
    name: "mask_type",
    default: "sparsemax",
    suggested: "entmax",
    what: "Como a atenção escolhe as colunas. O entmax costuma ser mais estável.",
  }),
  tab("cat-idxs", {
    name: "cat_idxs",
    default: "[]",
    suggested: "obrigatório",
    what: "A posição de cada coluna de categoria na tabela. Sem cat_idxs e cat_dims, os embeddings não são criados.",
    complement: {
      commonMistake: "Deixar a lista vazia. O modelo roda, mas trata as categorias como números comuns.",
    },
  }),
  tab("cat-dims", {
    name: "cat_dims",
    default: "[]",
    suggested: "obrigatório",
    what: "Quantos valores diferentes cada coluna de categoria tem. Sem cat_idxs e cat_dims, os embeddings não são criados.",
    complement: {
      commonMistake: "Contar na ordem errada: a lista precisa seguir a mesma ordem de cat_idxs.",
    },
  }),
  tab("cat-emb-dim", {
    glossary: ["embedding"],
    name: "cat_emb_dim",
    default: "1",
    suggested: "2",
    what: "Tamanho do embedding de cada categoria.",
  }),
  tab("taxa", {
    glossary: ["taxa-de-aprendizado"],
    name: "taxa de aprendizado",
    default: "2e-2",
    suggested: "2e-2",
    adjust: true,
    what: "A mais alta das três opções: este modelo foi feito para começar rápido e ir freando.",
    complement: {
      ifRaise: "Pode divergir; a curva sobe em vez de descer.",
      ifLower: "Mais estável, mas combina melhor com um agendador e mais épocas.",
    },
  }),
  tab("agendador", {
    glossary: ["agendador-da-taxa"],
    name: "agendador",
    default: "nenhum",
    suggested: "StepLR",
    what: "Diminui a taxa de aprendizado em 10% a cada 10 épocas.",
  }),
  tab("max-epochs", {
    glossary: ["epoca", "parada-antecipada"],
    name: "max_epochs",
    suggested: "100",
    what: "Máximo de épocas, usado junto com a parada antecipada.",
  }),
  tab("patience", {
    glossary: ["parada-antecipada"],
    name: "patience",
    suggested: "15",
    what: "Quantas épocas sem melhorar a validação antes de parar o treino.",
    complement: {
      ifRaise: "Dá mais chance de recuperar, mas gasta mais tempo.",
      ifLower: "Para antes; pode interromper um treino que ainda ia melhorar.",
    },
  }),
  tab("batch-size", {
    glossary: ["lote"],
    name: "batch_size",
    suggested: "1024",
    what: "O lote de verdade: quantos exemplos entram por ajuste.",
  }),
  tab("virtual-batch-size", {
    name: "virtual_batch_size",
    suggested: "128",
    what: "O lote interno usado na normalização. Precisa dividir o batch_size exatamente, senão dá erro.",
    complement: {
      commonMistake: "Mudar o batch_size e esquecer este valor. Com batch_size 1024, 128 serve (1024 ÷ 128 = 8); com 1000, não.",
    },
  }),
  tab("weights", {
    name: "weights",
    default: "0",
    suggested: "1",
    what: "Compensa classes desbalanceadas na amostragem.",
  }),
  tab("metrica-parada", {
    glossary: ["f1-macro", "parada-antecipada"],
    name: "métrica de parada",
    default: "acurácia",
    suggested: "F1-macro",
    what: "A métrica que a parada antecipada vigia. Precisa ser registrada à mão: não vem pronta na biblioteca.",
    complement: {
      commonMistake: "Deixar a acurácia, que premia o chute preguiçoso em problemas desbalanceados. O ranking usa F1-macro.",
    },
  }),
];
