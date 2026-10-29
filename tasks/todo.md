# Tarefas — Guia de Consulta OIAA Fase 2

Plano: [`plan.md`](plan.md). Marque `[x]` ao concluir. Verificação padrão de toda tarefa: `npm run typecheck && npm run lint && npm test && npm run content:check` (a partir de T2) e `npm run build`.

---

## Phase 1: Foundation

### T1: Scaffold do projeto
**Description:** Criar o app Next.js (App Router, TypeScript strict, Tailwind), com layout base, cabeçalho de navegação, tema claro/escuro e os scripts da spec. Páginas vazias com título.
**Acceptance criteria:**
- [x] `npm run dev` abre a home; navegação leva às rotas vazias (modelos, parametros, diagnostico, teoria, glossario, checklist).
- [x] Scripts `typecheck`, `lint`, `test`, `test:watch`, `build` existem e passam.
- [x] Tema claro/escuro alterna e respeita `prefers-color-scheme`.
**Verification:** `npm run typecheck && npm run lint && npm test && npm run build`; abrir no navegador.
**Dependencies:** None
**Files:** `package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/Header.tsx`, `src/components/ThemeToggle.tsx`, `vitest.config.ts`
**Scope:** Medium (3–5 + config)

### T2: Schema de conteúdo e `content:check`
**Description:** Definir tipos (`Model`, `Param`, `Symptom`, `Theory`, `GlossaryEntry`, `Source`) e o script `content:check` que valida integridade. Testes escritos primeiro (TDD) com fixtures mínimas.
**Acceptance criteria:**
- [x] Todo item exige `source`; ausência falha.
- [x] Slugs/ids duplicados falham; referência a id inexistente falha (`params[]`, `related`, `glossary`).
- [x] Contagem de parâmetros por modelo é checada contra a tabela da spec (10, 10, 16, 12, 14, 12, 12, 12, 12) quando o modelo existe.
- [x] O script imprime a lista de itens `complemento` para revisão.
**Verification:** `npm test` (casos válidos e inválidos); `npm run content:check` passa com dados vazios.
**Dependencies:** T1
**Files:** `src/content/schema.ts`, `scripts/content-check.ts`, `tests/content-integrity.test.ts`, `package.json`
**Scope:** Small–Medium

### Checkpoint 1: Foundation
- [ ] Typecheck, lint, testes, build passam
- [ ] App abre localmente com navegação e tema
- [ ] Revisar com o professor antes de seguir

---

## Phase 2: Fatia vertical (tabular) e glossário

### T3: Trilha tabular completa
**Description:** Dados dos 3 modelos tabulares (rede densa, rede densa com embeddings, TabNet) e dos 36 parâmetros, mais as páginas `/modelos/[slug]` (quando usar, o que esperar, pegadinha, lista de parâmetros) e `/parametros` (filtrável por modelo). Fonte: `docs/02-dados-tabulares.md`.
**Acceptance criteria:**
- [x] Os 3 modelos têm ficha com "escolha se", "o que esperar" e "pegadinha" do material.
- [x] Cada parâmetro mostra padrão/sugerido/faixa e "o que faz"; "se subir / se baixar" e "erro comum" existem, marcados `complemento`.
- [x] Valores conferem com as tabelas de `docs/`; contagem 10/10/16 passa no `content:check`.
- [x] `/parametros` filtra por modelo e por trilha.
**Verification:** `npm test && npm run content:check && npm run build`; abrir `/modelos/tabnet` e conferir `virtual_batch_size` vs `batch_size`.
**Dependencies:** T2
**Files:** `src/content/models/tabular.ts`, `src/content/params/tabular.ts`, `src/app/modelos/[slug]/page.tsx`, `src/app/parametros/page.tsx`, `src/components/ParamCard.tsx`, `src/components/Badge.tsx`
**Scope:** Large no volume de dados (dividir em 2 commits: dados; páginas). Código em si: Medium.

### T4: Glossário e links de jargão
**Description:** Dados do glossário (31 termos de `docs/06-glossario.md`), página `/glossario` e componente `GlossaryTerm` que linka jargão em qualquer texto das fichas. Aplicar nas fichas tabulares.
**Acceptance criteria:**
- [x] 31 termos presentes; categorias preservadas.
- [x] Termo no texto de uma ficha abre/leva à definição.
- [x] `glossary[]` de qualquer item resolve (checado pelo `content:check`).
**Verification:** `npm test && npm run content:check`; clicar num termo na ficha do TabNet.
**Dependencies:** T2 (T3 para aplicar nas fichas)
**Files:** `src/content/glossary.ts`, `src/app/glossario/page.tsx`, `src/components/GlossaryTerm.tsx`
**Scope:** Small–Medium

