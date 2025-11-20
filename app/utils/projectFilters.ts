import type { Project } from "@/app/types";

/**
 * Retorna a lista de quantidades de quartos disponíveis
 * para um empreendimento, em formato padronizado.
 *
 * Prioriza o campo novo `typologies.bedrooms`, mas mantém
 * compatibilidade com os campos antigos (studio, oneBedroom, etc.).
 */
export function getProjectBedrooms(project: Project): number[] {
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

/**
 * Retorna a lista de quantidades de vagas disponíveis
 * para um empreendimento, em formato padronizado.
 *
 * Prioriza o campo novo `parking.spots`, mas mantém
 * compatibilidade com os campos antigos (spots0, spots1, spots2).
 */
export function getProjectSpots(project: Project): number[] {
  if (project.parking.spots && project.parking.spots.length > 0) {
    return project.parking.spots;
  }

  const result: number[] = [];
  if (project.parking.spots0) result.push(0);
  if (project.parking.spots1) result.push(1);
  if (project.parking.spots2) result.push(2);
  return result;
}
