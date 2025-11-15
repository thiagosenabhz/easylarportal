import Link from "next/link";
import React from "react";
import type { Project } from "@/app/types/project";
import { formatCurrencyBRL } from "@/app/utils/currency";

type Props = {
  project: Project;
};

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const priceLabel = formatCurrencyBRL(project.priceFrom);

  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-gray-900">
            {project.name}
          </h2>
          <p className="text-xs text-gray-600">
            {project.neighborhood} • {project.city} {project.state && `• ${project.state}`}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {/* Exemplo de chips de tipologias/vagas/diferenciais.
               Mantém o que você já tinha, este bloco é apenas ilustrativo. */}
          </div>

          <div className="mt-3 text-xs text-gray-700">
            <p className="font-medium">A partir de</p>
            <p className="text-sm font-semibold text-gray-900">{priceLabel}</p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-2">
          {project.isLaunch ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
              LANÇAMENTO
            </span>
          ) : (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700">
              OPORTUNIDADE
            </span>
          )}

          <p className="mt-2 text-[11px] text-gray-500">
            Entrega prevista:{" "}
            {project.deliveryDateDisplay ?? project.deliveryDate}
          </p>

          <Link
            href={`/imovel/${project.slug}`}
            className="mt-4 rounded-full bg-gray-900 px-4 py-1 text-xs font-semibold text-white hover:bg-gray-800"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
