import type { Model } from "../schema.ts";
import { textoParams } from "../params/texto.ts";

const paramsOf = (slug: string) =>
  textoParams.filter((p) => p.modelSlug === slug).map((p) => p.id);

// Vale para os três modelos desta trilha e é o erro campeão dela.
const REGRA =
  "Regra da trilha: tokenizador (o \"tradutor\" do material) e modelo têm que ter o mesmo nome. Trocar um e esquecer o outro faz o código rodar e o resultado despencar, sem mensagem de erro.";

export const textoModels: Model[] = [
  {
    slug: "distilbert-multilingual",
    track: "texto",
    name: "DistilBERT multilíngue",
    profile: "entrada",
    summary: "Um modelo grande encolhido para a metade das camadas, imitando o original.",
    chooseIf: "Você quer espaço para testar várias configurações em vez de esperar treino.",
    expect: "Cerca de duas vezes mais rápido que os outros. Bom para as primeiras tentativas.",
    pitfall: `Ele fala 104 idiomas e nenhum muito bem. Perde para o especialista em português, e medir essa perda é parte do trabalho. ${REGRA}`,
    ready: "O tokenizador, que vem junto com o modelo pelo mesmo nome.",
    params: paramsOf("distilbert-multilingual"),
    source: "oiaa",
  },
  {
    slug: "bertimbau",
    track: "texto",
    name: "BERTimbau",
    profile: "especialista",
    summary: "Um modelo treinado só em português brasileiro, com textos da web do Brasil.",
    chooseIf: "Você quer o melhor resultado pelo menor risco. É a escolha natural desta trilha.",
    expect: "Tende a dar o melhor número da trilha. Conceitualmente, não traz nada de novo.",
    pitfall: `Ele diferencia maiúscula de minúscula e usa os acentos. Não passe o texto para minúsculas como se fazia na Fase 1: isso destrói informação que ele usa. ${REGRA}`,
    ready: "O tokenizador, que conhece palavras nossas inteiras e vem pelo mesmo nome do modelo.",
    params: paramsOf("bertimbau"),
    source: "oiaa",
  },
  {
    slug: "xlm-roberta",
    track: "texto",
    name: "XLM-RoBERTa",
    profile: "avançada",
    summary: "Um generalista treinado em 2,5 terabytes de texto em cem idiomas.",
    chooseIf: "Você quer testar a hipótese: será que muito mais treino compensa não ser especialista?",
    expect: "O mais pesado e o mais sensível à taxa. Pode ganhar, pode divergir no treino.",
    pitfall: `Ele não é mais fundo que o BERTimbau: tem as mesmas 12 camadas. É mais pesado por causa do vocabulário gigante, que sozinho responde por boa parte do tamanho. ${REGRA}`,
    ready: "O tokenizador, com 250 mil pedaços diferentes no vocabulário, que vem pelo mesmo nome do modelo.",
    params: paramsOf("xlm-roberta"),
    source: "oiaa",
  },
];
