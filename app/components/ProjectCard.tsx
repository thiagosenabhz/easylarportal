"use client";

import React from "react";
import Link from "next/link";
import type { Project } from "@/app/types";

type Props = {
  project: Project;
};

function normalizeBedrooms(project: Project): number[] {
  if (project.typologies.bedrooms && project.typologies.bedrooms.length > 0) {
    return Array.from(new Set(project.typologies.bedrooms)).sort((a, b) => a - b);
  }

  const result: number[] = [];
  if (project.typologies.studio) result.push(0);
  if (project.typologies.oneBedroom) result.push(1);
  if (project.typologies.twoBedroom) result.push(2);
  if (project.typologies.threeBedroom) result.push(3);

  return Array.from(new Set(result)).sort((a, b) => a - b);
}

function normalizeSpots(project: Project): number[] {
  if (project.parking.spots && project.parking.spots.length > 0) {
    return Array.from(new Set(project.parking.spots)).sort((a, b) => a - b);
  }

  const result: number[] = [];
  if (project.parking.spots0) result.push(0);
  if (project.parking.spots1) result.push(1);
  if (project.parking.spots2) result.push(2);

  return Array.from(new Set(result)).sort((a, b) => a - b);
}

function formatBedroomsLabels(values: number[]): string[] {
  return values.map((n) => {
    if (n === 0) return "Studio";
    return `${n} quarto${n > 1 ? "s" : ""}`;
  });
}

function formatSpotsLabels(values: number[]): string[] {
  return values.map((n) => {
    if (n === 0) return "Sem vaga";
    if (n === 1) return "1 vaga";
    return `${n} vagas`;
  });
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const bedroomsValues = normalizeBedrooms(project);
  const spotsValues = normalizeSpots(project);

  const bedroomsChips = formatBedroomsLabels(bedroomsValues);
  const parkingChips = formatSpotsLabels(spotsValues);

  const hasCoverage = project.typologies.coverage;
  const hasPrivativa = project.typologies.privativa;
  const hasAvulsa = project.parking.avulsa;

  const labelType = project.isLaunch ? "LANÇAMENTO" : "OPORTUNIDADE";
  const labelClass = project.isLaunch
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-blue-50 text-blue-700 border-blue-200";

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(project.priceFrom);

  const formattedDelivery = project.deliveryDate
    ? new Date(project.deliveryDate).toLocaleDateString("pt-BR", {
        month: "2-digit",
        year: "numeric"
      })
    : "";

  return (
    <article className="flex items-stretch justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {project.name}
          </h2>
          <p className="text-xs text-gray-600">
            {project.neighborhood} • {project.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          {bedroomsChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-gray-100 px-3 py-1 text-gray-800"
            >
              {chip}
            </span>
          ))}
          {hasCoverage && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">
              Cobertura
            </span>
          )}
          {hasPrivativa && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">
              Área privativa
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          {parkingChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-gray-100 px-3 py-1 text-gray-800"
            >
              {chip}
            </span>
          ))}
          {hasAvulsa && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">
              Vaga avulsa
            </span>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-600">
          <div className="text-[11px] text-gray-500">A partir de</div>
          <div className="text-lg font-semibold text-gray-900">
            {formattedPrice}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 text-right text-xs">
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase ${labelClass}`}
          >
            {labelType}
          </span>
          {formattedDelivery && (
            <span className="text-[11px] text-gray-600">
              Entrega prevista: {formattedDelivery}
            </span>
          )}
        </div>

        <Link
          href={`/imovel/${project.slug}`}
          className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
};
