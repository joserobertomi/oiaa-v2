import Link from "next/link";
import type { Param } from "../content/schema.ts";
import { Badge } from "./Badge";
import { GlossaryTerm } from "./GlossaryTerm";

const COMPLEMENT_LABELS = [
  ["note", "Nota"],
  ["ifRaise", "Se subir"],
  ["ifLower", "Se baixar"],
  ["commonMistake", "Erro comum"],
] as const;

export function ParamCard({
  param,
  modelName,
  headingLevel = 3,
}: {
  param: Param;
  /** quando informado, mostra o modelo dono com link para a ficha */
  modelName?: string;
  /** o título do cartão segue o nível da seção que o contém */
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  const extras = COMPLEMENT_LABELS.filter(([key]) => param.complement?.[key]);

  return (
    <article id={param.id} className="scroll-mt-4 rounded-lg border p-4">
      <header className="flex flex-wrap items-center gap-2">
        <Heading className="font-semibold">{param.name}</Heading>
        {param.adjust && <Badge>você ajusta</Badge>}
        {modelName && (
          <Link
            href={`/modelos/${param.modelSlug}#${param.id}`}
            className="ml-auto inline-block py-1 text-sm underline"
          >
            {modelName}
          </Link>
        )}
      </header>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="opacity-70">Padrão</dt>
          <dd>{param.default ?? "—"}</dd>
        </div>
        <div>
          <dt className="opacity-70">Sugerido</dt>
          <dd>{param.suggested ?? "—"}</dd>
        </div>
        <div>
          <dt className="opacity-70">Faixa</dt>
          <dd>{param.range ?? "—"}</dd>
        </div>
      </dl>

      <p className="mt-3">{param.what}</p>

      {param.glossary && (
        <p className="mt-2 flex flex-wrap gap-x-3 text-sm">
          <span className="opacity-70">Termos:</span>
          {param.glossary.map((id) => (
            <GlossaryTerm key={id} id={id} />
          ))}
        </p>
      )}

      {extras.length > 0 && (
        <div className="mt-3 space-y-1 border-t pt-3 text-sm">
          <Badge>complemento</Badge>
          {extras.map(([key, label]) => (
            <p key={key}>
              <strong>{label}:</strong> {param.complement?.[key]}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}
