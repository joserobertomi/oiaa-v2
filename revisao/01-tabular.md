# Revisão dos complementos · Tabelas

35 itens escritos pelo autor do guia, que **não** vêm do material da OIAA e aparecem no site com a etiqueta "complemento".

Para cada item: marque `[x]` se estiver correto; se precisar mudar, escreva o texto certo em **Correção**; para cortar, escreva `CORTAR` em Correção.

## Rede densa

### camadas ocultas  `rede-densa-camadas`

**No material:** sugerido 2 · faixa 1 a 3. Quantas camadas de neurônios ficam entre a entrada e a saída. Acima de 3 o ganho é pequeno e o risco de decorar cresce.

- [ ] **Se subir:** Mais capacidade, mas também mais chance de decorar o treino e mais tempo de treino.
  - Correção:
- [ ] **Se baixar:** Modelo mais simples; se as duas curvas ficarem paradas no alto, é sinal de subajuste.
  - Correção:

### largura das camadas  `rede-densa-largura`

**No material:** sugerido 256 e 128 · faixa 64 a 512. Quantos neurônios há em cada camada. Mais largo aprende padrões mais finos e decora mais fácil.

- [ ] **Se subir:** Aprende detalhes mais finos; a distância entre treino e validação tende a crescer.
  - Correção:
- [ ] **Se baixar:** Mais difícil de decorar; se ficar simples demais, não aprende o suficiente.
  - Correção:

### ativação  `rede-densa-ativacao`

**No material:** sugerido ReLU. A conta que decide o que sai de cada neurônio. É ela que faz empilhar camadas valer a pena: sem ativação, várias camadas viram uma só.

- [ ] **Erro comum:** Usar ativação linear nas camadas escondidas. A rede continua rodando, mas se comporta como uma reta.
  - Correção:

### dropout  `rede-densa-dropout`

**No material:** padrão 0.0 · sugerido 0.3 · faixa 0 a 0,5. Desliga neurônios ao acaso durante o treino. É o principal freio ao sobreajuste desta rede. Comecem em 0,3.

- [ ] **Se subir:** Mais freio ao sobreajuste; passando de 0,5 a rede passa a aprender de menos.
  - Correção:
- [ ] **Se baixar:** Menos freio: se a validação sobe enquanto o treino cai, aumente o dropout.
  - Correção:
- [ ] **Erro comum:** Esquecer de desligar o dropout na avaliação (modelo.eval()): a métrica muda a cada execução.
  - Correção:

### taxa de aprendizado  `rede-densa-taxa`

**No material:** sugerido 1e-3. O tamanho do passo do ajuste. Uma rede treinada do zero aceita um passo mil vezes maior que um modelo pré-treinado.

- [ ] **Se subir:** Aprende mais rápido, mas a curva de perda pode serrilhar ou subir.
  - Correção:
- [ ] **Se baixar:** Mais estável, porém exige mais épocas para chegar ao fundo.
  - Correção:
- [ ] **Erro comum:** Copiar a taxa de um modelo pré-treinado (1e-4 ou menor): esta rede começa do zero e fica lenta demais.
  - Correção:

### decaimento de peso  `rede-densa-decaimento`

**No material:** padrão 0.0 · sugerido 1e-4. Puxa os pesos levemente para zero a cada passo. É outro freio ao sobreajuste.

- [ ] **Se subir:** Freia mais o sobreajuste; muito alto deixa a rede simples demais.
  - Correção:

### tamanho do lote  `rede-densa-lote`

**No material:** sugerido 512. Quantos exemplos o modelo vê antes de ajustar os pesos uma vez. Tabela é leve: cabe lote grande, e o treino fica rápido.

- [ ] **Se subir:** Treino mais rápido, com ajustes em saltos maiores.
  - Correção:
- [ ] **Se baixar:** Mais passos por época e curva mais irregular.
  - Correção:

### épocas  `rede-densa-epocas`

**No material:** sugerido até 30. Quantas vezes o modelo percorre o treino inteiro. Com parada antecipada por F1-macro, raramente precisa das 30.

- [ ] **Erro comum:** Rodar as 30 sem parada antecipada: o modelo passa do melhor ponto e começa a decorar.
  - Correção:

### padronização  `rede-densa-padronizacao`

**No material:** sugerido obrigatória. Colocar as colunas numéricas na mesma escala. Sem a régua nas colunas numéricas, este modelo trava: é a única das três que não perdoa isso.

- [ ] **Erro comum:** Ajustar a régua com a tabela inteira. Isso é vazamento: ajuste só no treino, depois da separação.
  - Correção:

## Rede densa com embeddings

### cardinalidades  `rede-densa-embeddings-cardinalidades`

**No material:** sugerido obrigatório. Uma lista com quantos valores diferentes cada coluna de categoria tem. Sem isso, o modelo não roda.

