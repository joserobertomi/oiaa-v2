import type { Symptom, SymptomGroup } from "./schema.ts";

export const SYMPTOM_GROUPS: Record<SymptomGroup, string> = {
  silencioso: "Roda sem erro, mas algo está errado",
  curvas: "Lendo as curvas de treino",
  configuracao: "Erros de configuração e de ambiente",
  metrica: "Métricas suspeitas",
};

export const symptoms: Symptom[] = [
  // ───── Erros silenciosos (os 10 do checklist) ─────
  {
    slug: "caderno-lento-sem-gpu",
    group: "silencioso",
    title: "O treino leva horas (a estimativa é de 3h ou mais)",
    likelyCauses: [
      "O ambiente está em CPU: o caderno roda, mas sem GPU demora horas.",
      "O modelo ficou na CPU porque não foi enviado ao dispositivo (modelo.to(dispositivo)).",
    ],
    fix: "Troque o tipo de ambiente para GPU antes de qualquer coisa e confirme que torch.cuda.is_available() devolve True. É o erro mais comum do primeiro dia.",
    check: "torch.cuda.is_available() devolve True e o modelo está em cuda.",
    related: { theory: ["sala-de-controle"] },
    source: "oiaa",
  },
  {
    slug: "metrica-muda-a-cada-execucao",
    group: "silencioso",
    title: "A métrica muda de valor a cada execução, sem motivo aparente",
    likelyCauses: ["O dropout ficou ligado durante a avaliação."],
    fix: "Chame modelo.eval() antes de avaliar: isso desliga o dropout e a rede inteira trabalha. O dropout só deve agir durante o treino.",
    check: "modelo.eval() é chamado antes de qualquer avaliação.",
    related: { params: ["rede-densa-dropout", "rede-densa-embeddings-dropout"], theory: ["curvas-de-treino"] },
    source: "oiaa",
  },
  {
    slug: "validacao-boa-plataforma-ruim",
    group: "silencioso",
    title: "Vai bem na validação, mas pior na plataforma",
    likelyCauses: [
      "Vazamento: a régua (padronização) foi ajustada com a tabela inteira, e não só com o treino.",
      "Informação da validação ou do teste entrou no treino de outro jeito.",
    ],
    fix: "Separe treino e validação primeiro. Ajuste a régua só no treino (fit em X_tr) e depois aplique a transformação nos dois conjuntos.",
    check: "A régua foi ajustada só no treino, depois da separação.",
    related: { params: ["rede-densa-padronizacao", "rede-densa-embeddings-padronizacao"], theory: ["vazamento"] },
    source: "oiaa",
  },
  {
    slug: "roda-mas-nao-aprende",
    group: "silencioso",
    title: "O código roda sem nenhum erro, mas o modelo não aprende nada",
    likelyCauses: [
      "As cinco linhas do laço de treino estão fora de ordem.",
      "Os ajustes do passo anterior não foram apagados (zero_grad): eles se acumulam e o treino enlouquece.",
    ],
    fix: "Confira a ordem do laço: zerar os ajustes, passagem para frente, medir o erro, propagar para trás, atualizar os pesos. Trocar duas linhas de lugar roda e não aprende, sem mensagem.",
    check: "O laço segue a ordem zerar → para frente → medir o erro → para trás → atualizar.",
    related: { theory: ["backpropagation"] },
    source: "oiaa",
  },
  {
    slug: "validacao-abaixo-do-treino",
    group: "silencioso",
    title: "A curva de validação fica abaixo da de treino o tempo todo",
    likelyCauses: [
      "O aumento de dados vazou para a validação, deixando o treino artificialmente mais difícil que a medição.",
      "A separação foi mal feita ou há vazamento.",
    ],
    fix: "Aplique o aumento de dados só no treino. Na validação use apenas a preparação que vem com os pesos (PESOS.transforms()).",
    check: "O aumento de dados é aplicado só no treino, nunca na validação.",
    related: { params: ["resnet-50-aumento-de-dados"], theory: ["vazamento", "aumento-de-dados-e-dois-estagios"] },
    source: "oiaa",
  },
  {
    slug: "erro-camada-saida",
    group: "silencioso",
    title: "Quebra ou rende pouco ao trocar de modelo de visão",
    likelyCauses: [
      "A camada de saída tem nome diferente em cada modelo e o código foi copiado de outro.",
    ],
    fix: "Use o nome do modelo que está em uso: ResNet-50 model.fc, EfficientNet-B0 model.classifier[1], ViT-B/16 model.heads.head.",
    check: "A camada de saída trocada tem o nome do modelo em uso.",
    related: {
      theory: ["transferencia-de-aprendizado"],
      models: ["resnet-50", "efficientnet-b0", "vit-b16"],
      params: ["resnet-50-camada-saida", "efficientnet-b0-camada-saida", "vit-b16-camada-saida"],
    },
    source: "oiaa",
  },
  {
    slug: "texto-roda-resultado-despenca",
    group: "silencioso",
    title: "O texto roda, mas o resultado despenca depois que troquei de modelo",
    likelyCauses: [
      "O tokenizador não é do mesmo modelo: trocou o nome do modelo e esqueceu o do tokenizador.",
    ],
    fix: "Use o mesmo identificador para o tokenizador e para o modelo: trocar de modelo é trocar uma string só (NOME), e o tokenizador certo vem junto.",
    check: "Tokenizador e modelo são carregados pelo mesmo NOME.",
    related: {
      theory: ["pedacos-de-palavra"],
      models: ["distilbert-multilingual", "bertimbau", "xlm-roberta"],
      params: [
        "distilbert-multilingual-identificador",
        "bertimbau-identificador",
        "xlm-roberta-identificador",
      ],
    },
    source: "oiaa",
  },
  {
    slug: "bertimbau-pior-que-esperado",
    group: "silencioso",
    title: "O BERTimbau (ou outro modelo de texto) rende menos do que deveria",
    likelyCauses: [
      "O texto foi passado para minúsculas ou sem acentos, como na Fase 1.",
      "do_lower_case ficou True no BERTimbau.",
    ],
    fix: "Não limpe o texto: nada de minúsculas, tirar acento, pontuação ou palavra comum. Use do_lower_case=False. O tokenizador cuida do resto.",
    check: "Nenhuma limpeza de texto (minúsculas, acento, palavras comuns) antes do tokenizador.",
    related: {
      theory: ["pedacos-de-palavra"],
      models: ["bertimbau"],
      params: ["bertimbau-do-lower-case", "distilbert-multilingual-limpeza"],
    },
    source: "oiaa",
  },
  {
    slug: "resnet-pior-sem-erro",
    group: "silencioso",
    title: "A ResNet entrega menos do que deveria, sem nenhuma mensagem",
    likelyCauses: [
      "A preparação da imagem foi escrita à mão (números digitados) ou é de outra versão de pesos.",
      "As versões V1 e V2 dos pesos redimensionam a imagem de forma diferente.",
    ],
    fix: "Use sempre PESOS.transforms(), que vem junto com os pesos. Digitar os números à mão é fonte de erro silencioso.",
    check: "A preparação da imagem vem de PESOS.transforms(), não de números digitados.",
    related: {
      theory: ["transferencia-de-aprendizado"],
      models: ["resnet-50"],
      params: ["resnet-50-pesos", "resnet-50-preparacao", "efficientnet-b0-preparacao"],
    },
    source: "oiaa",
  },
  {
    slug: "buraco-em-um-grupo",
    group: "silencioso",
    title: "O F1-macro é alto, mas o modelo erra muito para um tipo de caso",
    likelyCauses: [
      "A média esconde um grupo com desempenho ruim. Exemplo do material: 0,88 no geral e 0,58 quando a pessoa usa ironia.",
    ],
    fix: "Calcule o F1 por grupo e reporte os dois números no relatório, explicando onde o modelo falha. Uma tabela assim vale mais que dois centésimos a mais na métrica.",
    check: "O relatório traz o desempenho por grupo, e não só a média.",
    related: { theory: ["desempenho-por-grupo", "etica-e-uso-de-ia"] },
    source: "oiaa",
  },

  // ───── Curvas de treino ─────
  {
    slug: "curvas-caem-juntas",
    group: "curvas",
    title: "Treino e validação caem juntas",
    likelyCauses: ["O modelo está aprendendo: é o treino saudável."],
    fix: "Está tudo certo. Com transferência de aprendizado a queda nas primeiras épocas é bem íngreme (o modelo já sabia enxergar ou ler). Mantenha a parada antecipada e o ponto de verificação.",
    related: { theory: ["curvas-de-treino"] },
    source: "oiaa",
  },
  {
    slug: "sobreajuste",
    group: "curvas",
    title: "O treino cai, mas a validação sobe",
    likelyCauses: ["Sobreajuste: o modelo começou a decorar o treino."],
    fix: "Pare antes (parada antecipada), aumente o dropout, diminua a rede ou consiga mais dados, inclusive com aumento de dados nas imagens.",
    related: {
      theory: ["curvas-de-treino"],
      params: ["rede-densa-dropout", "rede-densa-decaimento", "rede-densa-largura"],
    },
    source: "oiaa",
  },
  {
    slug: "subajuste",
    group: "curvas",
    title: "As duas curvas ficam paradas lá no alto",
    likelyCauses: [
      "Subajuste: o modelo é simples demais para o problema.",
      "O passo (taxa de aprendizado) é pequeno demais para chegar longe.",
      "As entradas não foram padronizadas.",
    ],
    fix: "Aumente a capacidade do modelo, aumente a taxa de aprendizado ou dê mais épocas. Confira também se as entradas estão padronizadas.",
    related: {
      theory: ["curvas-de-treino"],
      params: ["rede-densa-largura", "rede-densa-camadas", "rede-densa-taxa", "rede-densa-padronizacao"],
    },
    source: "oiaa",
  },
  {
    slug: "taxa-alta-demais",
    group: "curvas",
    title: "A curva de erro serrilha ou sobe em vez de descer",
    likelyCauses: ["A taxa de aprendizado está alta demais."],
    fix: "Divida a taxa por dez e rode de novo. É a primeira coisa a tentar quando a curva serrilha ou sobe.",
    related: {
      theory: ["taxa-epocas-lote"],
      params: [
        "rede-densa-taxa",
        "tabnet-taxa",
        "resnet-50-estagio2-taxa",
        "vit-b16-estagio2-taxa",
        "xlm-roberta-taxa",
      ],
    },
    source: "oiaa",
  },
  {
    slug: "modelo-final-pior-que-o-melhor",
    group: "curvas",
    title: "O modelo que entreguei é pior que o da melhor época",
    likelyCauses: [
      "Sem parada antecipada e sem ponto de verificação, você entrega o modelo da última época, quando ele já estava piorando.",
    ],
    fix: "Ligue a parada antecipada e salve o ponto de verificação na melhor época, não na última. Em texto a validação costuma ter o melhor ponto na 2ª ou 3ª época.",
    related: {
      theory: ["sala-de-controle", "curvas-de-treino"],
      params: ["rede-densa-epocas", "tabnet-patience", "tabnet-max-epochs", "bertimbau-epocas"],
    },
    source: "oiaa",
  },

  // ───── Configuração e ambiente ─────
  {
    slug: "tabnet-lote-virtual",
    group: "configuracao",
    title: "O TabNet dá erro na hora de rodar",
    likelyCauses: ["O virtual_batch_size não divide exatamente o batch_size."],
    fix: "Escolha um virtual_batch_size que divida o batch_size sem sobra. Com batch_size 1024, o valor 128 serve.",
    related: {
      theory: ["taxa-epocas-lote"],
      models: ["tabnet"],
      params: ["tabnet-virtual-batch-size", "tabnet-batch-size"],
    },
    source: "oiaa",
  },
  {
    slug: "embeddings-cardinalidades",
    group: "configuracao",
    title: "A rede com embeddings (ou o TabNet) quebra na hora de prever",
    likelyCauses: [
      "As cardinalidades estão erradas ou faltando: quantos valores diferentes cada coluna de categoria tem.",
      "No TabNet, cat_idxs e cat_dims não foram preenchidos (sem os dois, os embeddings não são criados).",
    ],
    fix: "Refaça a contagem de valores diferentes de cada coluna de categoria (número que sai do Bloco 1, Explorar) e passe a lista na ordem certa.",
    related: {
      theory: ["embeddings"],
      models: ["rede-densa-embeddings", "tabnet"],
      params: ["rede-densa-embeddings-cardinalidades", "tabnet-cat-idxs", "tabnet-cat-dims"],
    },
    source: "oiaa",
  },
  {
    slug: "vit-tamanho-entrada",
    group: "configuracao",
    title: "O ViT quebra com um tamanho de imagem diferente",
    likelyCauses: ["O ViT só aceita imagens de exatamente 224 por 224."],
    fix: "Redimensione para 224×224. As duas CNNs aceitam variação; o ViT não, porque os blocos de posição são aprendidos para uma grade fixa.",
    related: { models: ["vit-b16"], params: ["vit-b16-entrada"] },
    source: "oiaa",
  },
  {
    slug: "xlm-roberta-diverge",
    group: "configuracao",
    title: "O XLM-RoBERTa diverge: o F1 despenca no meio do treino",
    likelyCauses: [
      "Taxa de aprendizado alta: é o modelo mais instável da trilha de texto.",
      "Aquecimento curto demais.",
    ],
    fix: "Baixe a taxa primeiro (a faixa é 1e-5 a 2e-5) e alongue o aquecimento: é o modelo que mais se beneficia de começar devagar.",
    related: {
      theory: ["taxa-epocas-lote"],
      models: ["xlm-roberta"],
      params: ["xlm-roberta-taxa", "xlm-roberta-aquecimento"],
    },
    source: "oiaa",
  },
  {
    slug: "sessao-caiu",
    group: "configuracao",
    title: "A sessão caiu e eu perdi o treino",
    likelyCauses: ["Não havia ponto de verificação salvo."],
    fix: "Salve um ponto de verificação durante o treino: se a sessão cair, você volta dali em vez de recomeçar do zero.",
    related: { theory: ["sala-de-controle"] },
    source: "oiaa",
  },

  // ───── Métricas ─────
  {
    slug: "f1-igual-ao-chute-preguicoso",
    group: "metrica",
    title: "O F1-macro do meu modelo é quase igual ao do chute preguiçoso",
    likelyCauses: [
      "O modelo mal superou o piso: se não passa do baseline, ele não aprendeu, copiou.",
      "Nenhuma coluna ajuda a adivinhar a resposta (problema sem sinal).",
    ],
    fix: "Confira o piso e o sinal das colunas (informação mútua) no Bloco 1. Se o modelo não passa do baseline, revise o preparo e a padronização antes de gastar tempo ajustando.",
    related: { params: ["rede-densa-padronizacao"], theory: ["piso-e-f1-macro"] },
    source: "oiaa",
  },
];
