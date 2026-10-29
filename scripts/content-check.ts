import { content } from "../src/content/index.ts";
import { listComplements, validateContent } from "../src/content/validate.ts";

const errors = validateContent(content);
const complements = listComplements(content);

console.log(
  `Conteúdo: ${content.models.length} modelos, ${content.params.length} parâmetros, ` +
    `${content.symptoms.length} sintomas, ${content.theory.length} teorias, ${content.glossary.length} termos.`,
);
console.log(`Itens de complemento para revisão: ${complements.length}`);
for (const c of complements) console.log(`  - ${c}`);

if (errors.length) {
  console.error(`\n${errors.length} erro(s) de integridade:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("\nIntegridade OK.");
