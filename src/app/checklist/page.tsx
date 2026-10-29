import Link from "next/link";
import { content } from "@/content";

export const metadata = { title: "Checklist" };

export default function Page() {
  const items = content.symptoms.filter((s) => s.check);

  return (
    <>
      <h1 className="text-2xl font-semibold">Checklist antes de submeter</h1>
      <p className="mt-2">
        Estes {items.length} erros rodam sem mensagem nenhuma e custam pontos. Marque cada item
        antes de enviar. As marcas não são salvas: valem só enquanto a página está aberta.
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((s) => (
          <li key={s.slug} className="flex items-start gap-3 rounded-lg border p-4">
            <input id={s.slug} type="checkbox" className="mt-1 size-5" />
            <div>
              <label htmlFor={s.slug} className="font-medium">
                {s.check}
              </label>
              <p className="text-sm">
                <Link href={`/diagnostico/${s.slug}`} className="inline-block py-1 underline">
                  Por que isso importa
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
