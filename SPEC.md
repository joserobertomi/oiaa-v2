# Spec: Guia de Consulta OIAA Fase 2

## Objective

App web de **consulta rápida** para alunos de ensino médio, iniciantes em IA, usarem **durante a competição** (que permite consulta) da OIAA 2026 · Fase 2. Não é um curso linear: é uma ferramenta para decidir e configurar sem travar.

**Sucesso:** em até ~1 minuto o aluno chega (a) ao modelo certo para o problema dele, (b) aos valores iniciais de cada parâmetro e (c) à causa de um comportamento estranho do treino.

**Usuários:** alunos do professor (ensino médio, sem base prévia em ML). Professor é o único mantenedor do conteúdo.

**Três eixos de conteúdo**
1. **Teoria e pedagogia:** conceitos do material (neurônio, perda, backprop, taxa, época/lote, transferência, curvas, matriz de confusão, justiça por grupo), com analogias e erros comuns.
2. **Qual modelo usar e quando:** 9 modelos em 3 trilhas (tabular, visão, texto), com "escolha se...", pegadinha, o que esperar e comparador lado a lado.
3. **Parâmetros:** ficha por parâmetro de cada modelo (faixa, padrão, sugerido, o que faz, o que acontece se subir/baixar, erro comum).

**Interpretação prática (diagnóstico por sintoma):** "validação sobe e treino cai", "F1 igual ao chute preguiçoso", "roda mas o resultado despenca", etc. → causa provável → ajuste → link para a ficha.

### Fonte e origem do conteúdo
- Base: material da OIAA, já salvo em `docs/` (fonte única, não editar por agente sem pedido).
- Complemento do autor (dicas práticas, faixas, "quando ajustar") é permitido, mas **sempre com etiqueta visível "complemento"** para o professor revisar. Todo item tem campo `source: "oiaa" | "complemento"`.
- Professor confirmou autorização para republicar o conteúdo reescrito, citando a fonte.

### Fora de escopo (v1)
Login, backend, banco de dados, anotações dos alunos ou dados do desafio real, comparador de experimentos, modo estudo/quiz, i18n, conteúdo dos 18 laboratórios interativos (só o texto e os resultados de exemplo).

## Premissas (corrija se errado)
1. Next.js App Router + TypeScript, renderização **estática** (SSG), sem API routes.
2. Conteúdo em arquivos de dados tipados no repositório (TypeScript), não em CMS.
3. Português do Brasil; tom direto e analógico como o material; todo jargão linka para o glossário.
4. Uso em notebook, com internet. Funciona em celular, mas notebook é o alvo.
5. Deploy na Vercel, link público.
6. Tailwind CSS para estilo; modo claro/escuro.

## Tech Stack
- Next.js (versão estável atual), React, TypeScript `strict`
- Tailwind CSS
- Busca client-side sobre índice gerado no build (candidata: `minisearch`, ~6 KB; aprovado pelo professor)
- Vitest + Testing Library (unit/integridade de dados), Playwright (smoke e2e)
- Sem banco, sem autenticação, sem analytics na v1

## Commands
```
Dev:        npm run dev
Build:      npm run build
Typecheck:  npm run typecheck        # tsc --noEmit
Lint:       npm run lint
Test:       npm test                 # vitest run
Test watch: npm run test:watch
E2E:        npm run test:e2e         # playwright test
Validar conteúdo: npm run content:check   # integridade dos dados (links, ids, campos)
```

## Project Structure
```
docs/                    → material bruto da OIAA em markdown (fonte, somente leitura)
src/app/                 → rotas (App Router)
  page.tsx               → home: busca + atalhos ("Qual modelo?", "Algo deu errado")
  modelos/               → lista/comparador
  modelos/[slug]/        → ficha do modelo (quando usar, pegadinha, parâmetros)
  parametros/            → todos os parâmetros, filtráveis por modelo/trilha
  diagnostico/           → por sintoma
  teoria/[slug]/         → conceitos
  glossario/
  checklist/             → erros silenciosos
src/content/             → dados tipados (modelos, parametros, sintomas, teoria, glossario)
src/content/schema.ts    → tipos + validação
src/components/          → UI (Callout, ParamCard, ModelCompare, SearchBox, GlossaryTerm)
src/lib/                 → busca, helpers de links entre conteúdos
tests/                   → unit/integridade
e2e/                     → Playwright
```

## Modelo de dados (resumo)
```ts
type Source = "oiaa" | "complemento";

interface Model {
  slug: string; track: "tabular" | "visao" | "texto"; name: string;
  profile: string;            // entrada, intermediária, avançada, ...
  chooseIf: string; expect: string; pitfall: string;
  params: string[];           // ids de Param
  source: Source;
}
interface Param {
  id: string; modelSlug: string; name: string;
  default?: string; suggested?: string; range?: string;
  what: string; ifRaise: string; ifLower: string; commonMistake?: string;
  glossary?: string[];
  complement?: { ifRaise?: string; ifLower?: string; commonMistake?: string }; // sempre do autor
  source: Source;                // origem do restante da ficha
}
interface Symptom {
  slug: string; title: string; likelyCauses: string[];
  fix: string; related: { models?: string[]; params?: string[]; theory?: string[] };
  source: Source;
}
```

