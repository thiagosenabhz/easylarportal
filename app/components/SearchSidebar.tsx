"use client";

import React, { useMemo } from "react";
import { Project } from "@/app/types";

export type SearchFilters = {
  city?: string;
  neighborhoods: string[];
  typologies: ("studio" | "oneBedroom" | "twoBedroom" | "threeBedroom")[];
  hasCoverage: boolean;
  hasPrivativa: boolean;
  parking: ("spots0" | "spots1" | "spots2" | "avulsa")[];
};

type Props = {
  projects: Project[];
  value: SearchFilters;
  onChange: (filters: SearchFilters) => void;
};

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export const defaultFilters: SearchFilters = {
  city: undefined,
  neighborhoods: [],
  typologies: [],
  hasCoverage: false,
  hasPrivativa: false,
  parking: []
};

const SearchSidebar: React.FC<Props> = ({ projects, value, onChange }) => {
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.city));
    return Array.from(set);
  }, [projects]);

  const filteredByCityAndTypology = useMemo(() => {
    return projects.filter((p) => {
      if (value.city && p.city !== value.city) return false;

      if (value.typologies.length > 0) {
        const t = p.typologies;
        const matchesTypology = value.typologies.some((typo) => {
          if (typo === "studio") return !!t.studio;
          if (typo === "oneBedroom") return !!t.oneBedroom;
          if (typo === "twoBedroom") return !!t.twoBedroom;
          if (typo === "threeBedroom") return !!t.threeBedroom;
          return false;
        });
        if (!matchesTypology) return false;
      }

      if (value.parking.length > 0) {
        const park = p.parking;
        const matchesParking = value.parking.some((pFilter) => {
          if (pFilter === "spots0") return !!park.spots0;
          if (pFilter === "spots1") return !!park.spots1;
          if (pFilter === "spots2") return !!park.spots2;
          if (pFilter === "avulsa") return !!park.avulsa;
          return false;
        });
        if (!matchesParking) return false;
      }

      if (value.hasCoverage && !p.typologies.coverage) return false;
      if (value.hasPrivativa && !p.typologies.privativa) return false;

      return true;
    });
  }, [projects, value]);

  const availableNeighborhoods = useMemo(() => {
    const set = new Set<string>();
    filteredByCityAndTypology.forEach((p) => set.add(p.neighborhood));
    return Array.from(set);
  }, [filteredByCityAndTypology]);

  const handleChange = (partial: Partial<SearchFilters>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <aside className="sticky top-20 flex h-[calc(100vh-5rem)] w-80 flex-col gap-4 border-r border-gray-200 bg-white px-6 py-6">
      {/* Cidade */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Cidade</h3>
        <div className="flex flex-col gap-2">
          {availableCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() =>
                handleChange({
                  city: value.city === city ? undefined : city,
                  neighborhoods: []
                })
              }
              className={`rounded-full border px-3 py-1 text-xs ${
                value.city === city
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Bairro */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Bairro</h3>
        <div className="flex flex-wrap gap-2">
          {availableNeighborhoods.map((b) => {
            const isActive = value.neighborhoods.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() =>
                  handleChange({
                    neighborhoods: toggleInArray(value.neighborhoods, b)
                  })
                }
                className={`rounded-full border px-3 py-1 text-xs ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tipologia */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Tipologia</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "studio", label: "Studio" },
            { key: "oneBedroom", label: "1 quarto" },
            { key: "twoBedroom", label: "2 quartos" },
            { key: "threeBedroom", label: "3 quartos" }
          ].map((t) => {
            const isActive = value.typologies.includes(
              t.key as SearchFilters["typologies"][number]
            );
            return (
              <button
                key={t.key}
                type="button"
                onClick={() =>
                  handleChange({
                    typologies: toggleInArray(
                      value.typologies,
                      t.key as SearchFilters["typologies"][number]
                    )
                  })
                }
                className={`rounded-full border px-3 py-1 text-xs ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vagas */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Vagas</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "spots0", label: "Sem vaga" },
            { key: "spots1", label: "1 vaga" },
            { key: "spots2", label: "2 vagas" },
            { key: "avulsa", label: "Vaga avulsa" }
          ].map((v) => {
            const isActive = value.parking.includes(
              v.key as SearchFilters["parking"][number]
            );
            return (
              <button
                key={v.key}
                type="button"
                onClick={() =>
                  handleChange({
                    parking: toggleInArray(
                      value.parking,
                      v.key as SearchFilters["parking"][number]
                    )
                  })
                }
                className={`rounded-full border px-3 py-1 text-xs ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diferenciais */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Diferenciais
        </h3>
        <div className="flex flex-col gap-2 text-xs text-gray-800">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.hasPrivativa}
              onChange={(e) =>
                handleChange({ hasPrivativa: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Área privativa</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.hasCoverage}
              onChange={(e) =>
                handleChange({ hasCoverage: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Cobertura</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export { SearchSidebar };
export default SearchSidebar;
