import Link from "next/link";
import { ModelCompare } from "@/components/ModelCompare";
import { content, TRACKS } from "@/content";
import { COMPARE } from "@/content/compare";
import type { Track } from "@/content/schema";

export const metadata = { title: "Modelos" };

export default function Page() {
  const tracks = Object.entries(TRACKS) as [Track, string][];

  return (
    <>
      <h1 className="text-2xl font-semibold">Modelos</h1>
      <p className="mt-2">
        Três modelos por trilha. Escolha a trilha do seu desafio, responda às perguntas e compare
        os modelos lado a lado. Cada nome leva à ficha completa.
      </p>
      <nav aria-label="Trilhas" className="mt-4 flex gap-4 text-sm">
        {tracks.map(([track, label]) => (
          <Link key={track} href={`#${track}`} className="rounded-md border px-3 py-1 hover:border-2">
            {label}
          </Link>
        ))}
      </nav>

      {tracks.map(([track, label]) => {
        const models = content.models.filter((m) => m.track === track);
        const compare = COMPARE[track];
        return (
          <section key={track} id={track} className="mt-10 scroll-mt-4">
            <h2 className="text-xl font-semibold">{label}</h2>

            <h3 className="mt-4 font-semibold">Como decidir</h3>
            <ul className="mt-2 space-y-1">
              {compare.howToChoose.map(({ question, model }) => {
                const m = models.find((x) => x.slug === model)!;
                return (
                  <li key={model}>
                    {question} →{" "}
                    <Link href={`/modelos/${m.slug}`} className="font-medium underline">
                      {m.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <ModelCompare models={models} params={content.params} compare={compare} />
            </div>
          </section>
        );
      })}
    </>
  );
}
