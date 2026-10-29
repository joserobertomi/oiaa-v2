import type { Model } from "../schema.ts";
import { visaoParams } from "../params/visao.ts";

const paramsOf = (slug: string) =>
  visaoParams.filter((p) => p.modelSlug === slug).map((p) => p.id);

export const visaoModels: Model[] = [
  {
    slug: "efficientnet-b0",
    track: "visao",
    name: "EfficientNet-B0",
    profile: "econômica",
    summary: "Uma rede de convolução desenhada para dar o melhor resultado com o menor custo.",
    chooseIf: "Você quer rodar muitos experimentos no mesmo tempo. É a mais barata das três, de longe.",
    expect: "Cinco vezes menor que a ResNet e dez vezes mais barata por imagem, com resultado parecido.",
    pitfall:
      "A camada de saída dela não se chama igual à da ResNet (classifier[1] em vez de fc). Código copiado de uma para a outra quebra.",
    ready: "Os pesos pré-treinados, as duas etapas de treino e a preparação das imagens.",
    params: paramsOf("efficientnet-b0"),
    source: "oiaa",
  },
  {
    slug: "resnet-50",
    track: "visao",
    name: "ResNet-50",
    profile: "referência",
    summary: "A rede de convolução mais conhecida da área, com atalhos internos que deixam o treino estável.",
    chooseIf: "Você quer previsibilidade e tempo sobrando para interpretar em vez de depurar.",
    expect: "Resultado sólido e sem surpresa. É a escolha segura da trilha.",
    pitfall:
      "Existem duas versões de pesos (V1 e V2) e elas preparam a imagem de forma diferente. Use sempre a preparação que vem junto com os pesos (PESOS.transforms()), nunca uma escrita à mão.",
    ready: "Tudo o que vem na EfficientNet. A técnica que mostra onde o modelo olhou funciona muito bem aqui.",
    params: paramsOf("resnet-50"),
    source: "oiaa",
  },
  {
    slug: "vit-b16",
    track: "visao",
    name: "ViT-B/16",
    profile: "avançada",
    summary: "Corta a imagem em quadradinhos de 16 pixels e trata cada um como se fosse uma palavra.",
    chooseIf: "Você quer testar uma ideia diferente e tem orçamento de GPU para isso.",
    expect:
      "Quatro vezes mais cara por imagem e pode perder para as CNNs nesta base. Se perder, isso vira um bom parágrafo de relatório.",
    pitfall:
      "A entrada precisa ser exatamente 224 por 224. Qualquer outro tamanho quebra, diferente das duas CNNs, que aceitam variação.",
    ready: "Os pesos e o corte da imagem em quadradinhos.",
    params: paramsOf("vit-b16"),
    source: "oiaa",
  },
];
