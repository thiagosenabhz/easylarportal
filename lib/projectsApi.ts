// lib/projectsApi.ts
import { supabase } from "@/lib/supabaseClient";
import type { Project } from "@/app/types";

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  state: string;
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

function mapRowToProject(row: ProjectRow): Project {
  const bedrooms = row.typology_bedrooms ?? [];

  const parkingSpots = row.parking_spots ?? [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    neighborhood: row.neighborhood,
    state: row.state,
    openingDate: row.opening_date ?? "",
    deliveryDate: row.delivery_date ?? "",
    priceFrom: row.price_from ?? 0,
    isLaunch: row.is_launch ?? false,
    thumb: row.thumb_url ?? "",
    updatedFacade: row.updated_facade_url ?? "",
    leisure: row.leisure_items ?? [],
    typologies: {
      bedrooms,
      coverage: row.typology_coverage ?? false,
      privativa: row.typology_privativa ?? false,
      // flags de compatibilidade com código antigo
      studio: bedrooms.includes(0),
      oneBedroom: bedrooms.includes(1),
      twoBedroom: bedrooms.includes(2),
      threeBedroom: bedrooms.includes(3),
    },
    parking: {
      spots: parkingSpots,
      avulsa: row.parking_avulsa ?? false,
      // compatibilidade com campos antigos
      spots0: parkingSpots.includes(0),
      spots1: parkingSpots.includes(1),
      spots2: parkingSpots.includes(2),
    },
    showFacadeComparison: row.show_facade_comparison ?? false,
  };
}

export async function listProjectsFromSupabase(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[EasyLar] Erro ao carregar projects do Supabase:", error.message);
    return [];
  }

  if (!data) return [];

  return (data as ProjectRow[]).map(mapRowToProject);
}
