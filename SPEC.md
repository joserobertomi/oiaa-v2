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

## Premissas (confirmadas na construção)
1. Next.js App Router + TypeScript, renderização **estática** (SSG), sem API routes.
2. Conteúdo em arquivos de dados tipados no repositório (TypeScript), não em CMS.
3. Português do Brasil; tom direto e analógico como o material; todo jargão linka para o glossário.
4. Uso em notebook, com internet. Funciona em celular (sem rolagem horizontal em 390 px), mas notebook é o alvo.
5. Deploy na Vercel, link público: https://verumakers-oiaa-v2.vercel.app/ (com `noindex`: circula só pelo link).
6. Tailwind CSS v4, tema claro/escuro por classe `dark`, **fonte do sistema** (sem `next/font`: mais rápido e sem troca de fonte).

## Tech Stack
- Next.js 16 (Cache Components ligado: por isso não se usa `dynamicParams`), React 19, TypeScript `strict`
- Tailwind CSS v4
- Busca client-side com `minisearch`, carregada sob demanda no primeiro foco da caixa, com sinônimos e sem acento
- Vitest (integridade de dados, busca, páginas via `renderToStaticMarkup`) e Playwright (e2e) usando o Chrome instalado (`channel: "chrome"`), sem baixar navegador
- Sem banco, sem autenticação, sem analytics

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
Revisão:    npm run content:review   # gera revisao/*.md com os complementos do autor
```

## Project Structure
```
docs/                    → material bruto da OIAA em markdown (fonte, somente leitura)
revisao/                 → lista de revisão dos complementos (gerada por content:review)
scripts/                 → content-check.ts, review.ts (rodam direto no Node)
src/app/                 → rotas (App Router)
  page.tsx               → home: busca em destaque + atalhos
  modelos/               → comparador por trilha
  modelos/[slug]/        → ficha do modelo
  parametros/            → todos os parâmetros, com filtro por trilha/modelo
  diagnostico/[slug]/    → por sintoma
  teoria/[slug]/         → conceitos
  glossario/  checklist/
src/content/             → dados tipados: models/, params/, symptoms.ts, theory.ts, glossary.ts, compare.ts
src/content/schema.ts    → tipos;  validate.ts → regras de integridade
src/components/          → ParamCard, ParamExplorer, ModelCompare, SearchBox, GlossaryTerm, Header, Footer...
src/lib/                 → search.ts (índice e busca), search-types.ts, nav.ts
tests/                   → unit/integridade/páginas
e2e/                     → Playwright
```

## Modelo de dados (resumo)
```ts
type Source = "oiaa" | "complemento";

interface Model { slug; track; name; profile; summary; chooseIf; expect; pitfall; ready; params: string[]; source }
interface Param {
  id; modelSlug; name; default?; suggested?; range?; what;
  adjust?: boolean;                 // "botão que você ajusta" na ficha do modelo
  glossary?: string[];
  complement?: { note?; ifRaise?; ifLower?; commonMistake? };   // sempre do autor
  source: Source;                   // origem do restante da ficha
}
interface Symptom { slug; title; group: "silencioso" | "curvas" | "configuracao" | "metrica";
  check?: string;                   // só nos 10 erros silenciosos (vira o /checklist)
  likelyCauses: string[]; fix; related: { models?; params?; theory? }; source }
interface Theory { slug; title; short; explanation: string[]; analogy?; rule; commonMistake?; lab?; glossary?; source }
interface GlossaryEntry { id; term; category; definition; source }
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
      {param.complement && <Badge>complemento</Badge>}
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

## Status (2026-10-29)
Critérios 1 a 8 atendidos e verificados no link público: 9 modelos e 110 parâmetros; 21 sintomas; 17 páginas de teoria; 31 termos; comparador; busca; acessibilidade Lighthouse 100; desempenho com mediana 91 a 95 e variação de 84 a 97 por causa do tempo de bloqueio do JS. Testes: 71 unitários e 9 e2e.

## Open Questions
1. **Pós-prova:** o professor quer manter o app depois da competição ou é descartável?
2. **Revisão dos complementos (aberta, bloqueia distribuir o link):** 75 itens em `revisao/*.md`, a revisar pelo professor.
3. **Gabaritos das provas dos capítulos:** o material não os expõe; ficam fora do app.
4. **Modo estrito "só OIAA":** não implementado; o professor preferiu a lista de revisão.
5. ~~Nome do app~~ **Verumakers OIAA**.  ~~Busca~~ `minisearch`.  ~~Indexação~~ `noindex`.
6. ~~Dúvidas do material~~ Resolvidas pela documentação oficial: o token inicial do XLM-RoBERTa é `<s>` (o material diz `[CLS]`), e o custo do ViT-B/16 é cerca de 45 vezes o da EfficientNet-B0 (o material diz quatro vezes). As duas divergências estão sinalizadas no site.
