"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { projects } from "@/app/_data/projects";
import SearchSidebar, {
  defaultFilters,
  type SearchFilters
} from "@/app/components/SearchSidebar";
import { ProjectCard } from "@/app/components/ProjectCard";
import type { Project } from "@/app/types";

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

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const filteredProjects = useMemo(() => {
    let list = projects.filter((p) => {
      // Cidade
      if (filters.city && p.city !== filters.city) return false;

      // Bairro
      if (
        filters.neighborhoods.length > 0 &&
        !filters.neighborhoods.includes(p.neighborhood)
      ) {
        return false;
      }

      const projectBedrooms = getProjectBedrooms(p);
      const projectSpots = getProjectSpots(p);

      // Tipologias (quartos)
      if (filters.bedrooms.length > 0) {
        const matchesBedrooms = filters.bedrooms.some((n) =>
          projectBedrooms.includes(n)
        );
        if (!matchesBedrooms) return false;
      }

      // Vagas
      if (filters.spots.length > 0) {
        const matchesSpots = filters.spots.some((s) =>
          projectSpots.includes(s)
        );
        if (!matchesSpots) return false;
      }

      // Diferenciais
      if (filters.hasCoverage && !p.typologies.coverage) return false;
      if (filters.hasPrivativa && !p.typologies.privativa) return false;
      if (filters.hasAvulsa && !p.parking.avulsa) return false;

      return true;
    });

    // Filtro global de visão (Pré-abertura / Oportunidades)
    if (view === "launch") {
      list = list.filter((p) => p.isLaunch);
    } else if (view === "stock") {
      list = list.filter((p) => !p.isLaunch);
    }

    return list;
  }, [filters, view]);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[20rem,1fr] lg:px-6">
      <SearchSidebar
        projects={projects}
        value={filters}
        onChange={setFilters}
      />

      <section className="space-y-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {filteredProjects.length === 0 && (
          <p className="text-sm text-gray-600">
            Nenhum empreendimento encontrado com os filtros selecionados.
          </p>
        )}
      </section>
    </main>
  );
}
