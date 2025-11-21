"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchSidebar, {
  defaultFilters,
  type SearchFilters,
} from "@/app/components/SearchSidebar";
import ProjectCard from "@/app/components/ProjectCard";
import type { Project } from "@/app/types";
import { getProjectBedrooms, getProjectSpots } from "@/app/utils/projectFilters";

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

type InfoTab = "investor" | "education";

export default function HomePageClient() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [infoTab, setInfoTab] = useState<InfoTab>("investor");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/projects");
        if (!res.ok) {
          throw new Error(`Erro ao carregar projetos: ${res.status}`);
        }

        const data = (await res.json()) as Project[];

        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Não foi possível carregar os empreendimentos no momento.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

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
  }, [projects, filters, view]);

  const filtersAreActive = hasActiveFilters(filters);

  let totalLabel: string;
  if (loading) {
    totalLabel = "Carregando empreendimentos...";
  } else if (error) {
    totalLabel = "Não foi possível carregar os empreendimentos";
  } else if (filteredProjects.length === 0) {
    totalLabel = "Nenhum empreendimento encontrado";
  } else if (filteredProjects.length === 1) {
    totalLabel = "1 empreendimento encontrado";
  } else {
    totalLabel = `${filteredProjects.length} empreendimentos encontrados`;
  }

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
                {!loading &&
                  !error &&
                  filtersAreActive &&
                  filteredProjects.length > 0
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

            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            {loading && !error && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Carregando empreendimentos...
              </div>
            )}

            {!loading && !error && filteredProjects.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nenhum empreendimento encontrado com os filtros selecionados.
                Tente remover alguns filtros ou ampliar a faixa de localização.
              </div>
            )}

            {!loading &&
              !error &&
              filteredProjects.map((project) => (
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

        {/* BLOCO INFERIOR EM ABAS: INVESTIDOR / CONTEÚDO */}
        <section className="mb-6 mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {/* Abas */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => setInfoTab("investor")}
              className={`rounded-full px-4 py-2 text-xs font-medium sm:text-sm ${
                infoTab === "investor"
                  ? "bg-slate-900 text-white ring-1 ring-slate-900/10"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Para investidores
            </button>
            <button
              type="button"
              onClick={() => setInfoTab("education")}
              className={`rounded-full px-4 py-2 text-xs font-medium sm:text-sm ${
                infoTab === "education"
                  ? "bg-slate-900 text-white ring-1 ring-slate-900/10"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Entender a compra
            </button>
          </div>

          {/* Conteúdo das abas */}
          {infoTab === "investor" && (
            <div className="mt-4 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-emerald-900 sm:text-lg">
                  Simule o potencial de um investimento
                </h2>
                <p className="mt-1 max-w-2xl text-xs text-emerald-800 sm:text-sm">
                  Entenda rapidamente o potencial de valorização de um
                  empreendimento na planta em Belo Horizonte e veja se faz
                  sentido para o seu perfil.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-emerald-900 sm:text-sm">
                    Valor do imóvel (exemplo)
                  </p>
                  <div className="mt-1 h-10 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-900">
                    R$ 500.000
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-900 sm:text-sm">
                    Prazo de obra estimado
                  </p>
                  <div className="mt-1 h-10 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-900">
                    36 meses
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-900 sm:text-sm">
                    Valorização projetada (exemplo)
                  </p>
                  <div className="mt-1 h-10 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-900">
                    +30% no período
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-[11px] text-emerald-800 sm:text-xs">
                  Simulação meramente ilustrativa, sem garantia de retorno. Cada
                  empreendimento tem características próprias de risco,
                  liquidez e valorização. Fale com um especialista para avaliar
                  o seu caso.
                </p>
                <button
                  type="button"
                  onClick={openGlobalWhatsModal}
                  className="h-10 rounded-xl bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-700 sm:px-5 sm:text-sm"
                >
                  Quero simular com um corretor
                </button>
              </div>
            </div>
          )}

          {infoTab === "education" && (
            <div className="mt-4 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Aprenda antes de fechar negócio
                </h2>
                <p className="mt-1 max-w-2xl text-xs text-slate-600 sm:text-sm">
                  Entenda os principais pontos da compra de um imóvel na planta
                  em BH e tome decisões com mais segurança.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Imóvel na planta x pronto
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Diferenças de entrada, prazo, financiamento e potencial de
                    valorização.
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Como funciona a entrada parcelada
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Estrutura típica de pagamento durante a obra e o que
                    observar no contrato.
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Comprar para investir em BH
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Como avaliar localização, tipologia e ticket pensando em
                    revenda ou renda.
                  </p>
                </article>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
