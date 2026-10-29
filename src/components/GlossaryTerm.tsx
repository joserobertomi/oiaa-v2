import Link from "next/link";
import { glossary } from "../content/glossary.ts";

const terms = new Map(glossary.map((g) => [g.id, g]));

/** Link para a definição do termo no glossário. */
export function GlossaryTerm({ id }: { id: string }) {
  const entry = terms.get(id);
  if (!entry) throw new Error(`Termo de glossário inexistente: ${id}`);
  return (
    <Link href={`/glossario#${id}`} title={entry.definition} className="underline decoration-dotted">
      {entry.term}
    </Link>
  );
}
