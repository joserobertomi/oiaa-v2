# OIAA 2026 · Fase 2 — Imersão (contexto do projeto)

Fonte: `https://olimpiadadeia.ceia.digital/api/imersao/conteudo/fase2` (material da Olimpíada de Inteligência Artificial Aplicada 2026, copiado em 2026-10-28). Requer login.

## Resumo

- Fase 1: tabelas, imagens e textos com modelos clássicos (árvore, floresta, regressão, SVM).
- Fase 2: **redes neurais profundas pré-treinadas**, que precisam de GPU. O caminho continua **Explorar → Configurar → Modelar → Avaliar** e o código vem quase pronto.
- 4 capítulos, 18 laboratórios interativos (rodam no navegador), linha do tempo e glossário.
- Os laboratórios usam dados diferentes dos do desafio, de propósito. O que se aprende é o raciocínio.
- **9 modelos**, todos apresentados com os mesmos 6 campos e usados no mesmo caderno de 3 células (A preparo · B treino · C avaliação).
- Métrica oficial das três trilhas: **F1-macro**. Métrica de apoio no texto: recall.
- O relatório vale nota. Ele deve descrever o uso de IA generativa, reportar desempenho por grupo e justificar escolhas por custo ou por métrica.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [01-motor-novo.md](01-motor-novo.md) | Cap. 1: ética, rede por dentro, treino, sala de controle (Labs 1–9) |
| [02-dados-tabulares.md](02-dados-tabulares.md) | Cap. 2: piso/sinal, 3 modelos tabulares, caderno, curvas (Labs 10–12) |
| [03-visao-computacional.md](03-visao-computacional.md) | Cap. 3: resolução, aumento de dados, 3 modelos de visão, Grad-CAM (Labs 13–15) |
| [04-linguagem-natural.md](04-linguagem-natural.md) | Cap. 4: tokenização, 3 modelos de texto, justiça por grupo (Labs 16–18) |
| [05-linha-do-tempo.md](05-linha-do-tempo.md) | De onde veio cada modelo (1958–2024) |
| [06-glossario.md](06-glossario.md) | Termos técnicos |

## Os nove modelos num relance

| Trilha | Modelo | Perfil | Taxa (estágio de ajuste) | Pegadinha |
|---|---|---|---|---|
| Tabular | Rede densa | entrada | 1e-3 | sem a régua (StandardScaler) nas numéricas, trava |
| Tabular | Rede densa + embeddings | intermediária | 1e-3 | precisa das cardinalidades de cada categórica (vêm do Bloco 1) |
| Tabular | TabNet | avançada | 2e-2 | `virtual_batch_size` tem que dividir `batch_size` |
| Visão | EfficientNet-B0 | econômica | 1e-4 | camada de saída é `classifier[1]`, não `fc` |
| Visão | ResNet-50 | referência | 1e-4 | usar `PESOS.transforms()`, nunca preparo escrito à mão |
| Visão | ViT-B/16 | avançada | 1e-5 | entrada exatamente 224×224 |
| Texto | DistilBERT multilíngue | entrada | 3e-5 a 5e-5 | fala 104 idiomas e nenhum muito bem |
| Texto | BERTimbau | especialista | 2e-5 | não passar o texto para minúsculas |
| Texto | XLM-RoBERTa | avançada | 1e-5 a 2e-5 | o mais instável; tokenizador e modelo do mesmo nome |

## Erros silenciosos citados no material (checklist)

1. Ambiente sem GPU: o caderno roda, mas leva horas (Cap. 1, Lab 9).
2. Dropout ligado na avaliação: a métrica muda a cada execução.
3. Régua (scaler) ajustada com a tabela inteira: vazamento. Ajustar só no treino, depois da separação.
4. Ordem do laço de treino trocada: roda e não aprende.
5. Aumento de dados aplicado na validação.
6. Camada de saída com o nome errado entre modelos de visão.
7. Tokenizador de um modelo com pesos de outro: roda e o resultado despenca.
8. Texto em minúsculas / sem acento para o BERTimbau.
9. Pesos V1 vs V2 da ResNet preparam a imagem de formas diferentes.
10. Reportar só a média e esconder um grupo com desempenho ruim.

> Nota: o material marca as respostas dos laboratórios e provas só de forma interativa. As perguntas das provas estão nos capítulos, sem gabarito.
