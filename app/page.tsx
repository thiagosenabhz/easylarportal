"use client";

import React, { useMemo, useState } from "react";
import { projects } from "@/app/_data/projects";
import SearchSidebar, {
  defaultFilters,
  type SearchFilters
} from "@/app/components/SearchSidebar";
import { ProjectCard } from "@/app/components/ProjectCard";

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Cidade
      if (filters.city && p.city !== filters.city) return false;

      // Bairro
      if (
        filters.neighborhoods.length > 0 &&
        !filters.neighborhoods.includes(p.neighborhood)
      ) {
        return false;
      }

      // Tipologias
      if (filters.typologies.length > 0) {
        const t = p.typologies;
        const matchesTypology = filters.typologies.some((typo) => {
          if (typo === "studio") return !!t.studio;
          if (typo === "oneBedroom") return !!t.oneBedroom;
          if (typo === "twoBedroom") return !!t.twoBedroom;
          if (typo === "threeBedroom") return !!t.threeBedroom;
          return false;
        });
        if (!matchesTypology) return false;
      }

      // Vagas
      if (filters.parking.length > 0) {
        const park = p.parking;
        const matchesParking = filters.parking.some((pFilter) => {
          if (pFilter === "spots0") return !!park.spots0;
          if (pFilter === "spots1") return !!park.spots1;
          if (pFilter === "spots2") return !!park.spots2;
          if (pFilter === "avulsa") return !!park.avulsa;
          return false;
        });
        if (!matchesParking) return false;
      }

      // Diferenciais
      if (filters.hasCoverage && !p.typologies.coverage) return false;
      if (filters.hasPrivativa && !p.typologies.privativa) return false;

      return true;
    });
  }, [filters]);

  return (
    <main className="mx-auto max-w-7xl px-4 lg:px-6 py-6 grid md:grid-cols-[20rem,1fr] gap-8">
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
