import Link from "next/link";
import type { FC } from "react";
import HomePageClient from "./HomePageClient";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

type HomePageProps = {
  searchParams?: SearchParams;
};

const HomePage: FC<HomePageProps> = ({ searchParams }) => {
  const viewParam = (searchParams?.view as string | undefined) || "launch";

  return (
    <>
      <HeroSection activeView={viewParam} />
      <HomePageClient />
    </>
  );
};

export default HomePage;

/* =========================================
   HERO SECTION EASYLAR
   ========================================= */

type HeroSectionProps = {
  activeView: string;
};

const HeroSection: FC<HeroSectionProps> = ({ activeView }) => {
  return (
    <section className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-16">
        {/* Título + subtítulo */}
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Encontre seu próximo imóvel em Belo Horizonte.
          </h1>
          <p className="mt-3 text-sm text-slate-200 sm:text-base">
            Lançamentos na planta e oportunidades exclusivas com atendimento
            especializado EasyLar.
          </p>
        </div>

        {/* Pills de categoria (Na planta / Oportunidades) */}
        <div className="mt-6 flex flex-wrap gap-2">
          <HeroPill
            href="/?view=launch"
            label="Na planta"
            active={activeView === "launch" || !activeView}
          />
          <HeroPill
            href="/?view=stock"
            label="Oportunidades"
            active={activeView === "stock"}
          />
          {/* Futuras categorias (Prontos, Casas, Lotes etc.)
              serão adicionadas aqui, mas apenas quando houver inventário. */}
        </div>

        {/* Caixa de busca principal */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-lg">
          <form
            className="flex flex-col gap-3 md:flex-row md:items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-1">
              <label className="sr-only" htmlFor="hero-search">
                Buscar imóveis
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                {/* Ícone de lupa simples */}
                <span
                  aria-hidden="true"
                  className="inline-flex h-4 w-4 items-center justify-center text-slate-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.57-4.23 6.5 6.5 0 10-6.5 6.5 6.471 6.471 0 004.23-1.57l.27.28v.79L20 20.5 21.5 19 15.5 14zM10 14a4 4 0 110-8 4 4 0 010 8z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Digite bairro, empreendimento ou tipologia…"
                  className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 md:w-auto"
            >
              Buscar imóveis
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-500">
            ⭐ Atendimento 5 estrelas para clientes em Belo Horizonte.
          </p>
        </div>
      </div>
    </section>
  );
};

/* =========================================
   HERO PILL COMPONENT
   ========================================= */

type HeroPillProps = {
  href: string;
  label: string;
  active?: boolean;
};

const HeroPill: FC<HeroPillProps> = ({ href, label, active }) => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition";
  const activeClasses =
    "border-blue-500 bg-blue-500 text-white shadow-sm";
  const inactiveClasses =
    "border-slate-600 bg-white/5 text-slate-100 hover:bg-white/10";

  const className = `${baseClasses} ${
    active ? activeClasses : inactiveClasses
  }`;

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
};