- [ ] **Erro comum:** Contar errado (ou só no treino). O número certo vem do Bloco 1; se estiver errado, quebra na hora de prever.
  - Correção:

### tamanho do embedding (dim_embedding)  `rede-densa-embeddings-dim-embedding`

**No material:** sugerido 8 · faixa 2 a 16. Quantos números o modelo aprende para representar cada categoria. Pequeno já resolve.

- [ ] **Se subir:** Representa a categoria com mais detalhe, mas cada embedding passa a decorar mais fácil.
  - Correção:
- [ ] **Se baixar:** Representação mais enxuta; para categorias com poucos valores, 2 a 4 costuma bastar.
  - Correção:

### padronização  `rede-densa-embeddings-padronizacao`

**No material:** sugerido só nas numéricas. As colunas de categoria já entram como índices e viram embeddings; a régua vale apenas para as numéricas.

- [ ] **Erro comum:** Padronizar também os índices das categorias: o número de uma categoria não tem ordem nem escala.
  - Correção:

## TabNet

### n_d / n_a  `tabnet-n-d-n-a`

**No material:** padrão 8 / 8 · sugerido 16 / 16 · faixa 8 a 64. Largura da decisão (n_d) e da atenção (n_a). A documentação pede que sejam iguais.

- [ ] **Se subir:** Mais capacidade e mais tempo de treino.
  - Correção:
- [ ] **Erro comum:** Usar valores diferentes para n_d e n_a. Mantenha os dois iguais.
  - Correção:

### n_steps  `tabnet-n-steps`

**No material:** padrão 3 · sugerido 4 · faixa 3 a 10. Quantos passos de decisão o modelo dá. Mais passos, mais capacidade e mais tempo de treino.

- [ ] **Se subir:** Mais capacidade para padrões complexos; mais risco de decorar e treino mais lento.
  - Correção:
- [ ] **Se baixar:** Modelo mais rápido e mais simples.
  - Correção:

### gamma  `tabnet-gamma`

**No material:** padrão 1.3 · sugerido 1.5 · faixa 1.0 a 2.0. O quanto uma variável pode ser reaproveitada entre os passos.

- [ ] **Se subir:** Cada coluna tende a ser usada em menos passos; o modelo fica mais seletivo.
  - Correção:
- [ ] **Se baixar:** A mesma coluna pode aparecer em vários passos.
  - Correção:

### lambda_sparse  `tabnet-lambda-sparse`

**No material:** padrão 1e-3 · sugerido 1e-3. Força o modelo a olhar poucas colunas por passo. Quanto maior, mais seletivo.

- [ ] **Se subir:** Olha menos colunas e fica mais fácil de explicar; se subir demais, perde sinal útil.
  - Correção:

### cat_idxs  `tabnet-cat-idxs`

**No material:** padrão [] · sugerido obrigatório. A posição de cada coluna de categoria na tabela. Sem cat_idxs e cat_dims, os embeddings não são criados.

- [ ] **Erro comum:** Deixar a lista vazia. O modelo roda, mas trata as categorias como números comuns.
  - Correção:

### cat_dims  `tabnet-cat-dims`

**No material:** padrão [] · sugerido obrigatório. Quantos valores diferentes cada coluna de categoria tem. Sem cat_idxs e cat_dims, os embeddings não são criados.

- [ ] **Erro comum:** Contar na ordem errada: a lista precisa seguir a mesma ordem de cat_idxs.
  - Correção:

### taxa de aprendizado  `tabnet-taxa`

**No material:** padrão 2e-2 · sugerido 2e-2. A mais alta das três opções: este modelo foi feito para começar rápido e ir freando.

- [ ] **Se subir:** Pode divergir; a curva sobe em vez de descer.
  - Correção:
- [ ] **Se baixar:** Mais estável, mas combina melhor com um agendador e mais épocas.
  - Correção:

### patience  `tabnet-patience`

**No material:** sugerido 15. Quantas épocas sem melhorar a validação antes de parar o treino.

- [ ] **Se subir:** Dá mais chance de recuperar, mas gasta mais tempo.
  - Correção:
- [ ] **Se baixar:** Para antes; pode interromper um treino que ainda ia melhorar.
  - Correção:

### virtual_batch_size  `tabnet-virtual-batch-size`

**No material:** sugerido 128. O lote interno usado na normalização. Precisa dividir o batch_size exatamente, senão dá erro.

- [ ] **Erro comum:** Mudar o batch_size e esquecer este valor. Com batch_size 1024, 128 serve (1024 ÷ 128 = 8); com 1000, não.
  - Correção:

### métrica de parada  `tabnet-metrica-parada`

**No material:** padrão acurácia · sugerido F1-macro. A métrica que a parada antecipada vigia. Precisa ser registrada à mão: não vem pronta na biblioteca.

- [ ] **Erro comum:** Deixar a acurácia, que premia o chute preguiçoso em problemas desbalanceados. O ranking usa F1-macro.
  - Correção:
