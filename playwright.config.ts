import { defineConfig, devices } from "@playwright/test";

const PORT = 3150;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  // Usa o Chrome instalado na máquina, sem baixar navegador.
  projects: [{ name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    // Falha se a porta já estiver ocupada: reaproveitar um servidor antigo testaria um build velho.
    reuseExistingServer: false,
  },
});
