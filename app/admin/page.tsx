"use client";

import React, { useState } from "react";
import CRMBoard from "@/app/components/admin/CRMBoard";

type Tab = "novo" | "crm" | "relatorios";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("novo");

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        Painel do Administrador
      </h1>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("novo")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "novo"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Novo Empreendimento
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("crm")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "crm"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          CRM
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("relatorios")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "relatorios"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Relatórios
        </button>
      </div>

      {activeTab === "novo" && <NewProjectForm />}
      {activeTab === "crm" && (
        <section>
          <CRMBoard />
        </section>
      )}
      {activeTab === "relatorios" && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
          Em breve: relatórios de leads, funil e desempenho de lançamentos.
        </section>
      )}
    </main>
  );
}

const NewProjectForm: React.FC = () => {
  // Este formulário ainda não persiste em banco.
  // Serve como rascunho alinhado ao modelo oficial EasyLar, já pensando em Supabase.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(
      "Rascunho de empreendimento salvo localmente.\nA persistência real será adicionada após integração com o banco de dados (Supabase)."
    );
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-800">
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Novo empreendimento
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Este formulário gera um rascunho completo do empreendimento alinhado ao
        modelo oficial do EasyLar. Em uma próxima etapa, será integrado ao
        Supabase/banco de dados.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Nome do empreendimento
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Slug (URL)
            </label>
            <input
              type="text"
              placeholder="ex.: azul-e-verde"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Cidade
            </label>
            <input
              type="text"
              defaultValue="Belo Horizonte - MG"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Bairro
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Data de abertura de vendas
            </label>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Previsão de entrega
            </label>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Preço a partir de (R$)
            </label>
            <input
              type="text"
              placeholder="ex.: 420.000,00"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Itens das áreas de lazer (separados por vírgula)
            </label>
            <input
              type="text"
              placeholder="Piscina, Salão de festas, Academia..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-gray-700">
            Tipologias
          </span>
          <div className="mt-1 flex flex-wrap gap-4 text-xs">
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>Studio</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>1 quarto</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>2 quartos</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>3 quartos</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>Cobertura</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>Área privativa</span>
            </label>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-gray-700">
            Vagas
          </span>
          <div className="mt-1 flex flex-wrap gap-4 text-xs">
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>Sem vaga</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>1 vaga</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>2 vagas</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" />
              <span>Vaga avulsa</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Imagem principal (thumb) – caminho em /public
            </label>
            <input
              type="text"
              placeholder="/empreendimentos/slug/thumb.jpg"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Fachada atual (opcional) – caminho em /public
            </label>
            <input
              type="text"
              placeholder="/empreendimentos/slug/fachada_atual.jpg"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Imagem de implantação – caminho em /public
            </label>
            <input
              type="text"
              placeholder="/empreendimentos/slug/implantacao.png"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Imagens de lazer (URLs ou caminhos, separados por vírgula)
            </label>
            <input
              type="text"
              placeholder="/empreendimentos/slug/lazer1.png, /empreendimentos/slug/lazer2.png"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Imagens de plantas (URLs ou caminhos, separados por vírgula)
            </label>
            <input
              type="text"
              placeholder="/empreendimentos/slug/planta1.png, /empreendimentos/slug/planta2.png"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Obs.: a edição e exclusão reais de empreendimentos serão ativadas
          após integração com o banco (Supabase). Por enquanto, este formulário
          funciona como rascunho local.
        </p>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Salvar rascunho
          </button>
        </div>
      </form>
    </section>
  );
};
