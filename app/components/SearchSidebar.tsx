"use client";

import React, { useMemo } from "react";
import type { Project } from "@/app/types";

export type SearchFilters = {
  city?: string;
  neighborhoods: string[];
  bedrooms: number[];
  hasCoverage: boolean;
  hasPrivativa: boolean;
  spots: number[];      // inclui 0 quando usuário selecionar "sem vaga"
  hasAvulsa: boolean;
};

type Props = {
  projects: Project[];
  value: SearchFilters;
  onChange: (filters: SearchFilters) => void;
};

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function getProjectBedrooms(project: Project): number[] {
  if (project.typologies.bedrooms && project.typologies.bedrooms.length > 0) {
    return project.typologies.bedrooms;
  }

  const result: number[] = [];
  if (project.typologies.studio) result.push(0);
  if (project.typologies.oneBedroom) result.push(1);
  if (project.typologies.twoBedroom) result.push(2);
  if (project.typologies.threeBedroom) result.push(3);
  return result;
}

function getProjectSpots(project: Project): number[] {
  if (project.parking.spots && project.parking.spots.length > 0) {
    return project.parking.spots;
  }

  const result: number[] = [];
  if (project.parking.spots0) result.push(0);
  if (project.parking.spots1) result.push(1);
  if (project.parking.spots2) result.push(2);
  return result;
}

export const defaultFilters: SearchFilters = {
  city: undefined,
  neighborhoods: [],
  bedrooms: [],
  hasCoverage: false,
  hasPrivativa: false,
  spots: [],
  hasAvulsa: false
};

const SearchSidebar: React.FC<Props> = ({ projects, value, onChange }) => {
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.city));
    return Array.from(set);
  }, [projects]);

  const filteredByCity = useMemo(
    () => projects.filter((p) => !value.city || p.city === value.city),
    [projects, value.city]
  );

  const availableBedrooms = useMemo(() => {
    const set = new Set<number>();
    filteredByCity.forEach((p) => {
      getProjectBedrooms(p).forEach((n) => set.add(n));
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [filteredByCity]);

  const availableSpotsInfo = useMemo(() => {
    const spotsSet = new Set<number>();
    let hasAvulsa = false;

    filteredByCity.forEach((p) => {
      getProjectSpots(p).forEach((n) => spotsSet.add(n));
      if (p.parking.avulsa) hasAvulsa = true;
    });

    const spots = Array.from(spotsSet).sort((a, b) => a - b);
    const hasZero = spots.includes(0);

    return {
      spots,
      hasZero,
      hasAvulsa
    };
  }, [filteredByCity]);

  const filteredNeighborhoodsBase = useMemo(() => {
    return projects.filter((p) => {
      if (value.city && p.city !== value.city) return false;

      const projectBedrooms = getProjectBedrooms(p);
      const projectSpots = getProjectSpots(p);

      if (value.bedrooms.length > 0) {
        const matchesBedrooms = value.bedrooms.some((n) =>
          projectBedrooms.includes(n)
        );
        if (!matchesBedrooms) return false;
      }

      if (value.spots.length > 0) {
        const matchesSpots = value.spots.some((s) => projectSpots.includes(s));
        if (!matchesSpots) return false;
      }

      if (value.hasCoverage && !p.typologies.coverage) return false;
      if (value.hasPrivativa && !p.typologies.privativa) return false;
      if (value.hasAvulsa && !p.parking.avulsa) return false;

      return true;
    });
  }, [projects, value]);

  const availableNeighborhoods = useMemo(() => {
    const set = new Set<string>();
    filteredNeighborhoodsBase.forEach((p) => set.add(p.neighborhood));
    return Array.from(set);
  }, [filteredNeighborhoodsBase]);

  const handleChange = (partial: Partial<SearchFilters>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-4rem)] w-80 flex-col gap-4 border-r border-gray-200 bg-white px-6 py-4">
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

      {/* Tipologia (quartos) */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Tipologia</h3>
        <div className="flex flex-wrap gap-2">
          {availableBedrooms.map((n) => {
            const isActive = value.bedrooms.includes(n);
            const label =
              n === 0 ? "Studio" : `${n} quarto${n > 1 ? "s" : ""}`;
            return (
              <button
                key={n}
                type="button"
                onClick={() =>
                  handleChange({
                    bedrooms: toggleInArray(value.bedrooms, n)
                  })
                }
                className={`rounded-full border px-3 py-1 text-xs ${
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vagas */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Vagas</h3>
        <div className="flex flex-wrap gap-2">
          {availableSpotsInfo.hasZero && (
            <button
              type="button"
              onClick={() =>
                handleChange({
                  spots: toggleInArray(value.spots, 0)
                })
              }
              className={`rounded-full border px-3 py-1 text-xs ${
                value.spots.includes(0)
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              Sem vaga
            </button>
          )}

          {availableSpotsInfo.spots
            .filter((n) => n > 0)
            .map((n) => {
              const isActive = value.spots.includes(n);
              const label = n === 1 ? "1 vaga" : `${n} vagas`;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    handleChange({
                      spots: toggleInArray(value.spots, n)
                    })
                  }
                  className={`rounded-full border px-3 py-1 text-xs ${
                    isActive
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              );
            })}

          {availableSpotsInfo.hasAvulsa && (
            <button
              type="button"
              onClick={() =>
                handleChange({
                  hasAvulsa: !value.hasAvulsa
                })
              }
              className={`rounded-full border px-3 py-1 text-xs ${
                value.hasAvulsa
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              Vaga avulsa
            </button>
          )}
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
