# Revisão dos complementos · Texto

20 itens escritos pelo autor do guia, que **não** vêm do material da OIAA e aparecem no site com a etiqueta "complemento".

Para cada item: marque `[x]` se estiver correto; se precisar mudar, escreva o texto certo em **Correção**; para cortar, escreva `CORTAR` em Correção.

## DistilBERT multilíngue

### identificador  `distilbert-multilingual-identificador`

**No material:** sugerido distilbert-base-multilingual-cased. O nome que carrega o modelo. O tokenizador (o "tradutor" do material) sai deste mesmo nome.

- [ ] **Erro comum:** Trocar o nome do modelo e esquecer o do tokenizador: roda e o resultado despenca, sem erro.
  - Correção:

### taxa de aprendizado  `distilbert-multilingual-taxa`

**No material:** sugerido 3e-5 a 5e-5. Tolera um passo um pouco maior que os outros dois desta trilha.

- [ ] **Se subir:** Acima de 5e-5 o ajuste fino fica instável e a validação pode despencar.
  - Correção:
- [ ] **Se baixar:** Mais estável, mas pode não chegar ao melhor ponto em 3 épocas.
  - Correção:

### épocas  `distilbert-multilingual-epocas`

**No material:** sugerido 3 a 4. Acima disso começa a decorar.

- [ ] **Se subir:** A validação costuma atingir o melhor ponto na 2ª ou 3ª época; depois só piora.
  - Correção:

### max_length  `distilbert-multilingual-max-length`

**No material:** sugerido 128. Quantos pedaços de palavra o modelo lê por texto; o resto é cortado. 128 cobre a maioria das avaliações. O teto da arquitetura é 512.

- [ ] **Se subir:** Perde menos texto, mas treina mais devagar e usa mais memória.
  - Correção:
- [ ] **Se baixar:** Mais rápido, porém corta o final de avaliações longas.
  - Correção:

### limpeza do texto  `distilbert-multilingual-limpeza`

**No material:** sugerido nenhuma. Sem tirar acento, pontuação ou palavra comum. O tokenizador cuida disso.

- [ ] **Erro comum:** Aplicar a limpeza da Fase 1 (minúsculas, sem acento, sem stopwords): destrói informação que o modelo usa.
  - Correção:

## BERTimbau

### identificador  `bertimbau-identificador`

**No material:** sugerido neuralmind/bert-base-portuguese-cased. O sufixo cased avisa que ele usa maiúsculas e acentos. O tokenizador (o "tradutor" do material) sai deste mesmo nome.

- [ ] **Erro comum:** Carregar o tokenizador do DistilBERT com os pesos do BERTimbau: roda e o resultado despenca, sem erro.
  - Correção:

### taxa de aprendizado  `bertimbau-taxa`

**No material:** sugerido 2e-5. Faixa estreita. Quase todo trabalho da área usa entre 1e-5 e 5e-5.

- [ ] **Se subir:** Passo grande demais apaga o português que o modelo já sabe.
  - Correção:
- [ ] **Se baixar:** Mais seguro, mas o ajuste pode ficar curto em 3 épocas. Mexa pouco.
  - Correção:

### do_lower_case  `bertimbau-do-lower-case`

**No material:** sugerido False. Obrigatório. Passar o texto para minúsculas destrói informação que o modelo usa.

- [ ] **Erro comum:** Deixar `True` ou aplicar `.lower()` no texto antes de tokenizar, como se fazia na Fase 1.
  - Correção:

### max_length  `bertimbau-max-length`

**No material:** sugerido 128. Padrão da trilha.

- [ ] **Se subir:** Perde menos texto, mas treina mais devagar e usa mais memória.
  - Correção:
- [ ] **Se baixar:** Mais rápido, porém corta o final de avaliações longas.
  - Correção:

### semente  `bertimbau-semente`

**No material:** sugerido fixa. O ajuste fino de BERT varia entre execuções. A semente precisa ser a mesma para todas as equipes.

- [ ] **Erro comum:** Comparar duas execuções com sementes diferentes e achar que uma configuração é melhor que a outra.
  - Correção:

## XLM-RoBERTa

### identificador  `xlm-roberta-identificador`

**No material:** sugerido xlm-roberta-base. O tokenizador (o "tradutor" do material) sai deste mesmo nome.

- [ ] **Erro comum:** Trocar o nome do modelo e esquecer o do tokenizador: roda e o resultado despenca, sem erro.
  - Correção:

### taxa de aprendizado  `xlm-roberta-taxa`

**No material:** sugerido 1e-5 a 2e-5. A menor da trilha: é o modelo que mais diverge.

- [ ] **Se subir:** O treino diverge: a curva sobe e o F1 despenca.
  - Correção:
- [ ] **Se baixar:** Mais estável; é a primeira coisa a tentar se o treino divergir.
  - Correção:

### aquecimento  `xlm-roberta-aquecimento`

**No material:** padrão 0 · sugerido mais longo que 10%. É o modelo que mais se beneficia de começar devagar.

- [ ] **Se baixar:** Sem aquecimento longo, o início do treino pode divergir.
  - Correção:

### token inicial  `xlm-roberta-token-inicial`

**No material:** sugerido <s>. O XLM-RoBERTa abre a sequência com <s> e fecha com </s>, outra convenção que a dos BERTs. As classes automáticas resolvem isso sozinhas.

- [ ] **Nota:** Diverge do material: a ficha da OIAA cita [CLS], mas na documentação do Hugging Face (XLMRobertaTokenizer) o token de classificação é <s>.
  - Correção:
- [ ] **Erro comum:** Escrever o token inicial à mão, ou usar [CLS] como nos BERTs. Use as classes automáticas.
  - Correção:
