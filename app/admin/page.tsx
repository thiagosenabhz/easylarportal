"use client";

import { useState } from "react";
import NewProjectForm from "./NewProjectForm";
import CRMBoard from "./CRMBoard";

type Tab = "project" | "crm" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("project");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Painel do Administrador
      </h1>

      {/* Abas superiores */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "project"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          Relatórios
        </button>
      </div>

      {/* Conteúdo de cada aba */}
      <div className="mt-8">
        {activeTab === "project" && <NewProjectForm />}

        {activeTab === "crm" && <CRMBoard />}

        {activeTab === "reports" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Relatórios</h2>
            <p className="mt-2 text-sm text-gray-600">
              Área reservada para dashboards e relatórios do EasyLar. Nesta
              versão, os relatórios ainda serão configurados.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
