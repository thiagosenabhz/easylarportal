"use client";

import React, { useState } from "react";
import type { Project } from "@/app/types";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  typology: string;
  notes?: string;
  purpose: "moradia" | "investimento";
  stage:
    | "novo"
    | "tentativa"
    | "contato"
    | "visita_agendada"
    | "visita_realizada"
    | "venda"
    | "desistencia";
};

type TabId = "novo" | "crm" | "relatorios";

const STAGES: { id: Lead["stage"]; label: string }[] = [
  { id: "novo", label: "Novo contato" },
  { id: "tentativa", label: "Tentativa de contato" },
  { id: "contato", label: "Contato realizado" },
  { id: "visita_agendada", label: "Visita agendada" },
  { id: "visita_realizada", label: "Visita realizada" },
  { id: "venda", label: "Venda" },
  { id: "desistencia", label: "Desistência" }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("novo");
  const [leads, setLeads] = useState<Lead[]>([]);

  const [projectDraft, setProjectDraft] = useState<Partial<Project>>({
    typologies: {},
    parking: {},
    leisure: []
  });

  const handleCreateLead = (formData: FormData) => {
    const newLead: Lead = {
      id: String(Date.now()),
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      typology: String(formData.get("typology") || ""),
      notes: String(formData.get("notes") || ""),
      purpose:
        (formData.get("purpose") === "investimento"
          ? "investimento"
          : "moradia") || "moradia",
      stage: "novo"
    };

    setLeads((current) => [newLead, ...current]);
  };

  const handleMoveLead = (id: string, newStage: Lead["stage"]) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              stage: newStage
            }
          : lead
      )
    );
  };

  const handleProjectDraftChange = (field: keyof Project, value: any) => {
    setProjectDraft((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectCheckboxGroup = (
    group: "typologies" | "parking",
    key: string,
    checked: boolean
  ) => {
    setProjectDraft((prev) => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [key]: checked
      }
    }));
  };

  const handleSaveDraft = (formData: FormData) => {
    const leisureRaw = String(formData.get("leisure") || "");
    const leisureList = leisureRaw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const draft: Partial<Project> = {
      ...projectDraft,
      name: String(formData.get("name") || ""),
      slug: String(formData.get("slug") || ""),
      city: String(formData.get("city") || ""),
      neighborhood: String(formData.get("neighborhood") || ""),
      openingDate: String(formData.get("openingDate") || ""),
      deliveryDate: String(formData.get("deliveryDate") || ""),
      priceFrom: Number(formData.get("priceFrom") || 0),
      thumb: String(formData.get("thumb") || ""),
      updatedFacade: String(formData.get("updatedFacade") || ""),
      leisure: leisureList
    };

    console.log("Rascunho de empreendimento (para futura integração):", draft);
    alert(
      "Rascunho salvo no console do navegador. Integração com banco (Supabase) será feita em etapa futura."
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Painel do Administrador
      </h1>

      {/* Tabs */}
      <div className="mb-8 inline-flex rounded-full border border-gray-200 bg-gray-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("novo")}
          className={`rounded-full px-4 py-1.5 ${
            activeTab === "novo"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          Novo Empreendimento
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("crm")}
          className={`rounded-full px-4 py-1.5 ${
            activeTab === "crm"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          CRM
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("relatorios")}
          className={`rounded-full px-4 py-1.5 ${
            activeTab === "relatorios"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          Relatórios
        </button>
      </div>

      {activeTab === "novo" && (
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Novo empreendimento
          </h2>
          <p className="text-sm text-gray-600">
            Este formulário gera um rascunho completo do empreendimento alinhado
            ao modelo oficial do EasyLar. Em uma próxima etapa, será integrado
            ao Supabase/banco de dados.
          </p>

          <form
            action={handleSaveDraft}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Nome do empreendimento
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Slug (URL)
              </label>
              <input
                name="slug"
                required
                placeholder="ex.: azul-e-verde"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Cidade
              </label>
              <input
                name="city"
                placeholder="Belo Horizonte - MG"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Bairro
              </label>
              <input
                name="neighborhood"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Data de abertura de vendas
              </label>
              <input
                name="openingDate"
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Previsão de entrega
              </label>
              <input
                name="deliveryDate"
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Preço a partir de (R$)
              </label>
              <input
                name="priceFrom"
                type="number"
                min={0}
                step={1000}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Itens das áreas de lazer (separados por vírgula)
              </label>
              <textarea
                name="leisure"
                rows={3}
                placeholder="Piscina, Salão de festas, Academia..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Tipologias */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-xs font-semibold text-gray-800">
                Tipologias
              </h3>
              <div className="flex flex-wrap gap-4 text-xs">
                {[
                  ["studio", "Studio"],
                  ["oneBedroom", "1 quarto"],
                  ["twoBedroom", "2 quartos"],
                  ["threeBedroom", "3 quartos"],
                  ["coverage", "Cobertura"],
                  ["privativa", "Área privativa"]
                ].map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleProjectCheckboxGroup(
                          "typologies",
                          key,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vagas */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-xs font-semibold text-gray-800">Vagas</h3>
              <div className="flex flex-wrap gap-4 text-xs">
                {[
                  ["spots0", "Sem vaga"],
                  ["spots1", "1 vaga"],
                  ["spots2", "2 vagas"],
                  ["avulsa", "Vaga avulsa"]
                ].map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleProjectCheckboxGroup(
                          "parking",
                          key,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Imagens */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Imagem principal (thumb) - caminho em /public
              </label>
              <input
                name="thumb"
                placeholder="/empreendimentos/slug/thumb.jpg"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Fachada atual (opcional) - caminho em /public
              </label>
              <input
                name="updatedFacade"
                placeholder="/empreendimentos/slug/fachada_atual.jpg"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Salvar rascunho
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === "crm" && (
        <section className="space-y-6">
          {/* Formulário rápido de lead */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">CRM</h2>
            <p className="mb-4 text-sm text-gray-600">
              Adicione leads rapidamente e organize-os pelas etapas de funil.
            </p>

            <form
              action={handleCreateLead}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Nome
                </label>
                <input
                  name="name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  name="phone"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Tipologia de interesse
                </label>
                <input
                  name="typology"
                  placeholder="2 quartos, cobertura, privativa..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-700">
                  Finalidade
                </span>
                <div className="flex gap-4 text-xs">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="purpose"
                      value="moradia"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Moradia</span>
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name="purpose"
                      value="investimento"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Investimento</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Adicionar lead
                </button>
              </div>
            </form>
          </div>

          {/* Kanban simplificado */}
          <div className="grid grid-cols-1 gap-4 overflow-x-auto md:grid-cols-4 lg:grid-cols-7">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className="flex min-h-[220px] flex-col rounded-2xl bg-white p-3 shadow-sm"
              >
                <h3 className="mb-2 text-xs font-semibold uppercase text-gray-700">
                  {stage.label}
                </h3>
                <div className="flex flex-1 flex-col gap-2">
                  {leads
                    .filter((lead) => lead.stage === stage.id)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-[11px]"
                      >
                        <div className="mb-1 font-semibold text-gray-900">
                          {lead.name}
                        </div>
                        <div className="mb-1 space-y-0.5 text-gray-700">
                          <div>{lead.phone}</div>
                          {lead.email && <div>{lead.email}</div>}
                          {lead.typology && <div>{lead.typology}</div>}
                        </div>
                        {lead.notes && (
                          <p className="mb-1 line-clamp-3 text-[10px] text-gray-600">
                            {lead.notes}
                          </p>
                        )}
                        <div className="mt-1 flex flex-wrap gap-1">
                          {STAGES.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleMoveLead(lead.id, s.id)}
                              className={`rounded-full border px-2 py-0.5 text-[9px] ${
                                s.id === lead.stage
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-gray-300 text-gray-600 hover:bg-white"
                              }`}
                            >
                              {s.label.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "relatorios" && (
        <section className="rounded-2xl bg-white p-6 text-sm text-gray-700 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Relatórios
          </h2>
          <p>
            Nesta primeira versão, os relatórios ainda não estão conectados a
            um banco de dados. Em etapas futuras, aqui você verá indicadores
            como:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>Quantidade de leads por estágio;</li>
            <li>Conversão por empreendimento;</li>
            <li>Origem dos leads (portal, anúncios, WhatsApp);</li>
            <li>Tempo médio entre primeiro contato e venda.</li>
          </ul>
        </section>
      )}
    </main>
  );
}
