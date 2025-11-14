"use client";

import React from "react";
import { Project } from "@/app/types";

type Props = {
  project: Project;
  onOpenLeadModal?: (project: Project) => void;
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  });
}

function formatDeliveryDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("pt-BR", {
    month: "2-digit",
    year: "numeric"
  });
}

function buildTypologyLabel(project: Project): string {
  const t = project.typologies;
  const labels: string[] = [];

  if (t.studio) labels.push("Studio");
  if (t.oneBedroom) labels.push("1 quarto");
  if (t.twoBedroom) labels.push("2 quartos");
  if (t.threeBedroom) labels.push("3 quartos");
  if (t.coverage) labels.push("Cobertura");
  if (t.privativa) labels.push("Área privativa");

  return labels.join(" • ");
}

export const ProjectCard: React.FC<Props> = ({ project, onOpenLeadModal }) => {
  const typologyLabel = buildTypologyLabel(project);
  const deliveryLabel = formatDeliveryDate(project.deliveryDate);
  const priceLabel = formatCurrency(project.priceFrom);

  return (
    <article className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md">
      <header className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {project.name}
          </h2>
          <p className="text-xs text-gray-600">
            {project.neighborhood} • {project.city}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {project.isLaunch ? (
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-medium text-emerald-700">
              LANÇAMENTO
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-0.5 text-[11px] font-medium text-blue-700">
              OPORTUNIDADE
            </span>
          )}
          <span className="text-[11px] text-gray-500">
            Entrega prevista: {deliveryLabel}
          </span>
        </div>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-700">
        {typologyLabel && (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1">
            {typologyLabel}
          </span>
        )}
        {project.parking.spots1 && (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1">
            1 vaga
          </span>
        )}
        {project.parking.spots2 && (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1">
            2 vagas
          </span>
        )}
        {project.parking.avulsa && (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1">
            Vaga avulsa
          </span>
        )}
      </div>

      <footer className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500">A partir de</span>
          <span className="text-lg font-semibold text-gray-900">
            {priceLabel}
          </span>
        </div>

        <div className="flex gap-2">
          <a
            href={`/imovel/${project.slug}`}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
          >
            Ver detalhes
          </a>
          {onOpenLeadModal && (
            <button
              type="button"
              onClick={() => onOpenLeadModal(project)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Falar com consultor
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};
