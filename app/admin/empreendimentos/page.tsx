import Link from "next/link";
import { listProjectsFromSupabase } from "@/lib/projectsApi";
import type { Project } from "@/app/types";

function formatPrice(value: number | null | undefined): string {
  if (!value || value <= 0) return "A consultar";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatLaunchStatus(project: Project): { label: string; className: string } {
  if (project.isLaunch) {
    return {
      label: "Lançamento",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }
  return {
    label: "Estoque / Pronto",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  };
}

export const dynamic = "force-dynamic";

export default async function AdminEmpreendimentosPage() {
  const projects: Project[] = await listProjectsFromSupabase();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Empreendimentos
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Visualize os empreendimentos cadastrados no EasyLar. Esta tela é apenas de leitura por enquanto.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
            >
              ← Voltar para o site
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6">
            <p className="text-xs text-slate-600 sm:text-sm">
              {projects.length === 0
                ? "Nenhum empreendimento cadastrado no momento."
                : projects.length === 1
                ? "1 empreendimento cadastrado."
                : `${projects.length} empreendimentos cadastrados.`}
            </p>

            <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 sm:text-xs">
              Admin · Somente leitura (fase 1)
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
              Assim que você cadastrar empreendimentos pelo painel, eles vão aparecer aqui.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Empreendimento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Localização
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      A partir de
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((project) => {
                    const launch = formatLaunchStatus(project);
                    return (
                      <tr key={project.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 align-top sm:px-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">
                              {project.name}
                            </span>
                            <span className="mt-0.5 text-xs text-slate-500">
                              slug: <code className="rounded bg-slate-100 px-1 py-0.5">{project.slug}</code>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-sm text-slate-700 sm:px-6">
                          <div className="flex flex-col">
                            <span>{project.neighborhood}</span>
                            <span className="text-xs text-slate-500">
                              {project.city} · {project.state}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top sm:px-6">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${launch.className}`}
                          >
                            {launch.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-sm text-slate-900 sm:px-6">
                          {formatPrice(project.priceFrom)}
                        </td>
                        <td className="px-4 py-3 align-top text-right sm:px-6">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/imovel/${project.slug}`}
                              className="inline-flex items-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 sm:text-xs"
                            >
                              Ver página
                            </Link>
                            <button
                              type="button"
                              disabled
                              className="inline-flex cursor-not-allowed items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 sm:text-xs"
                            >
                              Editar (em breve)
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
