# Capítulo 4 · Linguagem natural

Na Fase 1 o texto virava número contando palavras: palavra nunca vista sumia e erro de digitação virava palavra desconhecida. Isso acabou. Abas: **Explorar · Configurar · Modelar · Avaliar**.

Problema de exemplo: classificação **binária** de avaliações de produto (a pessoa recomenda ou não), com F1-macro como métrica principal e recall de apoio.

---

## 01 · Explorar

### 1.1 · Pedaços de palavra — três tradutores, uma frase

Cada modelo parte o texto à sua maneira, em **pedaços de palavra** (tokens), não em palavras. **Laboratório 16 — Três tradutores:** digite frases (comum, com erro de digitação, com gíria). Exemplo "o produto chegou rapidinho e desencapado":

| Tokenizador | Pedaços |
|---|---|
| DistilBERT multilíngue (8) | o · produto · chegou · rapid · ##inho · e · desencap · ##ado |
| BERTimbau (6) | o · produto · chegou · rapidinho · e · desencapado |
| XLM-RoBERTa (8) | ▁o · ▁produto · ▁chegou · ▁rapid · ##inho · ▁e · ▁desencap · ##ado |

Pedaços com `##` são continuações de palavra. O modelo treinado em português parte menos (conhece mais palavras nossas inteiras): treino mais rápido, menos informação perdida. *(Simulação didática; os tokenizadores reais têm dezenas de milhares de pedaços.)*

**Por que isso resolve o problema da Fase 1:** "rapidinho" fora da lista era jogada fora; agora vira `rapid` + `inho`, ambos conhecidos. O modelo entende palavra nunca vista porque entende as partes. Por isso **não se remove mais pontuação, acento nem palavra comum**.

### 1.2 · Laboratório 17 — Quanto cabe em 128 pedaços

O modelo lê um número fixo de pedaços e corta o resto. Mover o limite tem preço dos dois lados (texto perdido vs. tempo de treino). Com limite 128: **16% das avaliações perdem o final**, tempo ~1,0× do de 128; faixa razoável. 128 é o padrão do caderno por ser meio-termo (teto arquitetural: 512).

---

## 02 · Configurar

### 2.1 · Os três modelos — trocar de modelo é trocar uma string

O tokenizador e o modelo são carregados pelo **mesmo nome**; trocar a string traz o tokenizador certo junto.

> **Regra que não pode ser quebrada:** tokenizador e modelo têm que ter o mesmo nome. Trocar um e esquecer o outro roda e o resultado despenca, sem mensagem de erro. É o erro campeão desta trilha.

#### DistilBERT multilíngue · *entrada*
Modelo grande encolhido para metade das camadas, imitando o original. Escolha se: quer espaço para testar várias configurações.
- **Botões:** taxa 3e-5 a 5e-5 (tolera passo maior) · lote 32 ou 64 · épocas 3–4 (mais decora).
- **Já vem pronto:** tokenizador (mesmo nome).
- **Pegadinha:** fala 104 idiomas e nenhum muito bem; perde para o especialista em português, e medir essa perda é parte do trabalho.
- **O que esperar:** ~2× mais rápido que os outros. Bom para as primeiras tentativas.

#### BERTimbau · *especialista*
Treinado só em português brasileiro (textos da web do Brasil). Escolha se: quer o melhor resultado pelo menor risco. Escolha natural da trilha.
- **Botões:** taxa **2e-5** (faixa estreita) · lote 32 · épocas 3.
- **Já vem pronto:** tokenizador que conhece palavras nossas inteiras.
- **Pegadinha:** diferencia maiúscula/minúscula e usa acentos. **Não passar o texto para minúsculas** (destrói informação que ele usa).
- **O que esperar:** tende a dar o melhor número, sem nada conceitualmente novo.

#### XLM-RoBERTa · *avançada*
Generalista treinado em 2,5 TB de texto em cem idiomas. Escolha se: quer testar se muito mais treino compensa não ser especialista.
- **Botões:** taxa 1e-5 a 2e-5 (a menor; o mais instável) · lote 16 ou 32 · aquecimento mais longo.
- **Já vem pronto:** tokenizador com 250 mil pedaços.
- **Pegadinha:** não é mais fundo que o BERTimbau (mesmas 12 camadas); é mais pesado pelo vocabulário gigante (~192 dos 270 M de pesos).
- **O que esperar:** o mais pesado e mais sensível à taxa; pode ganhar, pode divergir.

#### Hiperparâmetros completos

**DistilBERT multilíngue (12)**

| Parâmetro | Padrão → Sugerido | Nota |
|---|---|---|
| identificador | `distilbert-base-multilingual-cased` | Tokenizador sai deste mesmo nome |
| arquitetura | 6 camadas · 768 | ~134 M de pesos |
| taxa | 3e-5 a 5e-5 | Tolera passo maior |
| lote | 32 ou 64 | O mais leve |
| épocas | 3 a 4 | Acima decora |
| otimizador | AdamW | Padrão da trilha |
| decaimento de peso | 0.01 | Padrão da trilha |
| aquecimento | 0 → 10% dos passos | Padrão da trilha |
| max_length | 128 | Cobre a maioria das avaliações |
| preenchimento | fixo → dinâmico por lote | Preencher só até o maior texto do lote economiza tempo |
| precisão mista | desligada → ligada | Padrão da trilha |
| limpeza do texto | nenhuma | Sem tirar acento/pontuação/palavra comum |

**BERTimbau (12)**

