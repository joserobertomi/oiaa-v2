# Capítulo 3 · Visão computacional

Na Fase 1 cada foto virava 14 medidas calculadas à mão. Agora o modelo recebe a foto e descobre sozinho o que olhar. Abas: **Explorar · Configurar · Modelar · Avaliar**.

Problema de exemplo: classificar materiais recicláveis em 5 classes (papel, papelão, vidro, plástico, …), com ~1.500 imagens de treino.

---

## 01 · Explorar

### 1.1 · Resolução — de 48 pixels para 224

Fase 1: 48×48. Agora 224×224 (vinte vezes mais informação). **Laboratório 13:** controle de resolução. Em 48×48 dá para ver que há algo ali, mas não o rótulo, a textura nem se a superfície reflete. Na Fase 1 isso era compensado com medidas à mão. (224×224×3 = 150.528 números por imagem.)

### 1.2 · Aumento de dados — uma foto vira quatro

Mostrar a mesma foto várias vezes, cada vez um pouco diferente. **Laboratório 14 — Oficina de aumento:** controles de recorte (100%), espelhar, brilho (100%), e o botão perigoso "Aplicar também na validação".

"Uma foto virou quatro. Para o modelo, são quatro exemplos diferentes do mesmo material. Só não pode passar do ponto: recorte de 55% já corta o objeto fora."

**Regra de ouro:** aumento só no treino, **nunca na validação**.

---

## 02 · Configurar

### 2.1 · Os três modelos (já sabem enxergar)

#### EfficientNet-B0 · *econômica*
Rede de convolução desenhada para o melhor resultado com o menor custo. Escolha se: quer rodar muitos experimentos no mesmo tempo. A mais barata, de longe.
- **Botões:** taxa do estágio 2 = 1e-4 · lote 32 · épocas do estágio 2 = 10–15 (mais que isso começa a decorar).
- **Já vem pronto:** pesos pré-treinados, as duas etapas de treino, preparo das imagens.
- **Pegadinha:** a camada de saída **não se chama igual** à da ResNet. Código copiado entre elas quebra.
- **O que esperar:** 5× menor que a ResNet e 10× mais barata por imagem, resultado parecido.

#### ResNet-50 · *referência*
Rede de convolução mais conhecida, com atalhos internos que estabilizam o treino. Escolha se: quer previsibilidade e tempo sobrando para interpretar em vez de depurar.
- **Botões:** taxa do estágio 2 = 1e-4 · lote 32 · épocas 10–15.
- **Já vem pronto:** tudo o da EfficientNet; a técnica que mostra onde o modelo olhou funciona muito bem aqui.
- **Pegadinha:** duas versões de pesos preparam a imagem de formas diferentes. Usar sempre a preparação que vem com os pesos (`PESOS.transforms()`), nunca uma escrita à mão.
- **O que esperar:** resultado sólido e sem surpresa; a escolha segura da trilha.

#### ViT-B/16 · *avançada*
Corta a imagem em quadradinhos de 16 pixels e trata cada um como uma palavra. Escolha se: quer testar uma ideia diferente e tem orçamento de GPU.
- **Botões:** taxa do estágio 2 = **1e-5** (10× menor que as CNNs; não subir) · lote **16** (memória) · épocas 10–15.
- **Já vem pronto:** pesos e o corte em quadradinhos.
- **Pegadinha:** entrada **exatamente 224×224**; qualquer outro tamanho quebra.
- **O que esperar:** 4× mais cara por imagem; pode perder para as CNNs nesta base. Se perder, vira bom parágrafo de relatório.

#### Hiperparâmetros completos

**EfficientNet-B0 (12)**

