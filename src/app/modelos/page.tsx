import Link from "next/link";
import { content, TRACKS } from "@/content";

export const metadata = { title: "Modelos" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Modelos</h1>
      {Object.entries(TRACKS).map(([track, label]) => {
        const models = content.models.filter((m) => m.track === track);
        if (!models.length) return null;
        return (
          <section key={track} className="mt-8">
            <h2 className="text-xl font-semibold">{label}</h2>
            <ul className="mt-3 grid gap-4 md:grid-cols-3">
              {models.map((m) => (
                <li key={m.slug} className="rounded-lg border p-4">
                  <Link href={`/modelos/${m.slug}`} className="font-semibold underline">
                    {m.name}
                  </Link>
                  <p className="text-sm opacity-70">{m.profile}</p>
                  <p className="mt-2 text-sm">{m.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
