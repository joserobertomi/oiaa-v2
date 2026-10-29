import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { ParamCard } from "@/components/ParamCard";
import { content, TRACKS } from "@/content";

export function generateStaticParams() {
  return content.models.map((m) => ({ slug: m.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => content.models.find((m) => m.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = find((await params).slug);
  return { title: model?.name };
}

export default async function Page({ params }: Props) {
  const model = find((await params).slug);
  if (!model) notFound();

  const params_ = model.params.map((id) => content.params.find((p) => p.id === id)!);
  const adjust = params_.filter((p) => p.adjust);
  const rest = params_.filter((p) => !p.adjust);

  const facts = [
    ["Escolha se", model.chooseIf],
    ["O que esperar", model.expect],
    ["Já vem pronto", model.ready],
  ];

  return (
    <article>
      <header>
        <p className="text-sm opacity-70">{TRACKS[model.track]}</p>
        <h1 className="flex flex-wrap items-center gap-3 text-2xl font-semibold">
          {model.name} <Badge>{model.profile}</Badge>
        </h1>
        <p className="mt-2">{model.summary}</p>
      </header>

      <dl className="mt-6 grid gap-4 md:grid-cols-3">
        {facts.map(([label, text]) => (
          <div key={label} className="rounded-lg border p-4">
            <dt className="font-semibold">{label}</dt>
            <dd className="mt-1 text-sm">{text}</dd>
          </div>
        ))}
      </dl>

      <aside role="note" className="mt-4 rounded-lg border-2 p-4">
        <strong>Pegadinha: </strong>
        {model.pitfall}
      </aside>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Os botões que você ajusta</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {adjust.map((p) => (
            <ParamCard key={p.id} param={p} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Demais parâmetros</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {rest.map((p) => (
            <ParamCard key={p.id} param={p} />
          ))}
        </div>
      </section>
    </article>
  );
}
