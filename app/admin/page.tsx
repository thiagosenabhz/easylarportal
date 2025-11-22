"use client";

import { useState } from "react";
import NewProjectForm from "./NewProjectForm";
import CRMBoard from "./CRMBoard";

type Tab = "project" | "crm" | "reports";

/**
 * /app/admin/page.tsx
 * Página do painel do administrador com abas:
 * - Novo empreendimento (layout estático já existente)
 * - CRM (usa o componente CRMBoard que você já tem pronto)
 * - Relatórios / Backup (apenas placeholder por enquanto)
 *
 * Importante: esta página continua sendo apenas client-side,
 * sem chamadas ao Supabase, para manter o build estável.
 */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("project");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Cabeçalho */}
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Painel do administrador – área interna
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Esta é uma primeira versão estável do painel. Ainda não gravamos dados em banco;
          vamos conectar o formulário de empreendimento e o CRM em etapas separadas, sempre
          garantindo que o site público continue estável.
        </p>
      </header>

      {/* Ações rápidas / Abas visuais */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Ações rápidas</h2>
        <p className="mt-1 text-xs text-slate-500">
          Estes botões funcionam como atalhos para as seções abaixo. Podemos evoluir
          depois para ter navegação por URL (ex.: /admin?tab=crm).
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("project")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "project"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
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
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
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
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            Relatórios / Backup
          </button>
        </div>
      </section>

      {/* Aba: Novo empreendimento */}
      {activeTab === "project" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <NewProjectForm />
        </section>
      )}

      {/* Aba: CRM */}
      {activeTab === "crm" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 space-y-1">
            <h2 className="text-sm font-semibold text-slate-900">
              CRM de leads – versão atual
            </h2>
            <p className="text-xs text-slate-500">
              Os dados deste CRM continuam sendo armazenados no navegador (localStorage)
              enquanto não conectamos ao Supabase. Assim garantimos que o deploy não quebra.
            </p>
          </div>

          <CRMBoard />
        </section>
      )}

      {/* Aba: Relatórios / Backup (placeholder por enquanto) */}
      {activeTab === "reports" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Relatórios & backup (em breve)
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Este espaço será usado para download e upload de backup dos dados do portal
            (projetos, leads etc.). Na próxima etapa vamos criar os botões para exportar
            um arquivo .json e restaurar um backup manualmente.
          </p>
        </section>
      )}
    </main>
  );
}
