import { CONTENT_DATE } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="border-t">
      <p className="mx-auto max-w-5xl px-4 py-4 text-xs opacity-80">
        Guia de estudo independente, baseado no material da Imersão da Fase 2 da OIAA 2026
        (copiado em {CONTENT_DATE}). Itens com a etiqueta “complemento” são orientações do autor,
        fora do material oficial. Na dúvida, vale o material da organização.
      </p>
    </footer>
  );
}
