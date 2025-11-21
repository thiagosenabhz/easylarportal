"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchSidebar, {
  defaultFilters,
  type SearchFilters,
} from "@/app/components/SearchSidebar";
import ProjectCard from "@/app/components/ProjectCard";
import type { Project } from "@/app/types";
import { supabase } from "@/lib/supabaseClient";

type InfoTab = "investor" | "education";

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

function getProjectBedrooms(project: Project): number[] {
  if (project.typologies?.bedrooms && project.typologies.bedrooms.length > 0) {
    return project.typologies.bedrooms;
  }

  const result: number[] = [];
  if (project.typologies?.studio) result.push(0);
  if (project.typologies?.oneBedroom) result.push(1);
  if (project.typologies?.twoBedroom) result.push(2);
  if (project.typologies?.threeBedroom) result.push(3);
  return result;
}

function getProjectSpots(project: Project): number[] {
  if (project.parking?.spots && project.parking.spots.length > 0) {
    return project.parking.spots;
  }
  return [];
}

function openGlobalWhatsModal() {
  const ev = new KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(ev);

  const openBtn = document.querySelector<HTMLButtonElement>(
    'button[aria-label="WhatsApp"]'
  );
  openBtn?.click();
}

function mapRowToProject(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    neighborhood: row.neighborhood,
    state: row.state,
    openingDate: row.opening_date,
    deliveryDate: row.delivery_date,
    priceFrom: Number(row.price_from ?? 0),
    isLaunch: !!row.is_launch,
    thumb: row.thumb_url,
    updatedFacade: row.updated_facade_url ?? undefined,
    leisure: Array.isArray(row.leisure_items) ? row.leisure_items : [],
    typologies: {
      bedrooms: Array.isArray(row.typology_bedrooms)
        ? row.typology_bedrooms
        : [],
      coverage: !!row.typology_coverage,
      privativa: !!row.typology_privativa,
      studio: false,
      oneBedroom: false,
      twoBedroom: false,
      threeBedroom: false,
    },
    parking: {
      spots: Array.isArray(row.parking_spots) ? row.parking_spots : [],
      avulsa: !!row.parking_avulsa,
    },
    showFacadeComparison: !!row.show_facade_comparison,
  };
}

export default function HomePageClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [infoTab, setInfoTab] = useState<InfoTab>("investor");

  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("name", { ascending: true });

      if (!active) return;

      if (error) {
        console.error("Erro ao carregar projetos do Supabase:", error);
        setError("Não foi possível carregar os empreendimentos.");
        setProjects([]);
      } else if (data) {
        const normalized: Project[] = data.map((row: any) => mapRowToProject(row));
        setProjects(normalized);
      }

      setLoading(false);
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    let list = projects.filter((p) => {
      if (filters.city && p.city !== filters.city) return false;

      if (
        filters.neighborhoods.length > 0 &&
        !filters.neighborhoods.includes(p.neighborhood)
      ) {
        return false;
      }

      const projectBedrooms = getProjectBedrooms(p);
      const projectSpots = getProjectSpots(p);

      if (filters.bedrooms.length > 0) {
        const matchesBedrooms = filters.bedrooms.some((n) =>
          projectBedrooms.includes(n)
        );
        if (!matchesBedrooms) return false;
      }

      if (filters.spots.length > 0) {
        const matchesSpots = filters.spots.some((s) => projectSpots.includes(s));
        if (!matchesSpots) return false;
      }

      if (filters.hasCoverage && !p.typologies.coverage) return false;
      if (filters.hasPrivativa && !p.typologies.privativa) return false;
      if (filters.hasAvulsa && !p.parking.avulsa) return false;

      return true;
    });

    if (view === "launch") {
      list = list.filter((p) => p.isLaunch);
    } else if (view === "stock") {
      list = list.filter((p) => !p.isLaunch);
    }

    return list;
  }, [projects, filters, view]);

  const totalLabel = (() => {
    if (loading) return "Carregando empreendimentos...";
    if (filteredProjects.length === 0) return "Nenhum empreendimento encontrado";
    if (filteredProjects.length === 1) return "1 empreendimento encontrado";
    return `${filteredProjects.length} empreendimentos encontrados`;
  })();

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
                {!loading && filtersAreActive && filteredProjects.length > 0
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
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700 sm:text-sm">
                {error}
              </div>
            )}

            {!loading && filteredProjects.length === 0 && !error && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nenhum empreendimento encontrado com os filtros selecionados.
                Tente remover alguns filtros ou ampliar a faixa de localização.
              </div>
            )}

            {loading && (
              <div className="space-y-3 text-xs text-slate-500 sm:text-sm">
                <p>Carregando lista de empreendimentos...</p>
              </div>
            )}

            {!loading &&
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
