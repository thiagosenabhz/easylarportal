"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { projects } from "@/app/_data/projects";
import SearchSidebar, {
  defaultFilters,
  type SearchFilters,
} from "@/app/components/SearchSidebar";
import ProjectCard from "@/app/components/ProjectCard";
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

function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    !!filters.city ||
    filters.neighborhoods.length > 0 ||
    filters.bedrooms.length > 0 ||
    filters.spots.length > 0 ||
    filters.hasCoverage ||
    filters.hasPrivativa ||
    filters.hasAvulsa
  );
}

function openGlobalWhatsModal() {
  // Fecha qualquer modal que esteja aberto
  const ev = new KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(ev);

  // Clica no botão global de WhatsApp (mesmo fluxo do FloatingWhatsApp)
  const openBtn = document.querySelector<HTMLButtonElement>(
    'button[aria-label="WhatsApp"]'
  );
  openBtn?.click();
}

export default function HomePageClient() {
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

  const totalLabel =
    filteredProjects.length === 0
      ? "Nenhum empreendimento encontrado"
      : filteredProjects.length === 1
      ? "1 empreendimento encontrado"
      : `${filteredProjects.length} empreendimentos encontrados`;

  const filtersAreActive = hasActiveFilters(filters);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {/* HERO DE BUSCA */}
        <section className="mb-6 rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-sm sm:px-6">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Apartamentos na planta em Belo Horizonte
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Filtre por localização, quartos e vagas para encontrar o
            empreendimento ideal para moradia ou investimento.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Localização
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 sm:text-sm">
                    Belo Horizonte - MG
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:text-sm"
              >
                Moradia
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 sm:text-sm"
              >
                Investimento
              </button>
            </div>

            <button
              type="button"
              className="h-10 rounded-xl bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 sm:px-6"
              onClick={() => {
                const el = document.getElementById("easylar-results");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              Ver oportunidades
            </button>
          </div>
        </section>

        {/* ÁREA PRINCIPAL: FILTROS + LISTA + MAPA/ESPAÇO FUTURO */}
        <section className="grid gap-6 lg:grid-cols-[20rem,minmax(0,1.4fr),minmax(0,22rem)]">
          {/* Filtros laterais */}
          <div className="lg:self-start">
            <SearchSidebar
              projects={projects}
              value={filters}
              onChange={setFilters}
            />
          </div>

          {/* Lista de empreendimentos */}
          <section
            id="easylar-results"
            className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-700 sm:text-sm">
                {totalLabel}
                {filtersAreActive && filteredProjects.length > 0
                  ? " · filtros aplicados"
                  : ""}
              </p>
              {view === "launch" && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 sm:text-xs">
                  Pré-abertura · condições especiais de lançamento
                </span>
              )}
              {view === "stock" && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 sm:text-xs">
                  Oportunidades em estoque · unidades prontas ou avançadas
                </span>
              )}
            </div>

            {filteredProjects.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nenhum empreendimento encontrado com os filtros selecionados.
                Tente remover alguns filtros ou ampliar a faixa de localização.
              </div>
            )}

            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>

          {/* Slot de mapa / futuro */}
          <aside className="hidden lg:block lg:self-start">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">
                  Mapa em breve
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Em breve você poderá visualizar os empreendimentos
                  diretamente no mapa de Belo Horizonte, filtrando por região e
                  proximidade de pontos de interesse.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* Faixa para investidores */}
        <section className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-6 shadow-sm sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-emerald-900 sm:text-lg">
                Para investidores
              </h2>
              <p className="mt-1 max-w-xl text-xs text-emerald-800 sm:text-sm">
                Entenda rapidamente o potencial de valorização de um
                empreendimento na planta em Belo Horizonte e veja se faz sentido
                para o seu perfil.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-emerald-900 sm:text-sm">
                Valor do imóvel (exemplo)
              </p>
              <div className="mt-1 h-10 rounded-xl border border-emerald-200 bg-white px-3 text-sm font-medium text-emerald-900">
                R$ 500.000
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-900 sm:text-sm">
                Prazo de obra estimado
              </p>
              <div className="mt-1 h-10 rounded-xl border border-emerald-200 bg-white px-3 text-sm font-medium text-emerald-900">
                36 meses
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-900 sm:text-sm">
                Valorização projetada (exemplo)
              </p>
              <div className="mt-1 h-10 rounded-xl border border-emerald-200 bg-white px-3 text-sm font-medium text-emerald-900">
                +30% no período
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[11px] text-emerald-800 sm:text-xs">
              Simulação meramente ilustrativa, sem garantia de retorno. Cada
              empreendimento tem características próprias de risco, liquidez e
              valorização. Fale com um especialista para avaliar o seu caso.
            </p>
            <button
              type="button"
              onClick={openGlobalWhatsModal}
              className="h-10 rounded-xl bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-700 sm:px-5 sm:text-sm"
            >
              Quero simular com um corretor
            </button>
          </div>
        </section>

        {/* Faixa de conteúdo educativo */}
        <section className="mb-6 mt-8">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Aprenda antes de fechar negócio
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-600 sm:text-sm">
            Entenda os principais pontos da compra de um imóvel na planta em BH
            e tome decisões com mais segurança.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Imóvel na planta x pronto
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Diferenças de entrada, prazo, financiamento e potencial de
                valorização.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Como funciona a entrada parcelada
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Estrutura típica de pagamento durante a obra e o que observar no
                contrato.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Comprar para investir em BH
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Como avaliar localização, tipologia e ticket pensando em
                revenda ou renda.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
