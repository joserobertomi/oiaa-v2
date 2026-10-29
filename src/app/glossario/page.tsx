import { content } from "@/content";

export const metadata = { title: "Glossário" };

const CATEGORY_LABELS: Record<string, string> = {
  treino: "Treino",
  conceito: "Conceito",
  avaliação: "Avaliação",
  dados: "Dados",
  texto: "Texto",
  ambiente: "Ambiente",
};

export default function Page() {
  const terms = [...content.glossary].sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));

  return (
    <>
      <h1 className="text-2xl font-semibold">Glossário</h1>
      <p className="mt-2">Os termos técnicos do material, em uma ou duas frases.</p>
      <dl className="mt-6 grid gap-4 md:grid-cols-2">
        {terms.map((g) => (
          <div key={g.id} id={g.id} className="scroll-mt-4 rounded-lg border p-4 target:border-2">
            <dt className="flex items-baseline justify-between gap-2">
              <span className="font-semibold">{g.term}</span>
              <span className="text-xs opacity-70">{CATEGORY_LABELS[g.category] ?? g.category}</span>
            </dt>
            <dd className="mt-1 text-sm">{g.definition}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
