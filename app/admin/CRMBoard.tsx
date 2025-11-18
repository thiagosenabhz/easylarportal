"use client";

import { useState } from "react";

type StageId =
  | "novo"
  | "tentativa"
  | "contato"
  | "visita_agendada"
  | "visita_realizada"
  | "venda"
  | "desistencia";

type Lead = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  stage: StageId;
};

const STAGES: { id: StageId; title: string }[] = [
  { id: "novo", title: "Novo contato" },
  { id: "tentativa", title: "Tentativa de contato" },
  { id: "contato", title: "Contato realizado" },
  { id: "visita_agendada", title: "Visita agendada" },
  { id: "visita_realizada", title: "Visita realizada" },
  { id: "venda", title: "Venda" },
  { id: "desistencia", title: "Desistência" }
];

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Novo Lead",
    email: "",
    stage: "novo"
  },
  {
    id: "2",
    name: "Novo Lead",
    email: "",
    stage: "novo"
  }
];

type NewLeadFormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const emptyForm: NewLeadFormState = {
  name: "",
  email: "",
  phone: "",
  notes: ""
};

export default function CRMBoard() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<NewLeadFormState>(emptyForm);

  const handleOpenModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeField = (
    field: keyof NewLeadFormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      // Validação mínima: nome obrigatório
      return;
    }

    const newLead: Lead = {
      id: String(Date.now()),
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      notes: form.notes.trim() || undefined,
      stage: "novo"
    };

    setLeads((prev) => [newLead, ...prev]);
    setIsModalOpen(false);
    setForm(emptyForm);
  };

  const leadsByStage = STAGES.reduce<Record<StageId, Lead[]>>(
    (acc, stage) => {
      acc[stage.id] = [];
      return acc;
    },
    {} as Record<StageId, Lead[]>
  );

  for (const lead of leads) {
    leadsByStage[lead.stage].push(lead);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">CRM</h2>

        <button
          type="button"
          onClick={handleOpenModal}
          className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Novo contato
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <section
            key={stage.id}
            className="flex h-[420px] min-w-[220px] flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-800">
              {stage.title}
            </h3>

            <div className="mt-3 flex-1 space-y-3 overflow-y-auto">
              {leadsByStage[stage.id].length === 0 && (
                <p className="text-xs text-gray-400">
                  Nenhum contato neste estágio.
                </p>
              )}

              {leadsByStage[stage.id].map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-sm"
                >
                  <p className="font-semibold text-gray-800">{lead.name}</p>
                  {lead.email && (
                    <p className="mt-1 text-gray-600">E-mail: {lead.email}</p>
                  )}
                  {lead.phone && (
                    <p className="mt-0.5 text-gray-600">
                      Telefone: {lead.phone}
                    </p>
                  )}
                  {lead.notes && (
                    <p className="mt-1 text-gray-500">{lead.notes}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Próximo passo: ativar drag-and-drop e persistir no Supabase.
      </p>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">
              Novo contato
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="lead-name"
                  className="text-xs font-medium text-gray-700"
                >
                  Nome*
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleChangeField("name", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    htmlFor="lead-email"
                    className="text-xs font-medium text-gray-700"
                  >
                    E-mail
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      handleChangeField("email", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="lead-phone"
                    className="text-xs font-medium text-gray-700"
                  >
                    Telefone (DDD)
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      handleChangeField("phone", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="(31) 99999-9999"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="lead-notes"
                  className="text-xs font-medium text-gray-700"
                >
                  Observações
                </label>
                <textarea
                  id="lead-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    handleChangeField("notes", e.target.value)
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Resumo da demanda, interesse, renda, empreendimento etc."
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                >
                  Salvar contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
