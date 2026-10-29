"use client";

import { useState } from "react";
import type { Model, Param, Track } from "../content/schema.ts";
import { ParamCard } from "./ParamCard";

const TRACK_LABELS: Record<Track, string> = {
  tabular: "Tabelas",
  visao: "Imagens",
  texto: "Texto",
};

export function ParamExplorer({ models, params }: { models: Model[]; params: Param[] }) {
  const [track, setTrack] = useState<Track | "">("");
  const [modelSlug, setModelSlug] = useState("");

  const modelsInTrack = models.filter((m) => !track || m.track === track);
  const names = new Map(models.map((m) => [m.slug, m.name]));
  const visible = params.filter((p) => {
    const model = models.find((m) => m.slug === p.modelSlug);
    return (!track || model?.track === track) && (!modelSlug || p.modelSlug === modelSlug);
  });

  const select = "rounded-md border bg-background px-2 py-1";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="mb-1 block">Trilha</span>
          <select
            className={select}
            value={track}
            onChange={(e) => {
              setTrack(e.target.value as Track | "");
              setModelSlug("");
            }}
          >
            <option value="">Todas</option>
            {Object.entries(TRACK_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block">Modelo</span>
          <select className={select} value={modelSlug} onChange={(e) => setModelSlug(e.target.value)}>
            <option value="">Todos</option>
            {modelsInTrack.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <p className="ml-auto text-sm" aria-live="polite">
          {visible.length} parâmetros
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((p) => (
          <ParamCard key={p.id} param={p} modelName={names.get(p.modelSlug)} />
        ))}
      </div>
    </div>
  );
}
