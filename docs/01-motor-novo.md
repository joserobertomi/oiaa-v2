# Capítulo 1 · O motor novo

Vocês já treinaram modelos (árvore, floresta, regressão) com lógica que dava para desenhar no papel. Agora o modelo é uma rede neural e chega **já treinado por alguém**. Quatro abas: Ética · A rede por dentro · Como ela aprende · A sala de controle.

---

## Aba 1 · Ética

### 1.1 · O modelo que vocês vão usar não é de vocês

Na Fase 1 o modelo começava vazio. Na Fase 2 vocês baixam um modelo treinado por outra equipe, em outro país, com milhões de fotos ou textos que ninguém da equipe escolheu. Isso torna a fase possível com poucos dados, mas traz três problemas:

- **Ele herda o que estava torto.** Se o material original tinha mais de um tipo de coisa que de outro, o modelo chega inclinado. O treino de vocês por cima não apaga isso.
- **Ele erra com confiança.** "97% de certeza" não é promessa: é uma conta interna e pode estar muito enganada.
- **Ele pode acertar pelo motivo errado.** Dá para ir bem olhando o lugar errado da foto, e a métrica não mostra (ver Cap. 3, Lab 15).

### 1.2 · Laboratório 1 — De onde vieram os pesos

Modelo treinado com fotos de uma cooperativa com luz e câmera boas, usado em outra com luz fraca e celular antigo. Controle: "% das fotos do treino que vieram do lugar A" (exemplo: 90%).

Resultado com 90%: "Ainda desequilibrado. 22 pontos de diferença entre os grupos é muito para um sistema que vai decidir sobre pessoas ou sobre o trabalho delas. Vale reportar os dois números, não só a média."

**A média engana:** o número geral pode ficar bonito enquanto um grupo inteiro vai mal. Por isso o Cap. 4 tem o laboratório de desempenho por grupo e por isso o relatório vale nota.

### 1.3 · Laboratório — Confiar ou desconfiar?

Assistentes produzem a resposta mais provável, não a mais verdadeira. Três respostas para julgar:

1. Confiança 96%: "A capital da Austrália é Sydney." → desconfiar.
2. Confiança 91%: "Este código está correto e vai rodar sem erros." `modelo.fit(X_treino)` → desconfiar.
3. Confiança 88%: "Uma imagem de 224 por 224 pixels coloridos tem 150.528 números." → pode confiar (224·224·3 = 150.528).

(Vereditos inferidos do conteúdo; a página só mostra os botões.)

**Regra prática da fase:** usar IA generativa como apoio é permitido, mas é preciso entender e conferir tudo. O relatório tem que descrever esse uso. Entregar código que ninguém da equipe sabe explicar é o caminho mais rápido para perder pontos.

### 1.4 · Três pontos que vão para o relatório

- **Opacidade — 86 milhões de números não se explicam.** Uma árvore dá para desenhar; um modelo profundo, não. Dá para dizer quanto acerta, é muito mais difícil dizer por quê. Técnicas (Cap. 3) mostram onde o modelo olhou, não o raciocínio.
- **Licença — base de dados tem dono e regra.** Uma das bases da fase só pode ser usada sem fim comercial e exige citar a origem. Publicar modelo treinado com dados que não permitem o uso é problema jurídico.
- **Energia — treinar tem preço ambiental.** O modelo mais caro gasta 4× mais por imagem que o mais barato. Escolher o menor quando ele resolve é decisão técnica e ética, e no relatório uma escolha justificada por custo pesa tanto quanto uma por métrica.

---

## Aba 2 · A rede por dentro

### 2.1 · Um neurônio é uma conta com botões

Multiplica cada entrada por um peso, soma tudo, acrescenta um deslocamento (bias) e passa por uma função de ativação.

