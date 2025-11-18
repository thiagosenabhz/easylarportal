"use client";

import { useEffect, useMemo, useState } from "react";

type StageId =
  | "novo-contato"
  | "tentativa-contato"
  | "contato-realizado"
  | "visita-agendada"
  | "visita-realizada"
  | "venda"
  | "desistencia";

interface Stage {
  id: StageId;
  title: string;
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  stageId: StageId;
  createdAt: string;
}

interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const STAGES: Stage[] = [
  { id: "novo-contato", title: "Novo contato" },
  { id: "tentativa-contato", title: "Tentativa de contato" },
  { id: "contato-realizado", title: "Contato realizado" },
  { id: "visita-agendada", title: "Visita agendada" },
  { id: "visita-realizada", title: "Visita realizada" },
  { id: "venda", title: "Venda" },
  { id: "desistencia", title: "Desistência" },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: "1",
    name: "THIAGO PORCARO SENA",
    email: "asdf@asdas",
    phone: "34234",
    notes: "",
    stageId: "novo-contato",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Novo Lead",
    email: "",
    phone: "",
    notes: "",
    stageId: "novo-contato",
    createdAt: new Date().toISOString(),
  },
];

interface LeadModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues?: LeadFormValues;
  onCancel: () => void;
  onConfirm: (values: LeadFormValues) => void;
  onDelete?: () => void;
}

function LeadModal({
  isOpen,
  mode,
  initialValues,
  onCancel,
  onConfirm,
  onDelete,
}: LeadModalProps) {
  const [values, setValues] = useState<LeadFormValues>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Sincroniza valores quando abre/edita
  useEffect(() => {
    if (!isOpen) return;
    setValues({
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      notes: initialValues?.notes ?? "",
    });
  }, [isOpen, initialValues]);

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const title = mode === "create" ? "Novo contato" : "Detalhes do contato";

  const handleChange =
    (field: keyof LeadFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      alert("Preencha o nome do contato.");
      return;
    }
    onConfirm(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="absolute inset-0"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Nome*
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={values.name}
              onChange={handleChange("name")}
              placeholder="Nome completo do contato"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={values.email}
                onChange={handleChange("email")}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Telefone (DDD)
              </label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={values.phone}
                onChange={handleChange("phone")}
                placeholder="(31) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              className="min-h-[120px] w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={values.notes}
              onChange={handleChange("notes")}
              placeholder="Resumo da necessidade, perfil, objeções, próximos passos..."
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Excluir lead
              </button>
            )}

            <div className="flex flex-1 justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {mode === "create" ? "Salvar lead" : "Salvar alterações"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CRMBoard() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);

  const editingLead = useMemo(
    () => leads.find((lead) => lead.id === editingLeadId),
    [leads, editingLeadId]
  );

  const handleCreateLead = (values: LeadFormValues) => {
    const newLead: Lead = {
      id: String(Date.now()),
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      notes: values.notes.trim(),
      stageId: "novo-contato",
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateLead = (values: LeadFormValues) => {
    if (!editingLeadId) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === editingLeadId
          ? {
              ...lead,
              name: values.name.trim(),
              email: values.email.trim(),
              phone: values.phone.trim(),
              notes: values.notes.trim(),
            }
          : lead
      )
    );
    setEditingLeadId(null);
  };

  const handleDeleteLead = () => {
    if (!editingLeadId) return;
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este lead? Essa ação não pode ser desfeita."
    );
    if (!confirmDelete) return;

    setLeads((prev) => prev.filter((lead) => lead.id !== editingLeadId));
    setEditingLeadId(null);
  };

  const handleDropOnStage = (stageId: StageId) => {
    if (!draggingId) return;
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === draggingId ? { ...lead, stageId } : lead
      )
    );
    setDraggingId(null);
  };

  const groupedLeads = useMemo(() => {
    const map: Record<StageId, Lead[]> = {
      "novo-contato": [],
      "tentativa-contato": [],
      "contato-realizado": [],
      "visita-agendada": [],
      "visita-realizada": [],
      venda: [],
      desistencia: [],
    };

    for (const lead of leads) {
      map[lead.stageId].push(lead);
    }

    return map;
  }, [leads]);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">CRM</h1>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          Novo contato
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = groupedLeads[stage.id];

          return (
            <div
              key={stage.id}
              className="flex h-[420px] w-64 flex-shrink-0 flex-col rounded-2xl bg-white p-3 shadow-sm"
              onDragOver={(event) => {
                if (draggingId) {
                  event.preventDefault();
                }
              }}
              onDrop={() => handleDropOnStage(stage.id)}
            >
              <h2 className="mb-2 text-sm font-semibold text-gray-800">
                {stage.title}
              </h2>

              <div className="flex-1 space-y-2 overflow-y-auto rounded-xl bg-gray-50 p-2 text-xs text-gray-500">
                {stageLeads.length === 0 && (
                  <p className="px-1 text-[11px] text-gray-400">
                    Nenhum contato neste estágio.
                  </p>
                )}

                {stageLeads.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    draggable
                    onDragStart={() => setDraggingId(lead.id)}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => setEditingLeadId(lead.id)}
                    className="w-full cursor-grab rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-xs shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <p className="truncate text-[13px] font-semibold text-gray-900">
                      {lead.name || "Sem nome"}
                    </p>
                    {lead.email && (
                      <p className="truncate text-[11px] text-gray-500">
                        E-mail: {lead.email}
                      </p>
                    )}
                    {lead.phone && (
                      <p className="truncate text-[11px] text-gray-500">
                        Telefone: {lead.phone}
                      </p>
                    )}
                    {lead.notes && (
                      <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">
                        {lead.notes}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">
        Próximo passo: integrar com Supabase para salvar leads e movimentações
        de forma permanente.
      </p>

      {/* Modal de criação */}
      <LeadModal
        isOpen={isCreateModalOpen}
        mode="create"
        onCancel={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateLead}
      />

      {/* Modal de edição */}
      <LeadModal
        isOpen={Boolean(editingLead)}
        mode="edit"
        initialValues={
          editingLead && {
            name: editingLead.name ?? "",
            email: editingLead.email ?? "",
            phone: editingLead.phone ?? "",
            notes: editingLead.notes ?? "",
          }
        }
        onCancel={() => setEditingLeadId(null)}
        onConfirm={handleUpdateLead}
        onDelete={handleDeleteLead}
      />
    </section>
  );
}