| Parâmetro | Valor | Nota |
|---|---|---|
| pesos | IMAGENET1K_V1 | 77,7% no ImageNet, com um quinto dos pesos da ResNet |
| preparação da imagem | `PESOS.transforms()` | Interpolação **bicúbica**, diferente dos outros dois |
| camada de saída | `model.classifier[1]` | `Linear(1280, nº classes)`. Não se chama `fc` |
| estágio 1 · taxa | 1e-3 | Igual à ResNet |
| estágio 2 · taxa | 1e-4 | Igual à ResNet |
| lote | 32 | O modelo mais leve da trilha |
| decaimento de peso | 1e-4 | Padrão da trilha |
| agendador | CosineAnnealingLR | Padrão da trilha |
| suavização de rótulo | 0.0 → 0.1 | Padrão da trilha |
| precisão mista | desligada → ligada | Padrão da trilha |
| tamanho | 5,3 M de pesos | 0,39 GFLOPS/imagem (10× mais barato que a ResNet) |
| trocar de versão | B0 → B3 muda a entrada | Migrar na família exige trocar a resolução, não só o nome |

**ResNet-50 (14)**

| Parâmetro | Valor | Nota |
|---|---|---|
| pesos | IMAGENET1K_V2 | V2: 80,9% no ImageNet vs 76,1% da V1; redimensiona diferente |
| preparação da imagem | `PESOS.transforms()` | Digitar os números à mão é fonte de erro silencioso |
| camada de saída | `model.fc` | `Linear(2048, nº classes)`. Só este modelo se chama `fc` |
| estágio 1 · o que treina | só a saída | Sondagem linear; resto congelado |
| estágio 1 · taxa | 1e-3 | Adam, por 5 épocas |
| estágio 2 · o que treina | último bloco + saída | Descongelar tudo sobreajusta com poucas imagens |
| estágio 2 · taxa | 1e-4 | AdamW, 10–15 épocas |
| lote | 32 | Cabe numa GPU de 16 GB |
| decaimento de peso | 1e-4 | Padrão da trilha |
| agendador | CosineAnnealingLR | Taxa cai suavemente até quase zero |
| suavização de rótulo | 0.0 → 0.1 | Nunca ter 100% de certeza |
| precisão mista | desligada → ligada | Cabe mais memória, treina mais rápido |
| aumento de dados | recorte + espelho + cor | Só no treino |
| tamanho | 25,5 M de pesos | 4,09 GFLOPS/imagem |

**ViT-B/16 (12)**

| Parâmetro | Valor | Nota |
|---|---|---|
| pesos | IMAGENET1K_V1 | 81,1% no ImageNet, o melhor dos três, em outra base |
| entrada | exatamente 224×224 | Blocos de posição aprendidos para grade fixa |
| camada de saída | `model.heads.head` | `Linear(768, nº classes)` |
| estágio 1 · taxa | 1e-3 | Igual aos outros |
| estágio 2 · taxa | 1e-5 | 10× menor que as CNNs; o mais sensível |
| lote | 16 | Metade dos outros, por memória |
| decaimento de peso | 1e-4 | Padrão da trilha |
| agendador | CosineAnnealingLR | Padrão da trilha |
| suavização de rótulo | 0.0 → 0.1 | Padrão da trilha |
| precisão mista | desligada → ligada | Faz mais diferença: modelo mais pesado |
| tamanho | 86,5 M de pesos | 17,56 GFLOPS/imagem (4× a ResNet) |
| dependência do pré-treino | total | Do zero com 1.500 imagens não funciona |

### 2.2 · Estratégia — treino em dois estágios

Descongelar o modelo inteiro com poucas imagens é receita de decoreba.

- **Estágio 1 · Sondagem:** congela tudo, treina só a última camada (a que dá o nome das classes). Rápido, resultado decente.
- **Estágio 2 · Ajuste fino:** libera também o último bloco, com passo bem menor.

### 2.3 · A camada de saída tem nome diferente em cada modelo

```python
modelo.fc = nn.Linear(..., n_classes)               # ResNet-50
modelo.classifier[1] = nn.Linear(..., n_classes)    # EfficientNet-B0
modelo.heads.head = nn.Linear(..., n_classes)       # ViT-B/16
```

Copiar o código de um para o outro quebra e a mensagem de erro não ajuda.

---

## 03 · Modelar

