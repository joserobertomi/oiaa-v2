import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { content } from "@/content";

export function generateStaticParams() {
  return content.theory.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => content.theory.find((t) => t.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: find((await params).slug)?.title };
}

export default async function Page({ params }: Props) {
  const topic = find((await params).slug);
  if (!topic) notFound();

  const symptoms = content.symptoms.filter((s) => s.related.theory?.includes(topic.slug));

  return (
    <article>
      <p className="text-sm">
        <Link href="/teoria" className="underline">
          ← Teoria
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{topic.title}</h1>
      <p className="mt-3 rounded-lg border-2 p-4 text-lg">{topic.short}</p>

      <div className="mt-6 space-y-3">
        {topic.explanation.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {topic.analogy && (
        <p className="mt-4 border-l-4 pl-4 italic">{topic.analogy}</p>
      )}

      <section className="mt-6 rounded-lg border p-4">
        <h2 className="font-semibold">Regra de bolso</h2>
        <p className="mt-1">{topic.rule}</p>
      </section>

      {topic.commonMistake && (
        <section className="mt-4 rounded-lg border p-4">
          <h2 className="font-semibold">Erro comum</h2>
          <p className="mt-1">{topic.commonMistake}</p>
        </section>
      )}

      {topic.glossary && (
        <p className="mt-6 flex flex-wrap gap-x-3 text-sm">
          <span className="opacity-70">Termos:</span>
          {topic.glossary.map((id) => (
            <GlossaryTerm key={id} id={id} />
          ))}
        </p>
      )}

      {symptoms.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Quando isso aparece na prática</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {symptoms.map((s) => (
              <li key={s.slug}>
                <Link href={`/diagnostico/${s.slug}`} className="underline">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.lab && <p className="mt-6 text-sm opacity-70">No material original: {topic.lab}.</p>}
    </article>
  );
}
