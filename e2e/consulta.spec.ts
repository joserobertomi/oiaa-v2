import { expect, test } from "@playwright/test";

test("home → busca \"dropout\" → abre a ficha do parâmetro", async ({ page }) => {
  await page.goto("/");
  const busca = page.getByRole("combobox", { name: "Buscar no guia" });
  await busca.fill("dropout");

  await expect(page.getByRole("option").first()).toContainText("dropout");
  await busca.press("Enter");

  await expect(page).toHaveURL(/\/modelos\/[a-z0-9-]+#[a-z0-9-]*dropout$/);
  await expect(page.getByRole("heading", { level: 3, name: "dropout" }).first()).toBeVisible();
});

test("diagnóstico → sintoma → ficha do parâmetro", async ({ page }) => {
  await page.goto("/diagnostico");
  await page.getByRole("link", { name: "O treino cai, mas a validação sobe" }).click();

  await expect(page).toHaveURL(/\/diagnostico\/sobreajuste$/);
  await expect(page.getByRole("heading", { level: 2, name: "O que fazer" })).toBeVisible();

  await page.getByRole("link", { name: "Rede densa · dropout" }).click();
  await expect(page).toHaveURL(/\/modelos\/rede-densa#rede-densa-dropout$/);
  await expect(page.locator("#rede-densa-dropout")).toBeVisible();
});

const TRILHAS = [
  { id: "tabular", modelos: ["Rede densa", "Rede densa com embeddings", "TabNet"] },
  { id: "visao", modelos: ["EfficientNet-B0", "ResNet-50", "ViT-B/16"] },
  { id: "texto", modelos: ["DistilBERT multilíngue", "BERTimbau", "XLM-RoBERTa"] },
];

for (const trilha of TRILHAS) {
  test(`o comparador mostra os 3 modelos da trilha ${trilha.id}`, async ({ page }) => {
    await page.goto("/modelos");
    const colunas = page.locator(`#${trilha.id}`).getByRole("columnheader");
    await expect(colunas).toHaveCount(3);
    await expect(colunas).toHaveText(trilha.modelos);
  });
}

test("do comparador para a ficha de um modelo", async ({ page }) => {
  await page.goto("/modelos");
  await page.locator("#visao").getByRole("columnheader").getByRole("link", { name: "ViT-B/16" }).click();
  await expect(page).toHaveURL(/\/modelos\/vit-b16$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ViT-B/16");
});

test("o checklist tem os 10 erros silenciosos e as caixas marcam", async ({ page }) => {
  await page.goto("/checklist");
  const caixas = page.getByRole("checkbox");
  await expect(caixas).toHaveCount(10);
  await caixas.first().check();
  await expect(caixas.first()).toBeChecked();
});

test("o tema escolhido fica salvo depois de recarregar", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const antes = await html.evaluate((el) => el.classList.contains("dark"));

  await page.getByRole("button", { name: "Alternar tema" }).click();
  await expect(html).toHaveClass(antes ? /^(?!.*\bdark\b)/ : /\bdark\b/);

  await page.reload();
  await expect(html).toHaveClass(antes ? /^(?!.*\bdark\b)/ : /\bdark\b/);
});
