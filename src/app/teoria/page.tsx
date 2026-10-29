import Link from "next/link";
import { content } from "@/content";

export const metadata = { title: "Teoria" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Teoria</h1>
      <p className="mt-2">
        Os conceitos do material em formato de consulta: a resposta curta no topo e uma regra
        de bolso no fim.
      </p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {content.theory.map((t) => (
          <li key={t.slug}>
            <Link href={`/teoria/${t.slug}`} className="block h-full rounded-lg border p-4 hover:border-2">
              <span className="font-semibold">{t.title}</span>
              <span className="mt-1 block text-sm">{t.short}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
