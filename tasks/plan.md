# Implementation Plan: Guia de Consulta OIAA Fase 2

Spec: [`../SPEC.md`](../SPEC.md) (aprovada). Fonte de conteúdo: [`../docs/`](../docs/). Tarefas em [`todo.md`](todo.md).

## Overview

App Next.js estático, em pt-BR, de consulta rápida para alunos durante a competição: ficha de 9 modelos, 110 parâmetros, diagnóstico por sintoma, teoria, glossário, comparador e busca. Conteúdo vive em dados tipados validados no build.

## Architecture Decisions

- **Conteúdo como dado, UI como casca.** Os dados em `src/content/*.ts` seguem o schema da spec; as páginas só renderizam. Isso deixa as fichas dos 9 modelos e dos 110 parâmetros iguais por construção e testáveis em lote.
- **Fatias verticais por trilha.** A trilha tabular entra primeiro completa (dados + páginas + testes) para provar o padrão. Visão e texto repetem o padrão e só acrescentam dados.
- **`content:check` é o teste principal.** Falha o build se faltar `source`, se um link quebrar ou se as contagens por modelo (10, 10, 16, 12, 14, 12, 12, 12, 12) divergirem do `docs/`.
- **SSG com `generateStaticParams`.** Sem API routes; slug quebrado quebra o `next build`.
- **Busca depois do conteúdo.** O índice é gerado a partir dos dados já prontos, então só entra quando há o que buscar. Depende da aprovação do `minisearch` (pergunta aberta 4 da spec).
- **Complemento é visível.** O material da OIAA tem faixa/padrão/sugerido/o que faz para quase todo parâmetro, mas **não** tem "se subir / se baixar" nem "erro comum" para a maioria. Esses campos são `source: "complemento"` por padrão e aparecem com etiqueta.

## Dependency Graph

```
T1 scaffold ─┬─ T2 schema + content:check
             │        │
             │        ├─ T3 tabular (modelos+params+páginas) ─┬─ T5 visão ──┐
             │        │                                       └─ T6 texto ──┤
             │        └─ T4 glossário ──────────────────────────────────────┤
             │                                                              │
             └─ (layout/tema em T1)        T7 comparador ◄──────────────────┤
                                           T8 diagnóstico ◄─────────────────┤
                                           T9 teoria ◄──────────────────────┤
                                           T10 busca ◄── T3..T9 (dados)     │
                                           T11 home ◄── T7, T8, T10
                                           T12 acessibilidade/tema/perf
                                           T13 e2e
                                           T14 revisão de complementos + deploy
```

T5 e T6 são independentes entre si (podem ser paralelizadas). T7, T8 e T9 são independentes entre si depois do Checkpoint 2.

## Task List

### Phase 1: Foundation
- [x] T1: Scaffold do projeto
- [x] T2: Schema de conteúdo e `content:check`

### Checkpoint 1: Foundation

### Phase 2: Fatia vertical (trilha tabular) e glossário
- [x] T3: Trilha tabular completa (3 modelos, 36 parâmetros, páginas)
- [x] T4: Glossário e links de jargão

### Checkpoint 2: Padrão provado

### Phase 3: Demais trilhas
- [x] T5: Trilha de visão (3 modelos, 38 parâmetros)
- [x] T6: Trilha de texto (3 modelos, 36 parâmetros)

### Checkpoint 3: Conteúdo de modelos completo

### Phase 4: Consulta
- [x] T7: Comparador por trilha
- [x] T8: Diagnóstico por sintoma e checklist de erros silenciosos
- [x] T9: Páginas de teoria
- [x] T10: Busca
- [x] T11: Home

### Checkpoint 4: Todos os fluxos de consulta funcionam

### Phase 5: Polimento e entrega
- [x] T12: Acessibilidade, tema e desempenho
- [x] T13: Testes e2e
- [ ] T14: Revisão dos complementos e deploy

### Checkpoint 5: Pronto para os alunos

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Volume de conteúdo (110 fichas) é o trabalho real, não o código | High | Fatia tabular primeiro para fixar o formato; testes de contagem; dados em lote por trilha |
| Eu inventar valores de parâmetro e passar como oficiais | High | Campo `source` obrigatório; "se subir/baixar" nasce como `complemento`; `content:check` lista todos os complementos para revisão |
| Os 18 laboratórios eram interativos; parte do raciocínio se perde em texto | Med | Reescrever cada lab como "regra de bolso" nas páginas de teoria; link para o material original quando fizer sentido |
| Valores sutis do material (ex.: padrão vs. sugerido invertidos na transcrição) | Med | Conferir cada tabela contra `docs/` no teste de integridade e na revisão do professor |
| Lib de busca ainda não aprovada | Low | T10 só começa após aprovação; fallback é filtro simples por texto sem dependência |
| Diagnóstico por sintoma sem cobertura de casos reais da prova | Med | Partir dos 10 erros silenciosos e 4 curvas do material; professor adiciona sintomas vistos em sala |
| Nomes de modelos/IDs de pesos mudarem fora do material | Low | Não prometer mais que o material; datar a página ("conteúdo de 2026-10-28") |

## Open Questions

Herdadas da spec e ainda sem resposta, nenhuma bloqueia T1–T9:
1. ~~Aprovar `minisearch`~~ Aprovado.
2. Quem revisa o conteúdo `complemento` (T14).
3. Modo estrito "só OIAA", se a prova limitar a consulta.
4. Manter o app depois da competição?
5. ~~Nome do app~~ Decidido: "Verumakers OIAA".