## Code Style
TypeScript estrito, componentes funcionais, Server Components por padrão (`"use client"` só na busca e no tema). Conteúdo é dado, não JSX espalhado.

```tsx
// src/components/ParamCard.tsx
import type { Param } from "@/content/schema";

export function ParamCard({ param }: { param: Param }) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-semibold">{param.name}</h3>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
        <div><dt>Padrão</dt><dd>{param.default ?? "—"}</dd></div>
        <div><dt>Sugerido</dt><dd>{param.suggested ?? "—"}</dd></div>
        <div><dt>Faixa</dt><dd>{param.range ?? "—"}</dd></div>
      </dl>
      <p className="mt-2">{param.what}</p>
      {param.source === "complemento" && <Badge>complemento</Badge>}
    </article>
  );
}
```

Convenções: arquivos `kebab-case`, componentes `PascalCase`, slugs de conteúdo `kebab-case` estáveis, textos em pt-BR, sem comentários óbvios.

## Testing Strategy
- **Integridade de conteúdo (mais importante):** todo `params[]` referenciado existe; todo link entre sintoma/modelo/teoria/glossário resolve; todo item tem `source`; nenhum slug duplicado; os 9 modelos e seus parâmetros estão presentes (contagens do `docs/`: 10, 10, 16, 12, 14, 12, 12, 12, 12).
- **Unit:** busca retorna o item esperado para consultas-chave ("taxa", "fc", "virtual batch", "minúsculas").
- **E2E (Playwright, poucos):** home → busca "dropout" → abre ficha; diagnóstico → sintoma → ficha de parâmetro; comparador mostra 3 modelos de uma trilha.
- **Build como teste:** `next build` com `generateStaticParams` falha se algum slug quebrar.
- Cobertura: sem meta numérica; exigir que os testes de integridade passem em todo commit.

## Boundaries
- **Always:** rodar `typecheck`, `lint`, `test` e `content:check` antes de commit; marcar `source` em todo conteúdo novo; linkar jargão ao glossário; conferir números contra `docs/`.
- **Ask first:** adicionar dependências (inclusive a lib de busca); mudar o schema de dados; mudar estrutura de rotas; incluir conteúdo de complemento relevante (valores recomendados que não estão no material); configurar domínio/deploy; analytics.
- **Never:** editar `docs/` sem pedido; inventar valores de parâmetro e apresentá-los como do material; commitar segredos; remover testes que falham sem aprovação; copiar o texto do material literalmente em blocos longos (reescrever em formato de consulta); adicionar login ou coleta de dados dos alunos.

## Success Criteria
1. Os 9 modelos têm ficha completa; os 110 parâmetros (soma das tabelas) têm ficha com ao menos: nome, padrão/sugerido ou faixa, o que faz.
2. Seleção de modelo: com ≤3 cliques ou 1 busca o aluno chega à ficha de qualquer modelo e à sua lista de parâmetros.
3. Diagnóstico cobre no mínimo os 10 erros silenciosos do checklist e os 4 casos de curva (saudável, sobreajuste, subajuste, taxa alta), cada um com causa e ajuste.
4. Busca encontra termo por nome, sinônimo comum e erro (ex.: "fc", "dropout", "minúscula", "GPU").
5. Comparador exibe lado a lado os 3 modelos de uma trilha (perfil, custo/peso, pegadinha, taxa).
6. Todo item de complemento exibe a etiqueta visível; `content:check` falha se faltar `source`.
7. Acessibilidade e desempenho: Lighthouse ≥ 90 em acessibilidade e desempenho nas páginas home e ficha de modelo; navegação por teclado; contraste AA em claro e escuro.
8. `npm run build` e todos os testes passam; deploy na Vercel funcionando.

## Open Questions
1. **Pós-prova:** o professor quer manter o app depois da competição ou é descartável? (Afeta o rigor do schema.)
2. **Validação do complemento:** quem revisa o conteúdo de `source: "complemento"` antes de ir para os alunos? (Sugestão: o professor, com um relatório gerado por `content:check`.)
3. **Gabaritos das provas dos capítulos:** o material não os expõe; ficam fora do app, a menos que o professor forneça.
4. **Regras da competição:** a prova limita o que pode ser consultado (ex.: só material "oficial")? Se limitar, o app deve exibir só `source: "oiaa"` num modo estrito.
5. ~~Nome do app~~ Decidido: **Verumakers OIAA** (sem logo ou marca oficial da organização).
6. ~~Busca~~ `minisearch` aprovado.
