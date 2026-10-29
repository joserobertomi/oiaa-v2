import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { APP_NAME } from "@/lib/nav";
import "./globals.css";

export const metadata: Metadata = {
  // Conteúdo reescrito do material da OIAA: circula só pelo link, fora dos buscadores.
  robots: { index: false, follow: false },
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description:
    "Guia de consulta rápida para a Fase 2 da OIAA 2026: quando usar cada modelo e como configurar cada parâmetro.",
};

// Aplica o tema salvo antes da primeira pintura, para não piscar.
const temaInicial = `try{var t=localStorage.getItem("tema");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicial }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
