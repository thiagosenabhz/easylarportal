"use client";

import { useState, FormEvent } from "react";
import { parseCurrencyBRL } from "@/app/utils/currency";

type Tab = "project" | "crm" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("project");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">
        Painel do Administrador
      </h1>

      {/* Abas */}
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeTab === "project"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Novo Empreendimento
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("crm")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeTab === "crm"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          CRM
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            activeTab === "reports"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Relatórios
        </button>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "project" && <NewProjectForm />}
      {activeTab === "crm" && <CRMBoard />}
      {activeTab === "reports" && (
        <p className="text-sm text-gray-600">
          Área de relatórios em desenvolvimento.
        </p>
      )}
    </main>
  );
}

/* ========================
   FORMULÁRIO NOVO EMPREENDIMENTO
   ======================== */

function monthToDateString(monthValue: string): string {
  // "2028-04" -> "2028-04-01"
  if (!monthValue) return "";
  const [year, month] = monthValue.split("-");
  if (!year || !month) return "";
  return `${year}-${month}-01`;
}

function NewProjectForm() {
  const [openingMonth, setOpeningMonth] = useState("");
  const [deliveryMonth, setDeliveryMonth] = useState("");
  const [priceInput, setPriceInput] = useState("R$ 0,00");
  const [priceNumeric, setPriceNumeric] = useState(0);

  const handlePriceChange = (value: string) => {
    const { raw, value: numeric } = parseCurrencyBRL(value);
    setPriceInput(raw);
    setPriceNumeric(numeric);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const openingDate = monthToDateString(
      String(formData.get("openingMonth") || "")
    );
    const deliveryDate = monthToDateString(
      String(formData.get("deliveryMonth") || "")
    );

    const payload = {
      name: String(formData.get("name") || ""),
      slug: String(formData.get("slug") || ""),
      city: String(formData.get("city") || ""),
      neighborhood: String(formData.get("neighborhood") || ""),
      openingDate,
      deliveryDate,
      priceFrom: Math.round(priceNumeric),
      amenities: String(formData.get("amenities") || ""),
      // aqui você ainda tem os campos de tipologias, vagas e imagens,
      // que continuam como rascunho local
    };

    console.log("Novo empreendimento (rascunho):", payload);
    alert("Rascunho de empreendimento gerado no console do navegador.");
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Novo empreendimento
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Este formulário gera um rascunho completo do empreendimento alinhado ao
        modelo oficial do EasyLar. Em uma próxima etapa, será integrado ao
        Supabase/banco de dados.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome do empreendimento
            </label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug (URL)
            </label>
            <input
              name="slug"
              required
              placeholder="ex.: azul-e-verde"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              name="city"
              defaultValue="Belo Horizonte - MG"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bairro
            </label>
            <input
              name="neighborhood"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Data somente mês/ano */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Data de abertura de vendas (mês/ano)
            </label>
            <input
              type="month"
              name="openingMonth"
              value={openingMonth}
              onChange={(e) => setOpeningMonth(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Previsão de entrega (mês/ano)
            </label>
            <input
              type="month"
              name="deliveryMonth"
              value={deliveryMonth}
              onChange={(e) => setDeliveryMonth(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Preço com máscara R$ */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Preço a partir de (R$)
          </label>
          <input
            name="priceFromMasked"
            value={priceInput}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Aqui você mantém seus campos de tipologias, vagas e imagens como já tinha antes */}

        <p className="pt-2 text-xs text-gray-500">
          Obs.: a edição e exclusão reais de empreendimentos serão ativadas após
          integração com o banco (Supabase). Por enquanto, este formulário
          funciona como rascunho local.
        </p>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Salvar rascunho
          </button>
        </div>
      </form>
    </section>
  );
}

/* ========================
   CRM (temporário)
   ======================== */

function CRMBoard() {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">CRM</h2>
      <p className="text-sm text-gray-600">
        Kanban e automações do CRM serão reativados aqui. Nesta versão, o foco
        é estabilizar o painel de empreendimentos e o build do projeto.
      </p>
    </section>
  );
}
