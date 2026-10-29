import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { content } from "@/content";
import { APP_NAME } from "@/lib/nav";

const SHORTCUTS = [
  {
    href: "/modelos",
    title: "Qual modelo uso?",
    text: "Responda a três perguntas e compare os modelos de cada trilha lado a lado.",
  },
  {
    href: "/diagnostico",
    title: "Algo deu errado",
    text: "Descreva o que está acontecendo e veja a causa provável e o que ajustar.",
  },
];

export default function Home() {
  const more = [
    { href: "/parametros", label: "Parâmetros", count: content.params.length },
    { href: "/teoria", label: "Teoria", count: content.theory.length },
    { href: "/glossario", label: "Glossário", count: content.glossary.length },
    { href: "/checklist", label: "Checklist antes de submeter", count: content.symptoms.filter((s) => s.check).length },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold">{APP_NAME}</h1>
      <p className="mt-2 max-w-2xl text-lg">
        Guia de consulta rápida para a Fase 2 da OIAA 2026: quando usar cada modelo e como
        configurar cada parâmetro.
      </p>

      <div className="mt-6">
        <SearchBox variant="hero" />
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {SHORTCUTS.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="block h-full rounded-lg border-2 p-6 hover:border-4">
              <span className="text-xl font-semibold">{s.title}</span>
              <span className="mt-2 block">{s.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {more.map((m) => (
          <li key={m.href}>
            <Link href={m.href} className="block h-full rounded-lg border p-4 hover:border-2">
              <span className="font-semibold">{m.label}</span>
              <span className="block text-sm opacity-70">{m.count} itens</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
