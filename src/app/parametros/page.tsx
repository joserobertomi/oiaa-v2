import { ParamExplorer } from "@/components/ParamExplorer";
import { content } from "@/content";

export const metadata = { title: "Parâmetros" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Parâmetros</h1>
      <p className="mt-2 mb-6">
        Cada parâmetro com valor padrão, sugerido e faixa. Itens marcados como
        complemento são orientações do autor, fora do material da OIAA.
      </p>
      <ParamExplorer models={content.models} params={content.params} />
    </>
  );
}