| Parâmetro | Padrão → Sugerido | Nota |
|---|---|---|
| identificador | `neuralmind/bert-base-portuguese-cased` | `cased` = usa maiúsculas e acentos |
| arquitetura | 12 camadas · 768 | ~110 M de pesos |
| taxa | 2e-5 | Faixa de 1e-5 a 5e-5 na área |
| lote | 32 | Padrão da trilha |
| épocas | 3 | Padrão para ajuste fino de BERT |
| otimizador | AdamW, eps 1e-8 | Padrão da trilha |
| decaimento de peso | 0.01 | Padrão da trilha |
| aquecimento | 0 → 10% dos passos | Padrão da trilha |
| dropout | 0.1 → 0.1 | **Não alterar**: valor do pré-treino |
| do_lower_case | False | **Obrigatório** |
| max_length | 128 | Padrão da trilha |
| semente | fixa | Ajuste fino de BERT varia entre execuções; mesma semente para todas as equipes |

**XLM-RoBERTa (12)**

| Parâmetro | Padrão → Sugerido | Nota |
|---|---|---|
| identificador | `xlm-roberta-base` | Tokenizador sai deste nome |
| arquitetura | 12 camadas · 768 | ~270 M de pesos, maior parte é vocabulário |
| vocabulário | 250 mil pedaços | ~192 dos 270 M de pesos |
| taxa | 1e-5 a 2e-5 | A menor; o que mais diverge |
| lote | 16 ou 32 | Depende da memória |
| épocas | 3 | Padrão da trilha |
| otimizador | AdamW | Padrão da trilha |
| aquecimento | 0 → mais longo que 10% | Mais beneficiado por começar devagar |
| max_length | 128 | Padrão da trilha |
| precisão mista | desligada → ligada | Faz diferença real |
| token inicial | `[CLS]` | Outra convenção; classes automáticas resolvem |
| estabilidade | a menor dos três | Se divergir, baixe a taxa primeiro |

---

## 03 · Modelar

### 3.1 · Atividade por modelo — `desafio_texto.ipynb` (DistilBERT, lacunas `?????`)

```python
# ═══ CÉLULA A · preparo ═══
NOME = "distilbert-base-multilingual-cased"      # esta linha troca de modelo
tradutor = AutoTokenizer.from_pretrained(?????)  # NOME
modelo = AutoModelForSequenceClassification.from_pretrained(NOME, num_labels=2)
entradas = tradutor(textos, truncation=True, max_length=?????)   # 128 (Lab 17)

# ═══ CÉLULA B · treino ═══
otimizador = ?????(modelo.parameters(), lr=5e-5)  # AdamW
epocas = 3 # acima disso, começa a decorar

# ═══ CÉLULA C · avaliação ═══
modelo.?????()                                    # eval
print(?????(y_va, previsoes, average=?????))      # f1_score, 'macro'
```

### 3.2 · Caça ao erro

```python
NOME = "neuralmind/bert-base-portuguese-cased"
tradutor = AutoTokenizer.from_pretrained("distilbert-base-multilingual-cased")  # <- culpada: outro nome
modelo = AutoModelForSequenceClassification.from_pretrained(NOME, num_labels=2)
entradas = tradutor(textos, truncation=True, max_length=128)
treinador.train()
```

### 3.3 · Zona Livre

Só as lacunas: F1-macro **0,82** na validação ("o pré-treinado já resolve boa parte sozinho"). Resto: ajustes um por vez.

---

## 04 · Avaliar

### 4.1 · Justiça — com quem o modelo erra mais

**Laboratório 18 — F1 por grupo.** O modelo pode ir bem na média e mal com um grupo, e o F1-macro esconde isso. Exemplo: **0,88 no geral e 0,58 quando a pessoa usa ironia**. "Uma tabela assim no relatório de vocês vale mais do que dois centésimos a mais na métrica." A ética do Cap. 1 vira tabela calculada. Modelo com F1-macro alto e buraco num grupo ainda não está pronto.

### 4.2 · As duas curvas em texto

Treino curto: 3 (às vezes 4) épocas. A validação atinge o melhor ponto quase sempre na 2ª ou 3ª época e depois só piora. O ajuste fino ensina a **tarefa**, não a língua. Casos: *o caso comum* · *taxa alta demais* · *poucas épocas*. Sem parada antecipada e checkpoint entregariam o modelo da 4ª época, o pior dos quatro.

### 4.3 · Matriz de confusão binária

- **Falso negativo:** a pessoa não recomendava e o modelo disse que sim (em moderação, o caso problemático que passou).
- **Falso positivo:** a pessoa recomendava e o modelo disse que não (alarme falso; menos grave aqui, muito grave em outros contextos).

*(A página trata como "positiva" a classe problemática, quem não recomenda. Se o seu desafio usar outra classe como positiva, os nomes se invertem.)*

Qual custa mais? Não há resposta técnica; depende do que o sistema faz com a previsão, e quem decide é gente.

### 4.4 · Métricas da trilha

- **Principal: F1-macro** — ordena o ranking nas três trilhas.
- **Apoio: Recall** — dos casos que existiam, quantos o modelo achou. Só desempata; senão bastaria responder a classe positiva em tudo.

### Prova final do Capítulo 4 (sem gabarito)

1. Por que não se remove mais pontuação e acento? (a métrica mudou / o tokenizador cuida e usa essa informação / texto curto / dá trabalho)
2. Trocaram o modelo e esqueceram o tokenizador? (compatíveis / roda e o resultado despenca / treino lento / erro imediato)
3. F1-macro 0,88 geral e 0,58 em ironia. No relatório? (trocar de métrica / só o 0,88 / remover ironia / reportar os dois e explicar onde falha)
4. Por que recall da classe positiva não serve como métrica principal? (difícil de calcular / bastaria responder positiva em tudo / varia demais / sem relação)
