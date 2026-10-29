# Linha do tempo — de onde veio cada peça

Cada modelo nasceu para resolver um problema concreto que os anteriores não resolviam. Filtros no site: Fundamentos · Visão · Texto · Tabelas · Ética e regras.

| Ano | Área | Marco | Por que foi criado |
|---|---|---|---|
| 1958 | Fundamentos | **Perceptron** (Frank Rosenblatt) | Primeira máquina que aprende ajustando pesos. Dá para aprender com exemplos em vez de regras? Sim, mas só para problemas que uma reta separa. |
| 1986 | Fundamentos | **Backpropagation** (Rumelhart, Hinton, Williams) | O perceptron travava em problemas que uma reta não resolve. Faltava saber quanto cada peso das camadas do meio contribuiu para o erro. Mesmo método do Lab 4. |
| 1989 | Visão | **Redes convolucionais** (Yann LeCun) | Tratar cada pixel como independente desperdiça que vizinhos têm relação. A convolução procura padrões locais em qualquer posição. |
| 1995 | Tabelas | **SVM** (Cortes e Vapnik) | Com poucos dados e muitas variáveis, redes iam mal. Dominou por quase duas décadas; foi usado na trilha de visão da Fase 1. |
| 2012 | Visão | **AlexNet** | Rede convolucional vence o ImageNet com folga. Muitos dados rotulados + GPUs baratas + ideias novas de treino. Marco em que o aprendizado profundo deixou de ser promessa. |
| 2014 | Fundamentos | **Dropout** (Srivastava, Hinton) | Redes grandes decoravam o treino. Em vez de diminuir a rede, impedir dependência de qualquer neurônio. Controle do Lab 3. |
| 2015 | Visão | **ResNet** (He et al.) | Redes muito fundas treinavam pior que rasas: o erro se perdia no caminho de volta. O atalho deixa o gradiente atravessar camadas. Um dos três modelos de visão. |
| 2017 | Texto | **Transformer** ("Attention is all you need", Vaswani et al.) | Redes de texto liam palavra por palavra e esqueciam o começo. A atenção deixa cada palavra olhar todas as outras. Base de BERT, ViT, FT-Transformer e assistentes. |
| 2018 | Ética e regras | **LGPD** | Tecnologia andou mais rápido que as regras. Define o que pode ser coletado, para quê e o que a pessoa tem direito de saber. Por isso os dados da olimpíada chegam anonimizados. |
| 2018 | Texto | **BERT** (Devlin et al.) | Rotular texto é caro. Treinar em texto cru escondendo palavras e depois ajustar para a tarefa (transferência, Lab 7). |
| 2019 | Tabelas | **TabNet** (Google) | Em tabelas, árvores ganhavam das redes. Trouxe decisão em etapas e capacidade de mostrar as colunas usadas. Modelo da trilha tabular. |
| 2020 | Texto | **BERTimbau** (Souza, Nogueira, Lotufo) | Multilíngues falam muitos idiomas e nenhum muito bem. Treinado em corpus brasileiro; é a comparação do Cap. 4. |
| 2020 | Visão | **Vision Transformer** (Dosovitskiy et al.) | Se a atenção funciona em texto, funcionaria em imagem? Sim, com muito pré-treino. Sem isso, perde para as convolucionais. |
| 2021 | Tabelas | **FT-Transformer** (Gorishniy et al.) | Mesma ideia do BERT, com colunas no lugar de palavras. Ponte entre as três trilhas. |
| 2024 | Ética e regras | **AI Act europeu** | Primeira lei ampla sobre IA. A regra depende do risco: quanto mais a decisão afeta a vida de alguém, mais transparência e supervisão humana. |
