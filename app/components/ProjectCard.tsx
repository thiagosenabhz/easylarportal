"use client";

import Link from "next/link";
import type { Project } from "@/app/types/project";

interface ProjectCardProps {
  project: Project;
}

/**
 * Formata número em moeda BRL (R$ X.XXX,00)
 */
function formatPriceBRL(value: number | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return "";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

/**
 * Recebe "YYYY-MM-DD" ou "YYYY-MM" e devolve "MM/AAAA".
 * Se vier em formato inesperado, devolve o valor original.
 */
function formatDeliveryDate(date: string | undefined): string {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length < 2) return date;

  const [year, month] = parts;
  if (!year || !month) return date;

  return `${month}/${year}`;
}

/**
 * Monta os chips de tipologia (2 quartos, 3 quartos, cobertura, área privativa)
 */
function getTypologyChips(project: Project): string[] {
  const chips: string[] = [];

  if (project.typologies?.studio) chips.push("Studio");
  if (project.typologies?.oneBedroom) chips.push("1 quarto");
  if (project.typologies?.twoBedroom) chips.push("2 quartos");
  if (project.typologies?.threeBedroom) chips.push("3 quartos");
  if (project.typologies?.coverage) chips.push("Cobertura");
  if (project.typologies?.privativa) chips.push("Área privativa");

  return chips;
}

/**
 * Monta os chips de vagas (sem vaga, 1 vaga, 2 vagas, vaga avulsa)
 */
function getParkingChips(project: Project): string[] {
  const chips: string[] = [];

  if (project.parking?.spots0) chips.push("Sem vaga");
  if (project.parking?.spots1) chips.push("1 vaga");
  if (project.parking?.spots2) chips.push("2 vagas");
  if (project.parking?.avulsa) chips.push("Vaga avulsa");

  return chips;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const typologyChips = getTypologyChips(project);
  const parkingChips = getParkingChips(project);

  const priceLabel = formatPriceBRL(project.priceFrom);
  const deliveryLabel = formatDeliveryDate(project.deliveryDate);

  const statusLabel = project.isLaunch ? "LANÇAMENTO" : "OPORTUNIDADE";
  const statusClasses = project.isLaunch
    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
    : "bg-blue-100 text-blue-700 border border-blue-200";

  return (
    <article className="flex items-stretch justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
      {/* Coluna esquerda: informações principais */}
      <div className="flex flex-1 flex-col gap-1">
        <h2 className="text-sm font-semibold text-gray-900">
          {project.name}
        </h2>

        <p className="text-[12px] text-gray-600">
          {project.neighborhood} • {project.city}
        </p>

        {/* Chips de tipologia e vagas */}
        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
          {typologyChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-gray-100 px-3 py-[3px] text-gray-700"
            >
              {chip}
            </span>
          ))}

          {parkingChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-gray-100 px-3 py-[3px] text-gray-700"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Preço e entrega prevista */}
        <div className="mt-3 text-[12px] text-gray-700">
          {priceLabel && (
            <p className="font-semibold">
              A partir de{" "}
              <span className="font-bold text-gray-900">{priceLabel}</span>
            </p>
          )}

          {deliveryLabel && (
            <p className="mt-1 text-[11px] text-gray-500">
              Entrega prevista:{" "}
              <span className="font-medium text-gray-700">
                {deliveryLabel}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Coluna direita: status e botão */}
      <div className="flex flex-col items-end justify-between gap-3 pl-6">
        <div
          className={`rounded-full px-3 py-[4px] text-[11px] font-semibold ${statusClasses}`}
        >
          {statusLabel}
        </div>

        <Link
          href={`/imovel/${project.slug}`}
          className="rounded-full bg-gray-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-gray-800"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
