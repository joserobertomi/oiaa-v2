# Glossário

Termos em ordem de aparição no site, com a categoria original entre parênteses.

- **Época** (treino): uma passada completa por todos os exemplos. Três épocas = o conjunto visto três vezes.
- **Lote** (treino): punhado de exemplos vistos antes de ajustar os pesos uma vez. Lote 32 = 32 exemplos por ajuste.
- **Passo** (treino): cada ajuste dos pesos. Passos = lotes × épocas.
- **Taxa de aprendizado** (treino): tamanho do ajuste em cada passo. O hiperparâmetro que mais estraga treino quando está errado.
- **Transferência de aprendizado** (conceito): usar modelo já treinado em milhões de exemplos e ensinar só a parte específica do problema.
- **Sobreajuste** (avaliação): o modelo decora o treino. Sinal: vai bem no treino e mal na validação.
- **Subajuste** (avaliação): modelo simples demais. Sinal: vai mal nos dois.
- **F1-macro** (avaliação): média simples do F1 de cada classe; cada classe pesa igual, mesmo a pequena. **Métrica oficial das três trilhas.**
- **Dropout** (treino): desliga neurônios ao acaso durante o treino. Freio ao sobreajuste.
- **Função de ativação** (conceito): conta que decide o que sai do neurônio. Sem ela, várias camadas dão no mesmo que uma.
- **Embedding** (conceito): números que o modelo aprende para representar uma categoria ou palavra; coisas parecidas ficam com números parecidos.
- **Informação mútua** (dados): quanto uma coluna ajuda a adivinhar a resposta ("medidor de sinal").
- **Aumento de dados** (dados): mostrar a mesma imagem com pequenas variações. Só no treino, nunca na validação.
- **Pedaço de palavra** (texto): unidade em que o texto é quebrado. "rapidinho" pode virar "rapid" e "inho".
- **Ponto de verificação** (ambiente): cópia do modelo salva durante o treino; se a sessão cair, volta daí.
- **GPU** (ambiente): placa de vídeo; faz muitas contas ao mesmo tempo, o que a rede neural precisa.
- **Vazamento** (dados): informação da validação/teste entra no treino sem querer. A nota melhora e não significa nada.
- **Parada antecipada** (treino): interrompe quando a validação para de melhorar, guardando a melhor versão.
- **Recall** (avaliação): dos casos de uma classe que existiam, quantos o modelo encontrou.
- **Matriz de confusão** (avaliação): mostra com o que o modelo confundiu o quê.
- **Baseline** (avaliação): resultado simples de referência. Se o modelo não supera, não serve.
- **Congelar camadas** (treino): impedir que parte do modelo seja alterada no treino, preservando o que sabia.
- **Otimizador** (treino): regra que decide como os pesos mudam a cada passo. O mais comum na fase é o **AdamW**.
- **Normalização** (dados): colocar números na mesma escala. Sem isso, a coluna de valores maiores domina.
- **Função de perda** (treino): mede o quanto o palpite ficou longe. Classificação: entropia cruzada; regressão: erro quadrático.
- **Softmax** (conceito): transforma os números da última camada em porcentagens que somam 100%.
- **Backpropagation** (treino): propaga o erro para trás, camada por camada, descobrindo o quanto cada peso contribuiu. Dá a direção do ajuste, não o tamanho.
- **Peso** (conceito): número que diz o quanto uma entrada importa para um neurônio. Treinar é ajustar milhões deles.
- **Agendador da taxa** (treino): diminui o passo ao longo do treino (grande no começo, pequeno no fim).
- **Regressão** (conceito): prever um número em vez de uma classe. Última camada com um neurônio.
- **Classificação** (conceito): escolher entre classes. Um neurônio por classe, com softmax.