### 3.1 · Atividade por modelo — `desafio_visao.ipynb` (ResNet-50, lacunas `?????`)

```python
# ═══ CÉLULA A · preparo ═══
preparo_val = PESOS.transforms()                      # vem junto com os pesos, nunca à mão
preparo_tr = Compose([RandomResizedCrop(224), ?????, ToTensor(), Normalize(med, dp)])   # espelho horizontal
validacao = Dataset(pasta_val, transform=?????)       # preparo_val (SEM aumento)

# ═══ CÉLULA B · treino ═══
modelo = resnet50(weights=PESOS)
modelo.????? = nn.Linear(2048, n_classes)             # fc
# modelo já treinado pede passo pequeno
otimizador = ?????(modelo.parameters(), lr=?????)     # AdamW, 1e-4

# ═══ CÉLULA C · avaliação ═══
modelo.?????()                                        # eval
print(?????(y_va, previsoes, average=?????))          # f1_score, 'macro'
```

(Respostas nos comentários são deduzidas.)

### 3.2 · Caça ao erro — código que roda e entrega menos do que deveria

```python
treino    = Dataset(pasta_treino, transform=preparo_treino)
validacao = Dataset(pasta_val,    transform=preparo_treino)   # <- culpada: aumento na validação
modelo    = resnet50(weights=PESOS)
modelo.fc = nn.Linear(2048, n_classes)
for epoca in range(15): treinar_uma_epoca(modelo, treino)
print(avaliar(modelo, validacao))
```

### 3.3 · Zona Livre

Mesma estrutura do Cap. 2. Só lacunas preenchidas: F1-macro na validação **0,79** ("já é bom porque o modelo veio pré-treinado, e é o que todo mundo alcança"). O diferencial está nos ajustes da Zona Livre, um por vez.

---

## 04 · Avaliar

### 4.1 · O modelo olhou para o objeto ou para o fundo?

Pergunta que não aparece em nenhuma métrica. Técnica de mapa de calor mostra onde o modelo prestou atenção. **Laboratório 15 — Onde o modelo olhou:** Modelo A e Modelo B, ambos com 91% de acerto. O A olha o objeto; o B olha o fundo/canto. Só o primeiro continua acertando numa cooperativa diferente, com outra esteira e outra luz. Se o calor estiver no canto, no fundo ou na borda, desconfiem por mais alto que seja o resultado. (Ligação com a aba de ética do Cap. 1.)

### 4.2 · As duas curvas em visão

Leitura como no Cap. 2, mas com 1.500 imagens e 25 milhões de pesos o sobreajuste é a regra, por isso a trilha tem aumento de dados, dois estágios e parada antecipada. Casos: *treino saudável* · *sobreajuste clássico* · *aumento na validação*.

**Se a curva de validação ficar abaixo da de treino o tempo todo, desconfiem**: o aumento provavelmente vazou para a validação (erro do Lab 14).

Treino saudável com transferência: queda bem íngreme nas primeiras épocas; o modelo já sabia enxergar, só aprendia as classes.

### 4.3 · Matriz de confusão — papel e papelão, vidro e plástico

Cinco materiais, cinco linhas. O modelo erra entre pares que se parecem. Se confunde papel com papelão, mais épocas não resolve; pode resolver aumento de dados que varie a textura ou resolução maior. A matriz é o mapa do que tentar em seguida.

### Prova final do Capítulo 3 (sem gabarito)

1. O aumento de dados vai em quais conjuntos? (só treino / nos três / só validação / treino e validação)
2. Dois modelos acertam 91%; um olha o objeto, o outro o fundo. O que a métrica mostra? (só a matriz / a diferença claramente / nada: mesmo número / a curva de perda)
3. Por que o treino de visão é em dois estágios? (duas métricas / economizar GPU / descongelar tudo com poucas imagens faz decorar / a biblioteca exige)
4. A camada de saída da EfficientNet tem o mesmo nome da ResNet? (não: cada modelo guarda com nome próprio / só da mesma biblioteca / sim, ambas usam fc / depende da versão dos pesos)
