# Capítulo 2 · Dados tabulares

Tabela comum: uma linha por caso, uma coluna por informação. Já resolvida com floresta aleatória na Fase 1; agora com rede neural. A pergunta interessante é se vale a pena. Abas: **Explorar · Configurar · Modelar · Avaliar**.

Problema de exemplo do capítulo: prever se uma faixa musical é *pouco tocada*, *mediana* ou *muito tocada* (3 classes).

---

## 01 · Explorar

### 1.1 · O piso — antes de treinar, descubram se dá para ganhar

Erro que custa a fase inteira: seis dias ajustando modelo num problema em que nenhuma coluna ajuda a adivinhar a resposta. Dá para saber no primeiro dia com dois números.

O **piso** (baseline majoritário, o "chute preguiçoso"): um modelo que responde sempre a classe mais comum. Se o modelo de vocês não passar disso, ele não aprendeu.

**Laboratório 10 — O piso, a barra e o teto.** Controle: % da classe mais comum (70%). Com 70%, o chute preguiçoso tira **70% de acurácia e só 41% de F1-macro**. Quanto mais desequilibrado, mais a acurácia do chute sobe e o F1-macro desaba: uma métrica premia a preguiça, a outra não. Por isso o ranking usa **F1-macro**.

### 1.2 · O sinal — alguma coluna ajuda?

Cada coluna recebe nota de 0 a 1 (informação mútua, o "medidor de sinal"). Perto de zero = a coluna sozinha não diz nada sobre a classe.

**Laboratório 11 — Raio-X da tabela.** Alterna entre "Problema com sinal" e "Problema sem sinal". No exemplo com sinal, três colunas acima de 0,15 já dão material de trabalho.

> *Como isso se chama de verdade:* o "medidor de sinal" é a **informação mútua**; o "chute preguiçoso" é o **baseline majoritário**.

### 1.3 · Repetição

Colunas muito parecidas entre si são informação repetida: não somam e deixam o modelo mais lento (mapa de correlação; mais escuro = andam mais juntas).

**Anotem antes de sair da aba** (reaparecem na próxima):
1. F1-macro do chute preguiçoso
2. As três colunas de maior sinal
3. Quantos valores diferentes cada coluna de categoria tem — **obrigatório**: sem ele, dois dos três modelos nem rodam.

---

## 02 · Configurar

### 2.1 · Os três modelos

Todos os modelos usam os mesmos seis campos. O campo 3 ("os botões que vocês mexem") é o que se ajusta de fato.

#### Rede densa · *entrada*
Camadas de neurônios empilhadas, sem nenhuma ideia além disso. Escolha se: quer começar rápido e entender cada linha. Treina em minutos.

- **Botões:** largura 64–512 (neurônios por camada) · dropout 0–0,5 (comece em 0,3) · taxa 1e-3 (valor alto, porque o modelo começa do zero).
- **Já vem pronto:** otimizador, parada antecipada, laço de treino.
- **Pegadinha:** sem a régua nas colunas numéricas, o modelo trava (única das três que não perdoa).
- **O que esperar:** rápida, simples, mais competitiva do que parece. Não explica as decisões.

#### Rede densa com embeddings · *intermediária*
Mesma rede, mas cada categoria vira um punhado de números que o treino ajusta. Escolha se: há colunas de categoria com muitos valores (ex.: gênero musical).

- **Botões:** tamanho do embedding 2–16 · largura 64–512 · dropout 0–0,5.
- **Já vem pronto:** tudo da rede densa + construção dos embeddings.
- **Pegadinha:** precisa saber quantos valores diferentes cada categórica tem (número do Bloco 1). Se errado, quebra na hora de prever.
- **O que esperar:** costuma ganhar da densa com categorias grandes. Mesmo código, mesma velocidade.

#### TabNet · *avançada*
Decide em vários passos e em cada um escolhe quais colunas olha. Escolha se: o relatório vai se apoiar em explicar por que o modelo decidiu.

- **Botões:** `n_steps` 3–10 · `n_d`/`n_a` 8–64 (manter iguais) · taxa 2e-2.
- **Já vem pronto:** normalização de entrada e laço de treino (parecido com o da Fase 1).
- **Pegadinha:** `virtual_batch_size` precisa dividir exatamente o `batch_size`.
- **O que esperar:** único que mostra quais colunas usou em cada previsão. Mais botões.

#### Hiperparâmetros completos

A coluna "Padrão" é o que a biblioteca assume sem declaração; ali mora a diferença entre resultado mediano e competitivo. "—" = sem padrão relevante.

**Rede densa (10)**