**Laboratório 2 — Um neurônio ao vivo.** Controles: X₁ (0,8), X₂ (0,3), W₁ (1,0), W₂ (−0,5), deslocamento B (0,0), ativação ReLU / Sigmoide / Nenhuma (linear). Exemplo de saída: soma 0,65 → saída 0,65 (linear). O peso mais grosso na tela é o que mais pesa.

Sem ativação (linear), a saída vira uma reta; duas camadas lineares empilhadas dão o mesmo que uma. A ativação dobra a linha e é isso que faz empilhar camadas valer a pena.

### 2.2 · Laboratório 3 — Monte a sua rede (o mais importante do capítulo)

Arquitetura escrita como lista: `3, 5, 4, 2` = 3 entradas, camadas escondidas de 5 e 4, 2 saídas. Controles: tarefa (Classificação/Regressão), dropout nas camadas escondidas (0–…%), sortear pesos, religar neurônios. Clicar num neurônio mostra o valor emitido e permite mexer nos pesos de entrada. Exemplo: `3,5,4,2` tem 54 pesos ajustáveis.

- **Classificação:** um neurônio por classe na última camada; **softmax** converte em porcentagens que somam 100%; vence a maior.
- **Regressão:** um neurônio só, sem softmax; o número que sai é a resposta (preço, temperatura, duração).
- **Dropout:** desliga neurônios ao acaso **só durante o treino**. Esquecer de desligar na validação é erro clássico: a métrica muda de valor a cada execução sem motivo aparente.

### 2.3 · Quatro redes de verdade

| Nome | Arquitetura | Nota |
|---|---|---|
| Mínima | `2, 1` | O neurônio do Lab 2 como rede |
| Classificador simples | `4, 6, 3` | Quatro medidas, três classes (forma das redes do Cap. 2) |
| Mais funda | `8, 16, 12, 8, 4` | Mais capacidade, mais chance de decorar |
| Regressão | `5, 8, 1` | Termina em um neurônio |

---

## Aba 3 · Como ela aprende

### 3.1 · A conta do erro (função de perda)

- **Classificação · entropia cruzada:** olha a porcentagem dada à classe certa. 90% → erro pequeno; 5% → enorme. Errar com confiança alta é punido mais que errar em cima do muro.
- **Regressão · erro quadrático:** diferença ao quadrado. Errar por 10 custa 100× mais que errar por 1.

### 3.2 · Laboratório 4 — Backpropagation, quadro a quadro

Cinco passos repetidos milhares de vezes:

1. Entra um exemplo
2. Passagem para frente
3. Mede o erro
4. Propaga o erro para trás
5. Atualiza os pesos

Backpropagation descobre a **direção** (quanto cada peso contribuiu para o erro). O **tamanho** do passo é outra decisão (taxa de aprendizado).

### 3.3 · Laboratório 5 — Taxa de aprendizado e épocas (descida de gradiente)

Descer a montanha no escuro: o backpropagation dá a direção; a taxa é o tamanho do passo; as épocas são quantos passos você tem. Os dois se compensam. Controles: taxa (0,20), épocas (12), ponto de partida.

Resultado exemplo: "Passo bom. Chega ao fundo e fica lá. Épocas a mais não melhoram nada — para isso existe a parada antecipada."

**Guardem:** nos modelos da fase a taxa varia de **0,00001 a 0,02** (mil vezes). Modelo grande já treinado precisa de passo minúsculo para não estragar o que sabia.

### 3.4 · Laboratório 6 — Época, lote e passo

- **Época:** uma passada completa por todos os exemplos.
- **Lote:** exemplos vistos antes de ajustar os pesos uma vez.
- **Passo:** cada ajuste. Passos = lotes × épocas.

Exemplo: 40 exemplos, lote 8, 3 épocas → 5 passos por época. "Lote menor, mais passos. Lote grande corre mais rápido e aprende aos trancos maiores."

### 3.5 · Laboratório 7 — Transferência de aprendizado (do zero ou a partir de pesos)

