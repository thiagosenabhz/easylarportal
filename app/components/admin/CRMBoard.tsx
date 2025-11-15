"use client";

import React, { useMemo, useState } from "react";

type LeadStage =
  | "novo"
  | "tentativa"
  | "contato"
  | "visita_agendada"
  | "visita_realizada"
  | "venda"
  | "desistencia";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  purpose: "moradia" | "investimento";
  notes: string;
  stage: LeadStage;
};

const STAGE_LABELS: Record<LeadStage, string> = {
  novo: "Novo contato",
  tentativa: "Tentativa de contato",
  contato: "Contato realizado",
  visita_agendada: "Visita agendada",
  visita_realizada: "Visita realizada",
  venda: "Venda",
  desistencia: "Desistência"
};

type ColumnProps = {
  stage: LeadStage;
  leads: Lead[];
  onDropLead: (leadId: string, targetStage: LeadStage) => void;
  onDeleteLead: (leadId: string) => void;
};

const KanbanColumn: React.FC<ColumnProps> = ({
  stage,
  leads,
  onDropLead,
  onDeleteLead
}) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const leadId = event.dataTransfer.getData("text/plain");
    if (leadId) {
      onDropLead(leadId, stage);
    }
  };

  return (
    <div
      className="flex min-h-[220px] flex-1 flex-col rounded-xl border border-gray-200 bg-gray-50 p-3"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="mb-2 text-xs font-semibold uppercase text-gray-600">
        {STAGE_LABELS[stage]}
      </h3>
      <div className="flex flex-1 flex-col gap-2">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="cursor-grab rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-sm active:cursor-grabbing"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", lead.id);
              event.dataTransfer.effectAllowed = "move";
            }}
          >
            <div className="mb-1 flex items-center justify-between">
              <strong className="text-[11px] font-semibold text-gray-900">
                {lead.name}
              </strong>
              <button
                type="button"
                onClick={() => onDeleteLead(lead.id)}
                className="text-[10px] text-red-500 hover:text-red-600"
              >
                Excluir
              </button>
            </div>
            <div className="text-[11px] text-gray-700">
              <div>{lead.phone}</div>
              <div>{lead.email}</div>
              <div className="mt-1 text-[10px] text-gray-500">
                {lead.interest}
              </div>
            </div>
            <div className="mt-1 text-[10px] text-gray-500">
              Finalidade:{" "}
              {lead.purpose === "moradia" ? "Moradia" : "Investimento"}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

type CRMBoardProps = {
  initialLeads?: Lead[];
};

export const CRMBoard: React.FC<CRMBoardProps> = ({ initialLeads = [] }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    if (!search.trim()) return leads;

    const term = search.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
    );
  }, [leads, search]);

  const leadsByStage = useMemo(() => {
    const map: Record<LeadStage, Lead[]> = {
      novo: [],
      tentativa: [],
      contato: [],
      visita_agendada: [],
      visita_realizada: [],
      venda: [],
      desistencia: []
    };

    filteredLeads.forEach((lead) => {
      map[lead.stage].push(lead);
    });

    return map;
  }, [filteredLeads]);

  const handleDropLead = (leadId: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, stage } : lead))
    );
  };

  const handleDeleteLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId) || null;
    setLeadToDelete(lead);
  };

  const confirmDeleteLead = () => {
    if (!leadToDelete) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
    setLeadToDelete(null);
  };

  const handleAddLead = (lead: Omit<Lead, "id">) => {
    const newLead: Lead = {
      ...lead,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700">
            Buscar lead
          </label>
          <input
            type="text"
            placeholder="Nome, telefone ou e-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
        >
          + Novo lead
        </button>
      </div>

      <div className="flex gap-3">
        {(
          Object.keys(STAGE_LABELS) as Array<LeadStage>
        ).map((stage: LeadStage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            leads={leadsByStage[stage]}
            onDropLead={handleDropLead}
            onDeleteLead={handleDeleteLead}
          />
        ))}
      </div>

      {isModalOpen && (
        <LeadModalForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddLead}
        />
      )}

      {leadToDelete && (
        <ConfirmDeleteModal
          lead={leadToDelete}
          onCancel={() => setLeadToDelete(null)}
          onConfirm={confirmDeleteLead}
        />
      )}
    </section>
  );
};

type LeadModalFormProps = {
  onClose: () => void;
  onSubmit: (lead: Omit<Lead, "id">) => void;
};

const LeadModalForm: React.FC<LeadModalFormProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [purpose, setPurpose] = useState<"moradia" | "investimento">("moradia");
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit({
      name,
      phone,
      email,
      interest,
      purpose,
      notes,
      stage: "novo"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Novo lead
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Nome
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Tipologia de interesse
              </label>
              <input
                type="text"
                placeholder="2 quartos, cobertura, privativa..."
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-700">
              Finalidade
            </span>
            <div className="mt-1 flex gap-4 text-xs">
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="purpose"
                  value="moradia"
                  checked={purpose === "moradia"}
                  onChange={() => setPurpose("moradia")}
                />
                <span>Moradia</span>
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="purpose"
                  value="investimento"
                  checked={purpose === "investimento"}
                  onChange={() => setPurpose("investimento")}
                />
                <span>Investimento</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Observações
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Salvar lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

type ConfirmDeleteModalProps = {
  lead: Lead;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  lead,
  onCancel,
  onConfirm
}) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-base font-semibold text-gray-900">
          Confirmar exclusão
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Tem certeza de que deseja excluir o lead{" "}
          <span className="font-semibold">{lead.name}</span>? Essa ação não
          poderá ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRMBoard;