| Parâmetro | Padrão | Sugerido | O que faz |
|---|---|---|---|
| camadas ocultas | — | 2 | Faixa 1–3; acima disso ganho pequeno, risco de decorar |
| largura das camadas | — | 256 e 128 | Faixa 64–512 |
| ativação | — | ReLU | Faz empilhar camadas valer a pena (Lab 2) |
| dropout | 0.0 | 0.3 | Principal freio ao sobreajuste |
| otimizador | — | AdamW | Memória dos passos anteriores |
| taxa de aprendizado | — | 1e-3 | Rede do zero aceita passo 1000× maior que pré-treinado |
| decaimento de peso | 0.0 | 1e-4 | Puxa pesos para zero; outro freio |
| tamanho do lote | — | 512 | Tabela é leve |
| épocas | — | até 30 | Com parada antecipada por F1-macro |
| padronização | — | obrigatória | Sem a régua, trava |

**Rede densa com embeddings (10)**

| Parâmetro | Padrão | Sugerido | O que faz |
|---|---|---|---|
| cardinalidades | — | obrigatório | Lista com nº de valores de cada categórica; sem isso não roda |
| dim_embedding | — | 8 | Faixa 2–16 |
| camadas ocultas | — | 2 | Igual à densa |
| largura das camadas | — | 256 e 128 | Igual |
| dropout | 0.0 | 0.3 | Igual |
| otimizador | — | AdamW | Igual |
| taxa de aprendizado | — | 1e-3 | Igual |
| decaimento de peso | 0.0 | 1e-4 | Igual |
| tamanho do lote | — | 512 | Igual |
| padronização | — | só nas numéricas | Categóricas entram como índices e viram embeddings |

**TabNet (16)**

| Parâmetro | Padrão | Sugerido | O que faz |
|---|---|---|---|
| n_d / n_a | 8 / 8 | 16 / 16 | Largura da decisão e da atenção; iguais; faixa 8–64 |
| n_steps | 3 | 4 | Passos de decisão; faixa 3–10 |
| gamma | 1.3 | 1.5 | Reaproveitamento de variável entre passos; faixa 1.0–2.0 |
| lambda_sparse | 1e-3 | 1e-3 | Força olhar poucas colunas por passo |
| mask_type | sparsemax | entmax | Como a atenção escolhe colunas; entmax mais estável |
| cat_idxs | [] | obrigatório | Posição de cada coluna de categoria |
| cat_dims | [] | obrigatório | Nº de valores de cada uma; sem os dois, sem embeddings |
| cat_emb_dim | 1 | 2 | Tamanho do embedding de cada categoria |
| taxa de aprendizado | 2e-2 | 2e-2 | A mais alta das três; começa rápido e vai freando |
| agendador | nenhum | StepLR | Reduz taxa em 10% a cada 10 épocas |
| max_epochs | — | 100 | Com parada antecipada |
| patience | — | 15 | Épocas sem melhorar antes de parar |
| batch_size | — | 1024 | O lote de verdade |
| virtual_batch_size | — | 128 | Lote interno da normalização; precisa dividir o batch_size |
| weights | 0 | 1 | Compensa classes desbalanceadas na amostragem |
| métrica de parada | acurácia | F1-macro | Precisa ser registrada à mão |

> *O que é um embedding:* em vez de "gênero número 37", cada gênero ganha um pequeno conjunto de números que o treino ajusta; gêneros parecidos ficam com números parecidos. Mesma ideia das palavras no Cap. 4.

### 2.2 · Laboratório 12 — O mesmo dado, três preparos

Na Fase 1 trocar de modelo mudava uma palavra e o preparo continuava igual. Agora **cada modelo quer a entrada de um jeito**. Célula A para a rede densa:

```python
# categorias viram colunas de 0 e 1
X = pd.get_dummies(X, columns=categoricas)

# a régua é ajustada SÓ no treino
regua = StandardScaler().fit(X_tr)
X_tr = regua.transform(X_tr)
X_va = regua.transform(X_va)
```

Por quê: se uma coluna vai até 200 e outra até 1, a primeira domina sem ter mais importância. Categoria não tem ordem (gênero 7 não é maior que gênero 3), por isso one-hot. (Preparos de embeddings/TabNet: ver tabela acima. Embeddings: categóricas como índices; padroniza só numéricas.)

---

## 03 · Modelar

### 3.1 · A forma do caderno — três células, sempre as mesmas

- **A · Preparo:** carrega, separa treino e validação, transforma a entrada. Única que muda de verdade entre os três modelos.
- **B · Treino:** constrói, configura e treina. Onde ficam as lacunas de hiperparâmetro e a **Zona Livre**.
- **C · Avaliação:** métricas, matriz, curvas. Vem pronta, sem lacuna.

### 3.2 · O laço de treino (célula B, já escrito)

```python
for epoca in range(epocas):                      # uma volta por época
    for lote, resposta in dados_de_treino:       # uma volta por lote = UM ajuste
        otimizador.zero_grad()                   # 1 · apaga ajustes do passo anterior
        saida = modelo(lote)                     # 2 · passagem para frente: o palpite
        erro = perda(saida, resposta)            # 3 · quanto errou
        erro.backward()                          # 4 · propaga o erro para trás
        otimizador.step()                        # 5 · anda na direção, no tamanho da taxa
    perda_val = avaliar(modelo, dados_de_validacao)   # sem aprender aqui
```

