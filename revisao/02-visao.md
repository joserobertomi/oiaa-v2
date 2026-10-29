# Revisão dos complementos · Imagens

20 itens escritos pelo autor do guia, que **não** vêm do material da OIAA e aparecem no site com a etiqueta "complemento".

Para cada item: marque `[x]` se estiver correto; se precisar mudar, escreva o texto certo em **Correção**; para cortar, escreva `CORTAR` em Correção.

## EfficientNet-B0

### preparação da imagem  `efficientnet-b0-preparacao`

**No material:** sugerido PESOS.transforms(). A preparação que vem junto com os pesos. Usa interpolação bicúbica, diferente dos outros dois modelos.

- [ ] **Erro comum:** Copiar o preparo da ResNet ou escrever os números à mão. O código roda, mas o modelo recebe a imagem diferente da que foi treinado a ver.
  - Correção:

### camada de saída  `efficientnet-b0-camada-saida`

**No material:** sugerido model.classifier[1]. Trocada por Linear(1280, nº de classes). Não se chama fc.

- [ ] **Erro comum:** Copiar `modelo.fc = ...` da ResNet. Em vez de trocar a saída, cria um atributo novo que o modelo nunca usa, e a mensagem de erro não ajuda.
  - Correção:

### estágio 2 · taxa  `efficientnet-b0-estagio2-taxa`

**No material:** sugerido 1e-4 · faixa 10 a 15 épocas. Passo do ajuste fino, em que o último bloco também é liberado. Igual à ResNet. Mais que 15 épocas neste estágio começa a decorar.

- [ ] **Se subir:** Pode estragar o que o modelo já sabia: a validação cai logo nas primeiras épocas do estágio 2.
  - Correção:
- [ ] **Se baixar:** Ajuste mais lento e ganho menor sobre a sondagem do estágio 1.
  - Correção:

### tamanho do lote  `efficientnet-b0-lote`

**No material:** sugerido 32. Quantos exemplos por ajuste. Cabe com folga: é o modelo mais leve da trilha.

- [ ] **Se subir:** Treino mais rápido por época, usando mais memória da GPU.
  - Correção:
- [ ] **Se baixar:** Usa menos memória, com curva mais irregular. Reduza se aparecer erro de falta de memória.
  - Correção:

### atenção ao trocar de versão  `efficientnet-b0-trocar-versao`

**No material:** sugerido B0 → B3 muda a entrada. Migrar dentro da família EfficientNet exige trocar a resolução de entrada, não só o nome da classe.

- [ ] **Erro comum:** Trocar B0 por B3 mudando só o nome e manter a imagem em 224×224.
  - Correção:

## ResNet-50

### pesos  `resnet-50-pesos`

**No material:** sugerido IMAGENET1K_V2. A versão V2 acerta 80,9% no ImageNet, contra 76,1% da V1, e redimensiona a imagem de forma diferente.

- [ ] **Erro comum:** Misturar pesos V2 com o preparo da V1 (ou o contrário).
  - Correção:

### camada de saída  `resnet-50-camada-saida`

**No material:** sugerido model.fc. Trocada por Linear(2048, nº de classes). Só neste modelo ela se chama fc.

- [ ] **Erro comum:** Usar `fc` na EfficientNet ou no ViT, onde a saída tem outro nome.
  - Correção:

### estágio 2 · o que treina  `resnet-50-estagio2-o-que-treina`

**No material:** sugerido último bloco + saída. Descongelar a rede inteira sobreajusta com poucas imagens.

- [ ] **Erro comum:** Descongelar tudo para tentar ganhar mais um ponto: com 1.500 imagens o modelo passa a decorar.
  - Correção:

### estágio 2 · taxa  `resnet-50-estagio2-taxa`

**No material:** sugerido 1e-4 · faixa 10 a 15 épocas. Usa o otimizador AdamW, de 10 a 15 épocas.

- [ ] **Se subir:** Pode estragar o que o modelo já sabia: a validação cai logo nas primeiras épocas do estágio 2.
  - Correção:
- [ ] **Se baixar:** Ajuste mais lento e ganho menor sobre a sondagem do estágio 1.
  - Correção:

### tamanho do lote  `resnet-50-lote`

**No material:** sugerido 32. Cabe folgado numa GPU de 16 GB.

- [ ] **Se subir:** Treino mais rápido por época, usando mais memória da GPU.
  - Correção:
- [ ] **Se baixar:** Usa menos memória, com curva mais irregular.
  - Correção:

### aumento de dados  `resnet-50-aumento-de-dados`

**No material:** sugerido recorte + espelho + cor. Só no treino. Nunca na validação.

- [ ] **Erro comum:** Reaproveitar a mesma preparação do treino para a validação: a validação fica artificialmente difícil e a curva sai abaixo da de treino.
  - Correção:

## ViT-B/16

### entrada  `vit-b16-entrada`

**No material:** sugerido exatamente 224×224. Os blocos de posição são aprendidos para uma grade fixa. Outro tamanho quebra.

- [ ] **Erro comum:** Usar a resolução que funcionou na EfficientNet. O ViT não aceita variação.
  - Correção:

### camada de saída  `vit-b16-camada-saida`

**No material:** sugerido model.heads.head. Trocada por Linear(768, nº de classes).

- [ ] **Erro comum:** Copiar `modelo.fc = ...` da ResNet.
  - Correção:

### estágio 2 · taxa  `vit-b16-estagio2-taxa`

**No material:** sugerido 1e-5 · faixa 10 a 15 épocas. Dez vezes menor que a das CNNs. Este é o modelo mais sensível da trilha: não subam este valor.

- [ ] **Se subir:** Estraga os pesos pré-treinados; a validação despenca.
  - Correção:
- [ ] **Erro comum:** Usar 1e-4 por hábito, como na ResNet e na EfficientNet.
  - Correção:

### tamanho do lote  `vit-b16-lote`

**No material:** sugerido 16. Metade dos outros, por causa da memória.

- [ ] **Se subir:** Se passar de 16 numa GPU pequena, aparece erro de falta de memória.
  - Correção:
