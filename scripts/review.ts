import { mkdirSync, writeFileSync } from "node:fs";
import { content, TRACKS } from "../src/content/index.ts";
import type { Param } from "../src/content/schema.ts";

const FIELDS = [
  ["note", "Nota"],
  ["ifRaise", "Se subir"],
  ["ifLower", "Se baixar"],
  ["commonMistake", "Erro comum"],
] as const;

const material = (p: Param) => {
  const values = [
    p.default && `padrão ${p.default}`,
    p.suggested && `sugerido ${p.suggested}`,
    p.range && `faixa ${p.range}`,
  ].filter(Boolean);
  return `${values.join(" · ") || "sem valor numérico"}. ${p.what}`;
};

mkdirSync("revisao", { recursive: true });
const summary: string[] = [];
let order = 1;

for (const [track, label] of Object.entries(TRACKS)) {
  const lines: string[] = [];
  let count = 0;

  for (const model of content.models.filter((m) => m.track === track)) {
    const items = model.params
      .map((id) => content.params.find((p) => p.id === id)!)
      .filter((p) => p.complement);
    if (!items.length) continue;

    lines.push(`## ${model.name}`, "");
    for (const p of items) {
      lines.push(`### ${p.name}  \`${p.id}\``, "", `**No material:** ${material(p)}`, "");
      for (const [key, name] of FIELDS) {
        const text = p.complement?.[key];
        if (!text) continue;
        count++;
        lines.push(`- [ ] **${name}:** ${text}`, `  - Correção:`);
      }
      lines.push("");
    }
  }

  const file = `${String(order++).padStart(2, "0")}-${track}.md`;
  const head = [
    `# Revisão dos complementos · ${label}`,
    "",
    `${count} itens escritos pelo autor do guia, que **não** vêm do material da OIAA e aparecem no site com a etiqueta "complemento".`,
    "",
    "Para cada item: marque `[x]` se estiver correto; se precisar mudar, escreva o texto certo em **Correção**; para cortar, escreva `CORTAR` em Correção.",
    "",
  ];
  writeFileSync(`revisao/${file}`, [...head, ...lines].join("\n"));
  summary.push(`| ${label} | ${count} | [${file}](${file}) |`);
}

writeFileSync(
  "revisao/README.md",
  [
    "# Revisão dos complementos",
    "",
    "Gerado por `npm run content:review` a partir dos dados do site. Não edite à mão a parte gerada: devolva as decisões e elas são aplicadas nos dados.",
    "",
    "| Trilha | Itens | Arquivo |",
    "|---|---|---|",
    ...summary,
    "",
  ].join("\n"),
);
console.log(summary.join("\n"));
