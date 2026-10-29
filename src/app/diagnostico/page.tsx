import Link from "next/link";
import { content } from "@/content";
import { SYMPTOM_GROUPS } from "@/content/symptoms";

export const metadata = { title: "Diagnóstico" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Diagnóstico</h1>
      <p className="mt-2">
        Descreva o que está acontecendo e veja a causa provável e o que ajustar.
        Antes de submeter, passe também pelo <Link href="/checklist" className="underline">checklist</Link>.
      </p>
      {Object.entries(SYMPTOM_GROUPS).map(([group, label]) => (
        <section key={group} className="mt-8">
          <h2 className="text-xl font-semibold">{label}</h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {content.symptoms
              .filter((s) => s.group === group)
              .map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/diagnostico/${s.slug}`}
                    className="block h-full rounded-lg border p-4 hover:border-2"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
