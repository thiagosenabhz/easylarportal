"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import NewProjectForm from "./NewProjectForm";

// Carregamos o CRM só no cliente para evitar qualquer problema no build/prerender
const CRMBoard = dynamic(() => import("./CRMBoard"), {
  ssr: false,
  loading: () => (
    <p className="text-sm text-gray-500">Carregando quadro de CRM…</p>
  ),
});

type Tab = "project" | "crm" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("project");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Painel do administrador – área interna
      </h1>

      <p className="mt-2 max-w-3xl text-sm text-gray-700">
        Esta é uma primeira versão estável do painel. Ainda não grava dados em
        banco; vamos conectar o formulário de empreendimento e o CRM em etapas
        separadas, sempre garantindo que o site público continue estável.
      </p>

      {/* Abas principais */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "project"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Novo empreendimento
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("crm")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "crm"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Relatórios / Backup
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {activeTab === "project" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rascunho de novo empreendimento
            </h2>
            <NewProjectForm />
          </section>
        )}

        {activeTab === "crm" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              CRM – quadro interno
            </h2>
            <CRMBoard />
          </section>
        )}

        {activeTab === "reports" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Relatórios e backup (em breve)
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Aqui vamos colocar os botões para exportar um backup em arquivo e
              importar novamente quando precisar. Nesta etapa atual, ainda está
              só como rascunho visual para não impactar o build.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
