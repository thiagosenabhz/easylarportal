// app/utils/supabaseProjects.ts
// Camada de compatibilidade entre o formato do Supabase
// e o tipo Project já utilizado no front.

import type { Project } from "@/app/types";
import { getProjectBedrooms, getProjectSpots } from "@/app/utils/projectFilters";

/**
 * Representa uma linha vinda da tabela (ou view) de empreendimentos
 * no Supabase. Os nomes de coluna aqui são uma sugestão forte
 * para você usar no banco.
 *
 * Exemplo de tabela: "projects"
 *
 * - opening_date / delivery_date: TEXT ou DATE em ISO (YYYY-MM-DD)
 * - leisure_items: TEXT[]
 * - typology_bedrooms: INTEGER[]
 * - parking_spots: INTEGER[]
 */
export type DbProjectRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  state: string | null;
  opening_date: string | null;
  delivery_date: string | null;
  price_from: number | null;
  is_launch: boolean | null;
  thumb_url: string | null;
  updated_facade_url: string | null;
  leisure_items: string[] | null;
  typology_bedrooms: number[] | null;
  typology_coverage: boolean | null;
  typology_privativa: boolean | null;
  parking_spots: number[] | null;
  parking_avulsa: boolean | null;
  show_facade_comparison: boolean | null;
};

/**
 * Converte uma linha do Supabase (DbProjectRow) para o tipo Project
 * usado em toda a aplicação.
 *
 * Mantém compatibilidade com:
 * - typologies.bedrooms (novo modelo)
 * - typologies.studio/oneBedroom/twoBedroom/threeBedroom (modelo antigo)
 * - parking.spots (novo modelo)
 * - parking.spots0/spots1/spots2 (modelo antigo)
 */
export function mapDbProjectToProject(row: DbProjectRow): Project {
  const bedrooms = row.typology_bedrooms ?? [];
  const spots = row.parking_spots ?? [];

  const project: Project = {
    id: row.id ?? row.slug,
    slug: row.slug,
    name: row.name,
    city: row.city,
    neighborhood: row.neighborhood,
    state: row.state ?? "MG",
    openingDate: row.opening_date ?? "",
    deliveryDate: row.delivery_date ?? "",
    priceFrom: row.price_from ?? 0,
    isLaunch: !!row.is_launch,
    thumb: row.thumb_url ?? "",
    updatedFacade: row.updated_facade_url ?? row.thumb_url ?? "",
    leisure: row.leisure_items ?? [],
    typologies: {
      bedrooms,
      coverage: !!row.typology_coverage,
      privativa: !!row.typology_privativa,
      // campos "legado" para compatibilidade com código antigo
      studio: bedrooms.includes(0),
      oneBedroom: bedrooms.includes(1),
      twoBedroom: bedrooms.includes(2),
      threeBedroom: bedrooms.includes(3),
    } as Project["typologies"],
    parking: {
      spots,
      // campos "legado" para compatibilidade com código antigo
      spots0: spots.includes(0),
      spots1: spots.includes(1),
      spots2: spots.includes(2),
      avulsa: !!row.parking_avulsa,
    } as Project["parking"],
    showFacadeComparison: !!row.show_facade_comparison,
  };

  // Usa os utilitários para garantir que o formato final
  // continua alinhado com o que a camada de filtros espera.
  // (Isso não altera nada agora, mas serve como "sanity check"
  // quando você estiver mexendo em dados).
  getProjectBedrooms(project);
  getProjectSpots(project);

  return project;
}

/**
 * Converte uma lista de linhas do Supabase em lista de Project.
 */
export function mapDbProjectsToProjects(rows: DbProjectRow[]): Project[] {
  return rows.map(mapDbProjectToProject);
}