Atividade: ordenar as cinco linhas (zerar → para frente → medir o erro → para trás → atualizar). **Trocar duas de lugar roda e não aprende nada, sem erro.** São os 5 quadros do Lab 4. Pergunta da prova: se esquecerem de apagar os ajustes do passo anterior, eles se acumulam e o treino enlouquece.

### 3.3 · Atividade por modelo — caderno `desafio_tabular.ipynb` (rede densa, com lacunas `?????`)

```python
# ═══ CÉLULA A · preparo ═══
X = pd.get_dummies(X, columns=categoricas)
X_tr, X_va, y_tr, y_va = ?????(X, y, test_size=0.2, stratify=?????)   # train_test_split, stratify=y
regua = StandardScaler().fit(?????)                                   # X_tr
X_tr, X_va = regua.transform(X_tr), regua.transform(X_va)

# ═══ CÉLULA B · treino ═══
modelo = RedeDensa(entradas=X_tr.shape[1], saidas=3, dropout=?????)   # ex.: 0.3
# rede do zero aceita passo maior que modelo pré-treinado
otimizador = ?????(modelo.parameters(), lr=?????)                     # AdamW, 1e-3

# ═══ CÉLULA C · avaliação ═══
modelo.?????()                                                        # eval(): desliga o dropout
print(?????(y_va, modelo.predict(X_va), average=?????))               # f1_score, 'macro'
```

(Respostas entre comentários são minhas, deduzidas do contexto; o site só mostra as lacunas.)

### 3.4 · Zona Livre — um ajuste por vez

Dentro da célula B há uma área marcada. O código pronto declara só alguns ajustes; os outros assumem o padrão em silêncio. Só preencher lacunas dá resultado correto e mediano:

```python
modelo = RedeDensa(
# ═══ ZONA LIVRE ═══

# ══════════════════
)
# Out: F1-macro na validação: 0,68
```

**O erro que não dá erro desta trilha:** ajustar a régua dos números com a tabela inteira (não só o treino) melhora a validação e piora na plataforma. É vazamento. Na célula A a régua é ajustada **depois** da separação.

---

## 04 · Avaliar

### 4.1 · As duas curvas

- **Perda de treino:** erro nos exemplos usados para aprender; quase sempre cai (pode ser decoreba).
- **Perda de validação:** erro em exemplos nunca vistos; a que importa.

Leitura: treino e validação caindo juntas = aprendendo. Treino cai e validação sobe = começou a decorar. As duas paradas altas = modelo simples demais ou passo pequeno demais.

### 4.2 · Laboratório — Diagnóstico de curvas

Quatro treinos para classificar: Treino saudável · Sobreajuste · Subajuste · Taxa de aprendizado alta demais.

**O que fazer em cada caso**
- *Sobreajuste:* parar antes (parada antecipada), aumentar dropout, diminuir a rede ou conseguir mais dados (inclusive aumento de dados, Cap. 3).
- *Subajuste:* aumentar capacidade, aumentar a taxa ou dar mais épocas; conferir se as entradas estão padronizadas.
- *Taxa alta demais:* dividir a taxa por 10 e rodar de novo (primeira coisa a tentar quando a curva serrilha ou sobe).
- *Validação fácil demais:* validação abaixo do treino o tempo todo = separação mal feita ou vazamento.

### 4.3 · Matriz de confusão

A métrica diz quanto errou; a matriz diz **com o que confundiu o quê**. Classes que se confundem muito costumam ter algo em comum nos dados (material para o relatório). Ler em **proporção**, não em contagem: com classes de tamanhos diferentes, 40 erros numa classe grande podem ser menos graves que 12 numa pequena.

### 4.4 · A decisão — custo contra ganho

A pergunta final não é qual modelo acerta mais, mas **quanto cada ponto a mais custou**. Um modelo que ganha 1% e leva 4× mais tempo é uma escolha, não uma vitória automática; explicar no relatório vale nota.

### Prova final do Capítulo 2 (sem gabarito)

1. Chute preguiçoso: 82% de acurácia e 0,45 de F1-macro; seu modelo: 0,47. O que significa? (mal superou quem não olha os dados / métrica errada / sobreajustado / excelente)
2. Qual dos três modelos tabulares dispensa a régua nas numéricas? (embeddings / todos precisam / TabNet / densa)
3. Perda de treino cai e a de validação sobe? (aprendendo bem / começou a decorar / falta padronizar / taxa baixa)
4. No laço, esquecer de apagar os ajustes do passo anterior? (nada / se acumulam e o treino enlouquece / erro / mais rápido)
