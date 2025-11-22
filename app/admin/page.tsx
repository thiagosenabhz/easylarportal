// app/admin/page.tsx
"use client";

import { useState } from "react";
import NewProjectForm from "./NewProjectForm";
import CRMBoard from "./CRMBoard";

type Tab = "project" | "crm" | "reports";

/**
 * Página do painel de administrador.
 *
 * Importante:
 * - Mantém toda a lógica aqui mesmo, sem dynamic import.
 * - Não exporta nenhuma constante chamada `dynamic`.
 * - Isso evita loops estranhos de renderização no build do Next/Vercel.
 *
 * ÚNICA alteração deste passo: substituir o placeholder simples
 * pelo layout de abas com formulário / CRM.
 */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("project");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Painel do Administrador
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Área interna para cadastrar empreendimentos, organizar leads e,
        no futuro, visualizar relatórios do EasyLar.
      </p>

      {/* Abas superiores */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "project"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Novo Empreendimento
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("crm")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "crm"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          CRM
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "reports"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Relatórios
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="mt-8">
        {activeTab === "project" && <NewProjectForm />}

        {activeTab === "crm" && <CRMBoard />}

        {activeTab === "reports" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Relatórios (em breve)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Nesta aba você vai ter dashboards de estoque, funil de leads,
              desempenho de campanhas e muito mais. Por enquanto é só um
              placeholder para não travar o build do site.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
