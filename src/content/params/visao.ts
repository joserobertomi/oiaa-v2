import type { Param } from "../schema.ts";
import { make } from "./make.ts";

const eff = make("efficientnet-b0");
const res = make("resnet-50");
const vit = make("vit-b16");

export const visaoParams: Param[] = [
  // ───── EfficientNet-B0 (12) ─────
  eff("pesos", {
    name: "pesos",
    suggested: "IMAGENET1K_V1",
    glossary: ["transferencia-de-aprendizado"],
    what: "Os pesos pré-treinados que o modelo carrega. Esta versão acerta 77,7% no ImageNet, com um quinto dos pesos da ResNet.",
  }),
  eff("preparacao", {
    name: "preparação da imagem",
    suggested: "PESOS.transforms()",
    what: "A preparação que vem junto com os pesos. Usa interpolação bicúbica, diferente dos outros dois modelos.",
    complement: {
      commonMistake: "Copiar o preparo da ResNet ou escrever os números à mão. O código roda, mas o modelo recebe a imagem diferente da que foi treinado a ver.",
    },
  }),
  eff("camada-saida", {
    name: "camada de saída",
    suggested: "model.classifier[1]",
    glossary: ["classificacao"],
    what: "Trocada por Linear(1280, nº de classes). Não se chama fc.",
    complement: {
      commonMistake: "Copiar `modelo.fc = ...` da ResNet. Em vez de trocar a saída, cria um atributo novo que o modelo nunca usa, e a mensagem de erro não ajuda.",
    },
  }),
  eff("estagio1-taxa", {
    name: "estágio 1 · taxa",
    suggested: "1e-3",
    glossary: ["taxa-de-aprendizado", "congelar-camadas"],
    what: "Taxa da sondagem, em que só a última camada treina e o resto fica congelado. Igual à ResNet.",
  }),
  eff("estagio2-taxa", {
    name: "estágio 2 · taxa",
    suggested: "1e-4",
    range: "10 a 15 épocas",
    adjust: true,
    glossary: ["taxa-de-aprendizado"],
    what: "Passo do ajuste fino, em que o último bloco também é liberado. Igual à ResNet. Mais que 15 épocas neste estágio começa a decorar.",
    complement: {
      ifRaise: "Pode estragar o que o modelo já sabia: a validação cai logo nas primeiras épocas do estágio 2.",
      ifLower: "Ajuste mais lento e ganho menor sobre a sondagem do estágio 1.",
    },
  }),
  eff("lote", {
    name: "tamanho do lote",
    suggested: "32",
    adjust: true,
    glossary: ["lote"],
    what: "Quantos exemplos por ajuste. Cabe com folga: é o modelo mais leve da trilha.",
    complement: {
      ifRaise: "Treino mais rápido por época, usando mais memória da GPU.",
      ifLower: "Usa menos memória, com curva mais irregular. Reduza se aparecer erro de falta de memória.",
    },
  }),
  eff("decaimento", {
    name: "decaimento de peso",
    suggested: "1e-4",
    glossary: ["sobreajuste"],
    what: "Padrão da trilha: puxa os pesos levemente para zero a cada passo.",
  }),
  eff("agendador", {
    name: "agendador",
    suggested: "CosineAnnealingLR",
    glossary: ["agendador-da-taxa"],
    what: "Padrão da trilha: a taxa cai suavemente ao longo do treino.",
  }),
  eff("suavizacao", {
    name: "suavização de rótulo",
    default: "0.0",
    suggested: "0.1",
    what: "Padrão da trilha: ensina o modelo a nunca ter 100% de certeza.",
  }),
  eff("precisao-mista", {
    name: "precisão mista",
    default: "desligada",
    suggested: "ligada",
    what: "Padrão da trilha: usa números menores na conta para caber mais na memória e treinar mais rápido.",
  }),
  eff("tamanho", {
    name: "tamanho",
    suggested: "5,3 M de pesos",
    what: "0,39 GFLOPS por imagem: dez vezes mais barato que a ResNet. Importa para o argumento de custo no relatório.",
  }),
  eff("trocar-versao", {
    name: "atenção ao trocar de versão",
    suggested: "B0 → B3 muda a entrada",
    what: "Migrar dentro da família EfficientNet exige trocar a resolução de entrada, não só o nome da classe.",
    complement: {
      commonMistake: "Trocar B0 por B3 mudando só o nome e manter a imagem em 224×224.",
    },
  }),

  // ───── ResNet-50 (14) ─────
  res("pesos", {
    name: "pesos",
    suggested: "IMAGENET1K_V2",
    glossary: ["transferencia-de-aprendizado"],
    what: "A versão V2 acerta 80,9% no ImageNet, contra 76,1% da V1, e redimensiona a imagem de forma diferente.",
    complement: {
      commonMistake: "Misturar pesos V2 com o preparo da V1 (ou o contrário).",
    },
  }),
  res("preparacao", {
    name: "preparação da imagem",
    suggested: "PESOS.transforms()",
    what: "Vem junto com os pesos. Digitar os números à mão é fonte de erro silencioso.",
  }),
  res("camada-saida", {
    name: "camada de saída",
    suggested: "model.fc",
    glossary: ["classificacao"],
    what: "Trocada por Linear(2048, nº de classes). Só neste modelo ela se chama fc.",
    complement: {
      commonMistake: "Usar `fc` na EfficientNet ou no ViT, onde a saída tem outro nome.",
    },
  }),
  res("estagio1-o-que-treina", {
    name: "estágio 1 · o que treina",
    suggested: "só a saída",
    glossary: ["congelar-camadas"],
    what: "Sondagem linear: o resto do modelo fica congelado.",
  }),
  res("estagio1-taxa", {
    name: "estágio 1 · taxa",
    suggested: "1e-3",
    glossary: ["taxa-de-aprendizado"],
    what: "Usa o otimizador Adam por 5 épocas.",
  }),
  res("estagio2-o-que-treina", {
    name: "estágio 2 · o que treina",
    suggested: "último bloco + saída",
    glossary: ["congelar-camadas", "sobreajuste"],
    what: "Descongelar a rede inteira sobreajusta com poucas imagens.",
    complement: {
      commonMistake: "Descongelar tudo para tentar ganhar mais um ponto: com 1.500 imagens o modelo passa a decorar.",
    },
  }),
  res("estagio2-taxa", {
    name: "estágio 2 · taxa",
    suggested: "1e-4",
    range: "10 a 15 épocas",
    adjust: true,
    glossary: ["taxa-de-aprendizado"],
    what: "Usa o otimizador AdamW, de 10 a 15 épocas.",
    complement: {
      ifRaise: "Pode estragar o que o modelo já sabia: a validação cai logo nas primeiras épocas do estágio 2.",
      ifLower: "Ajuste mais lento e ganho menor sobre a sondagem do estágio 1.",
    },
  }),
  res("lote", {
    name: "tamanho do lote",
    suggested: "32",
    adjust: true,
    glossary: ["lote"],
    what: "Cabe folgado numa GPU de 16 GB.",
    complement: {
      ifRaise: "Treino mais rápido por época, usando mais memória da GPU.",
      ifLower: "Usa menos memória, com curva mais irregular.",
    },
  }),
  res("decaimento", {
    name: "decaimento de peso",
    suggested: "1e-4",
    glossary: ["sobreajuste"],
    what: "Padrão da trilha.",
  }),
  res("agendador", {
    name: "agendador",
    suggested: "CosineAnnealingLR",
    glossary: ["agendador-da-taxa"],
    what: "A taxa cai suavemente até quase zero no fim.",
  }),
  res("suavizacao", {
    name: "suavização de rótulo",
    default: "0.0",
    suggested: "0.1",
    what: "Ensina o modelo a nunca ter 100% de certeza.",
  }),
  res("precisao-mista", {
    name: "precisão mista",
    default: "desligada",
    suggested: "ligada",
    what: "Números menores na conta: cabe mais na memória e treina mais rápido.",
  }),
  res("aumento-de-dados", {
    name: "aumento de dados",
    suggested: "recorte + espelho + cor",
    glossary: ["aumento-de-dados"],
    what: "Só no treino. Nunca na validação.",
    complement: {
      commonMistake: "Reaproveitar a mesma preparação do treino para a validação: a validação fica artificialmente difícil e a curva sai abaixo da de treino.",
    },
  }),
  res("tamanho", {
    name: "tamanho",
    suggested: "25,5 M de pesos",
    what: "4,09 GFLOPS por imagem.",
  }),

  // ───── ViT-B/16 (12) ─────
  vit("pesos", {
    name: "pesos",
    suggested: "IMAGENET1K_V1",
    glossary: ["transferencia-de-aprendizado"],
    what: "Acerta 81,1% no ImageNet, o melhor dos três, mas em outra base.",
  }),
  vit("entrada", {
    name: "entrada",
    suggested: "exatamente 224×224",
    adjust: true,
    what: "Os blocos de posição são aprendidos para uma grade fixa. Outro tamanho quebra.",
    complement: {
      commonMistake: "Usar a resolução que funcionou na EfficientNet. O ViT não aceita variação.",
    },
  }),
  vit("camada-saida", {
    name: "camada de saída",
    suggested: "model.heads.head",
    glossary: ["classificacao"],
    what: "Trocada por Linear(768, nº de classes).",
    complement: {
      commonMistake: "Copiar `modelo.fc = ...` da ResNet.",
    },
  }),
  vit("estagio1-taxa", {
    name: "estágio 1 · taxa",
    suggested: "1e-3",
    glossary: ["taxa-de-aprendizado", "congelar-camadas"],
    what: "Igual aos outros dois.",
  }),
  vit("estagio2-taxa", {
    name: "estágio 2 · taxa",
    suggested: "1e-5",
    range: "10 a 15 épocas",
    adjust: true,
    glossary: ["taxa-de-aprendizado"],
    what: "Dez vezes menor que a das CNNs. Este é o modelo mais sensível da trilha: não subam este valor.",
    complement: {
      ifRaise: "Estraga os pesos pré-treinados; a validação despenca.",
      commonMistake: "Usar 1e-4 por hábito, como na ResNet e na EfficientNet.",
    },
  }),
  vit("lote", {
    name: "tamanho do lote",
    suggested: "16",
    adjust: true,
    glossary: ["lote"],
    what: "Metade dos outros, por causa da memória.",
    complement: {
      ifRaise: "Se passar de 16 numa GPU pequena, aparece erro de falta de memória.",
    },
  }),
  vit("decaimento", {
    name: "decaimento de peso",
    suggested: "1e-4",
    glossary: ["sobreajuste"],
    what: "Padrão da trilha.",
  }),
  vit("agendador", {
    name: "agendador",
    suggested: "CosineAnnealingLR",
    glossary: ["agendador-da-taxa"],
    what: "Padrão da trilha.",
  }),
  vit("suavizacao", {
    name: "suavização de rótulo",
    default: "0.0",
    suggested: "0.1",
    what: "Padrão da trilha.",
  }),
  vit("precisao-mista", {
    name: "precisão mista",
    default: "desligada",
    suggested: "ligada",
    what: "Aqui faz mais diferença: é o modelo mais pesado.",
  }),
  vit("tamanho", {
    name: "tamanho",
    suggested: "86,5 M de pesos",
    what: "17,56 GFLOPS por imagem: quatro vezes a ResNet.",
  }),
  vit("dependencia-pretreino", {
    name: "dependência do pré-treino",
    suggested: "total",
    glossary: ["transferencia-de-aprendizado"],
    what: "Treinar do zero com mil e quinhentas imagens não funciona neste modelo.",
  }),
];