### Checkpoint 2: Padrão provado
- [ ] Um aluno consegue abrir o TabNet e entender os 16 parâmetros sem sair do app
- [ ] Todos os testes e o build passam
- [ ] Professor valida o formato da ficha (parar aqui se o formato mudar: refazer é barato agora e caro depois)

---

## Phase 3: Demais trilhas

### T5: Trilha de visão
**Description:** Dados de EfficientNet-B0, ResNet-50 e ViT-B/16 e dos 38 parâmetros (12, 14, 12). Incluir a tabela "camada de saída por modelo" e a nota dos dois estágios. Fonte: `docs/03-visao-computacional.md`.
**Acceptance criteria:**
- [x] 3 fichas completas; contagem 12/14/12 passa.
- [x] A pegadinha da camada de saída (`fc`, `classifier[1]`, `heads.head`) aparece de forma destacada.
- [x] ViT mostra taxa 1e-5, lote 16 e entrada 224×224 em destaque.
**Verification:** `npm test && npm run content:check && npm run build`.
**Dependencies:** T3
**Files:** `src/content/models/visao.ts`, `src/content/params/visao.ts`, `tests/` (contagens)
**Scope:** Medium (volume de dados)

### T6: Trilha de texto
**Description:** Dados de DistilBERT multilíngue, BERTimbau e XLM-RoBERTa e dos 36 parâmetros (12, 12, 12). Destaque: tokenizador e modelo com o mesmo nome; BERTimbau sem minúsculas. Fonte: `docs/04-linguagem-natural.md`.
**Acceptance criteria:**
- [x] 3 fichas completas; contagem 12/12/12 passa.
- [x] Regra "tokenizador = mesmo nome do modelo" aparece em cada ficha.
- [x] `do_lower_case=False` do BERTimbau aparece como obrigatório.
**Verification:** `npm test && npm run content:check && npm run build`.
**Dependencies:** T3 (independente de T5)
**Files:** `src/content/models/texto.ts`, `src/content/params/texto.ts`
**Scope:** Medium

### Checkpoint 3: Conteúdo de modelos completo
- [ ] 9 modelos e 110 parâmetros presentes (contagem automática)
- [ ] Nenhum item sem `source`
- [ ] Professor revisa a lista de `complemento` gerada pelo `content:check` (amostra de cada trilha)

---

## Phase 4: Consulta

### T7: Comparador por trilha
**Description:** Página `/modelos` com seletor de trilha e tabela lado a lado dos 3 modelos (perfil, quando escolher, taxa, lote, pegadinha, custo/tamanho, o que esperar). Inclui o texto "como decidir" por trilha.
**Acceptance criteria:**
- [ ] Cada trilha exibe os 3 modelos em colunas legíveis também no celular (rolagem horizontal ou empilhado).
- [ ] Cada coluna linka para a ficha do modelo.
**Verification:** `npm test && npm run build`; conferir no navegador em largura de notebook e de celular.
**Dependencies:** Checkpoint 3
**Files:** `src/app/modelos/page.tsx`, `src/components/ModelCompare.tsx`
**Scope:** Small–Medium

### T8: Diagnóstico por sintoma e checklist
**Description:** Dados de sintomas (os 10 erros silenciosos do README, os 4 casos de curva e os do texto, como "F1 ≈ chute preguiçoso") e as páginas `/diagnostico` e `/checklist`. Cada sintoma: causa provável → ajuste → links para parâmetros, modelos e teoria.
**Acceptance criteria:**
- [x] Mínimo de 14 sintomas (10 erros + 4 curvas), cada um com causa e ajuste.
- [x] Todos os links `related` resolvem (`content:check`).
- [x] `/checklist` lista os 10 erros silenciosos em formato de verificação rápida antes de submeter.
**Verification:** `npm test && npm run content:check && npm run build`; seguir um sintoma até a ficha do parâmetro.
**Dependencies:** Checkpoint 3
**Files:** `src/content/symptoms.ts`, `src/app/diagnostico/page.tsx`, `src/app/diagnostico/[slug]/page.tsx`, `src/app/checklist/page.tsx`
**Scope:** Medium

