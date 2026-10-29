import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/content";

export function generateStaticParams() {
  return content.symptoms.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => content.symptoms.find((s) => s.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: find((await params).slug)?.title };
}

export default async function Page({ params }: Props) {
  const symptom = find((await params).slug);
  if (!symptom) notFound();

  const models = (symptom.related.models ?? []).map((slug) => content.models.find((m) => m.slug === slug)!);
  const related = (symptom.related.params ?? []).map((id) => {
    const param = content.params.find((p) => p.id === id)!;
    return { param, model: content.models.find((m) => m.slug === param.modelSlug)! };
  });

  const theory = (symptom.related.theory ?? []).map((slug) => content.theory.find((t) => t.slug === slug)!);

  return (
    <article>
      <p className="text-sm">
        <Link href="/diagnostico" className="underline">
          ← Diagnóstico
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{symptom.title}</h1>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">O que costuma ser</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          {symptom.likelyCauses.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-lg border-2 p-4">
        <h2 className="text-xl font-semibold">O que fazer</h2>
        <p className="mt-2">{symptom.fix}</p>
      </section>

      {theory.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Para entender melhor</h2>
          <ul className="mt-2 space-y-1">
            {theory.map((t) => (
              <li key={t.slug}>
                <Link href={`/teoria/${t.slug}`} className="underline">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(models.length > 0 || related.length > 0) && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Onde mexer</h2>
          <ul className="mt-2 space-y-1">
            {models.map((m) => (
              <li key={m.slug}>
                Modelo:{" "}
                <Link href={`/modelos/${m.slug}`} className="underline">
                  {m.name}
                </Link>
              </li>
            ))}
            {related.map(({ param, model }) => (
              <li key={param.id}>
                Parâmetro:{" "}
                <Link href={`/modelos/${model.slug}#${param.id}`} className="underline">
                  {model.name} · {param.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