Os modelos de imagem já viram mais de 1 milhão de fotos; sabem borda, textura, brilho, curva. Falta ensinar as classes. Com 1.500 imagens, treinar do zero vs. pré-treinado difere em **37 pontos**: do zero com pouca imagem não funciona. 1.500 imagens é o tamanho de base da trilha de visão.

---

## Aba 4 · A sala de controle

### 4.1 · As quatro peças que já vêm no código

- **Otimizador:** como cada peso muda depois que o backprop deu a direção. O **AdamW** guarda memória dos passos anteriores (acelera onde a descida é consistente, freia onde é irregular).
- **Agendador da taxa:** diminui o passo ao longo do treino (grande no começo, pequeno no fim).
- **Parada antecipada:** vigia a validação; se não melhora por algumas épocas, interrompe.
- **Ponto de verificação (checkpoint):** salva o modelo da **melhor** época, não da última. Sem ele, a parada antecipada entrega o modelo de quando já piorava, e sessão que cai leva tudo.

### 4.2 · Laboratório 8 — A sala de controle

Mesmo modelo/dados/semente; liga e desliga as quatro peças. Exemplo: o AdamW desce mais rápido que o otimizador simples; com agendador a curva fica lisa; com parada antecipada o treino para na época 19 em vez de 30; o checkpoint entrega a melhor época.

### 4.3 · O que vocês ajustam — quatro botões, e só quatro

**Nível 1 · vocês ajustam**
- Taxa de aprendizado
- Épocas
- Tamanho do lote
- Freio do sobreajuste (dropout, poda, regularização; muda de nome em cada modelo)

**Nível 2 · vocês veem no código:** otimizador, agendador, parada antecipada, checkpoint (comentados no caderno).

**Nível 3 · já vem configurado:**
- *Precisão mista:* números menores na conta; cabe na memória e roda mais rápido.
- *Aquecimento:* passos minúsculos no início para o modelo não se perder.
- *Suavização de rótulo:* nunca ter 100% de certeza; melhora em dados novos e conversa com o excesso de confiança da aba de ética.

### 4.4 · Laboratório 9 — O ambiente com GPU

Três coisas dão errado ali; o lab as comete de propósito. Caderno `desafio_fase2.ipynb`:

```python
import torch
torch.cuda.is_available()        # False -> "CPU · sem GPU"

dispositivo = "cuda" if torch.cuda.is_available() else "cpu"
modelo = modelo.to(dispositivo)  # "modelo ficou na CPU · o treino vai levar horas"

treinar(modelo, epocas=10)       # "época 1/10 · estimativa: 3h 40min"
```

Sem GPU o caderno roda e demora horas: **confira o tipo de ambiente antes de tudo**. Também há botões "A sessão caiu" e "Salvar ponto de verificação" (perder a sessão sem checkpoint leva o treino embora).

### Prova final do Capítulo 1 — sete perguntas (sem gabarito na página)

1. Responsabilidade pelo viés de um modelo pré-treinado montado por outra equipe? (Também de quem usa / só de quem treinou / do dono dos dados / de ninguém)
2. Assistente responde com 96% de confiança e está errado. O que o número significa? (acerta 96% / faltam 4% de informação / qualidade do dado / conta interna que pode estar enganada)
3. O que a função de ativação faz? (mede o erro / acelera / escolhe dados / permite que empilhar camadas tenha efeito)
4. Prever preço de imóvel: quantos neurônios na última camada? (um por bairro / um / depende das entradas / três)
5. Curva de erro do treino subindo: suspeita mais provável? (poucas épocas / falta de aumento / dados desbalanceados / taxa de aprendizado alta demais)
6. Para que serve o checkpoint? (acelerar / guardar o modelo da melhor época / dividir treino e validação / diminuir a taxa)
7. Dropout ligado na avaliação: o que acontece? (código quebra / nada / métrica muda a cada execução / treino mais lento)
