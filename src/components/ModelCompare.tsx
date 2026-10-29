import Link from "next/link";
import type { Model, Param } from "../content/schema.ts";
import type { TrackCompare } from "../content/compare.ts";

const valueOf = (p: Param | undefined) => {
  if (!p) return "—";
  const main = p.suggested ?? p.default ?? "—";
  return p.range ? `${main} · ${p.range}` : main;
};

export function ModelCompare({
  models,
  params,
  compare,
}: {
  models: Model[];
  params: Param[];
  compare: TrackCompare;
}) {
  const byId = new Map(params.map((p) => [p.id, p]));

  const rows: { label: string; cells: string[] }[] = [
    { label: "Perfil", cells: models.map((m) => m.profile) },
    { label: "Escolha se", cells: models.map((m) => m.chooseIf) },
    { label: "O que esperar", cells: models.map((m) => m.expect) },
    { label: "Pegadinha", cells: models.map((m) => m.pitfall) },
    ...compare.rows.map((r) => ({
      label: r.label,
      cells: models.map((m) => valueOf(byId.get(r.params[m.slug]))),
    })),
    { label: "Parâmetros na ficha", cells: models.map((m) => String(m.params.length)) },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <td className="border p-3" />
            {models.map((m) => (
              <th key={m.slug} scope="col" className="border p-3 text-base">
                <Link href={`/modelos/${m.slug}`} className="inline-block py-1 underline">
                  {m.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="w-36 border p-3 align-top font-semibold">
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td key={models[i].slug} className="border p-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
