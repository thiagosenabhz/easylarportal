"use client";

import { useState } from "react";
import NewProjectForm from "./NewProjectForm";
import CRMBoard from "./CRMBoard";

type Tab = "project" | "crm" | "reports";

export default function AdminShellClient() {
  const [activeTab, setActiveTab] = useState<Tab>("project");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Painel do Administrador
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Área interna para cadastrar novos empreendimentos, acompanhar leads
        e visualizar relatórios. Versão de teste, focada em manter o deploy
        estável enquanto evoluímos as ferramentas de administração.
      </p>

      {/* Abas */}
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

      {/* Conteúdo da aba ativa */}
      <div className="mt-8 space-y-6">
        {activeTab === "project" && (
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:p-6">
            <NewProjectForm />
          </section>
        )}

        {activeTab === "crm" && (
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:p-6">
            <CRMBoard />
          </section>
        )}

        {activeTab === "reports" && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Relatórios do EasyLar
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Em breve você poderá visualizar gráficos e indicadores dos leads,
              desempenho dos empreendimentos e funil de vendas aqui dentro do
              painel. Nesta etapa, estamos garantindo apenas que a página
              administrativa esteja estável em produção.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
