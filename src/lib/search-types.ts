export type DocType = "modelo" | "parametro" | "sintoma" | "teoria" | "termo";

export interface SearchDoc {
  id: string;
  type: DocType;
  title: string;
  /** contexto curto, ex.: o modelo dono do parâmetro */
  subtitle?: string;
  text: string;
  href: string;
}

export const TYPE_LABELS: Record<DocType, string> = {
  modelo: "Modelos",
  parametro: "Parâmetros",
  sintoma: "Diagnóstico",
  teoria: "Teoria",
  termo: "Glossário",
};