### T9: Páginas de teoria
**Description:** Conceitos do Cap. 1–4 reescritos em formato de consulta: neurônio e ativação, perda, backpropagation, taxa/época/lote, transferência, curvas de treino, matriz de confusão, justiça por grupo, vazamento. Cada um: definição curta no topo, analogia, erro comum, "regra de bolso" (resumo do laboratório correspondente).
**Acceptance criteria:**
- [x] Mínimo de 9 páginas; cada uma com resposta de 1–2 frases no topo.
- [x] Conteúdo reescrito, não copiado (Never da spec).
- [x] Jargão linkado ao glossário.
**Verification:** `npm test && npm run content:check && npm run build`.
**Dependencies:** T4
**Files:** `src/content/theory.ts`, `src/app/teoria/page.tsx`, `src/app/teoria/[slug]/page.tsx`
**Scope:** Medium

### T10: Busca
**Description:** Índice gerado no build a partir de modelos, parâmetros, sintomas, teoria e glossário; caixa de busca no cabeçalho com resultados agrupados por tipo. **Requer aprovação do `minisearch`.**
**Acceptance criteria:**
- [ ] Busca por "taxa", "fc", "virtual batch", "minúscula", "GPU" e "dropout" retorna a página esperada nos primeiros resultados.
- [ ] Sinônimos comuns mapeados (ex.: "tokenizador" ≈ "tradutor", "régua" ≈ "scaler", "batch" ≈ "lote").
- [ ] Navegável por teclado.
**Verification:** `npm test` (consultas-chave); abrir no navegador.
**Dependencies:** T3–T9, aprovação da dependência
**Files:** `src/lib/search.ts`, `src/components/SearchBox.tsx`, `tests/search.test.ts`
**Scope:** Medium

### T11: Home
**Description:** Página inicial com busca em destaque e dois atalhos grandes: "Qual modelo uso?" (→ comparador) e "Algo deu errado" (→ diagnóstico), mais links para teoria, parâmetros, glossário e checklist.
**Acceptance criteria:**
- [ ] De qualquer ponto, ≤3 cliques ou 1 busca levam à ficha de qualquer modelo.
- [ ] Aviso curto com a data do conteúdo e a origem (material OIAA 2026).
**Verification:** `npm run build`; teste manual dos dois atalhos.
**Dependencies:** T7, T8, T10
**Files:** `src/app/page.tsx`
**Scope:** Small

### Checkpoint 4: Todos os fluxos de consulta funcionam
- [ ] Um aluno novo, sem ajuda, escolhe um modelo e configura os parâmetros iniciais em ≤ 1 minuto
- [ ] Diagnóstico resolve os 10 erros silenciosos
- [ ] Testes e build passam

---

## Phase 5: Polimento e entrega

### T12: Acessibilidade, tema e desempenho
**Description:** Contraste AA nos dois temas, foco visível, landmarks, tabelas acessíveis, tamanho de fonte legível em notebook, e metas de Lighthouse.
**Acceptance criteria:**
- [ ] Lighthouse ≥ 90 em acessibilidade e desempenho (home e ficha de modelo).
- [ ] Navegação completa por teclado; sem armadilhas de foco.
**Verification:** Lighthouse local; passagem manual por teclado.
**Dependencies:** Checkpoint 4
**Files:** componentes e estilos (ajustes)
**Scope:** Medium

### T13: Testes e2e
**Description:** Playwright cobrindo os três fluxos da spec.
**Acceptance criteria:**
- [ ] Home → busca "dropout" → abre ficha.
- [ ] Diagnóstico → sintoma → ficha de parâmetro.
- [ ] Comparador mostra 3 modelos de uma trilha.
**Verification:** `npm run test:e2e`
**Dependencies:** T11
**Files:** `e2e/*.spec.ts`, `playwright.config.ts`
**Scope:** Small–Medium

### T14: Revisão dos complementos e deploy
**Description:** Gerar o relatório de itens `complemento`, entregar ao professor para revisão, aplicar correções, e publicar na Vercel. **Domínio/deploy exigem confirmação.**
**Acceptance criteria:**
- [ ] Professor revisou os complementos (ou aprovou o conjunto); ajustes aplicados.
- [ ] Deploy funcionando; as páginas principais abrem pelo link público.
- [ ] Página mostra a fonte e a data do conteúdo.
**Verification:** `npm run build`; abrir o link público no celular e no notebook.
**Dependencies:** T12, T13
**Files:** configuração de deploy (mínima)
**Scope:** Small

### Checkpoint 5: Pronto para os alunos
- [ ] Todos os critérios de sucesso da spec atendidos
- [ ] Professor aprova o link para distribuir
