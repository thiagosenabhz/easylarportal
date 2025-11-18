"use client";

import React, { useCallback, useMemo, useState } from "react";

type StageId =
  | "novo_contato"
  | "tentativa_contato"
  | "contato_realizado"
  | "visita_agendada"
  | "visita_realizada"
  | "venda"
  | "desistencia";

type Lead = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  notes?: string;
  stageId: StageId;
};

const STAGES: { id: StageId; title: string }[] = [
  { id: "novo_contato", title: "Novo contato" },
  { id: "tentativa_contato", title: "Tentativa de contato" },
  { id: "contato_realizado", title: "Contato realizado" },
  { id: "visita_agendada", title: "Visita agendada" },
  { id: "visita_realizada", title: "Visita realizada" },
  { id: "venda", title: "Venda" },
  { id: "desistencia", title: "Desistência" },
];

const createEmptyLead = (stageId: StageId): Lead => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: "",
  phone: "",
  stageId,
});

type LeadModalState =
  | { mode: "closed" }
  | { mode: "create"; lead: Lead }
  | { mode: "edit"; lead: Lead };

const initialModal: LeadModalState = { mode: "closed" };

const CRMBoard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [modalState, setModalState] = useState<LeadModalState>(initialModal);

  const openCreateModal = useCallback((stageId: StageId) => {
    setModalState({ mode: "create", lead: createEmptyLead(stageId) });
  }, []);

  const openEditModal = useCallback(
    (leadId: string) => {
      const found = leads.find((l) => l.id === leadId);
      if (!found) return;
      setModalState({ mode: "edit", lead: { ...found } });
    },
    [leads]
  );

  const closeModal = useCallback(() => {
    setModalState(initialModal);
  }, []);

  const handleModalKeyDown: React.KeyboardEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          closeModal();
        }
      },
      [closeModal]
    );

  const saveLead = useCallback(
    (updated: Lead) => {
      if (!updated.name.trim() || !updated.phone.trim()) {
        alert("Preencha pelo menos nome e telefone.");
        return;
      }

      setLeads((prev) => {
        const exists = prev.some((l) => l.id === updated.id);
        if (exists) {
          return prev.map((l) => (l.id === updated.id ? updated : l));
        }
        return [...prev, updated];
      });
      closeModal();
    },
    [closeModal]
  );

  const deleteLead = useCallback(
    (id: string) => {
      const confirmDelete = window.confirm(
        "Tem certeza que deseja excluir este contato?"
      );
      if (!confirmDelete) return;
      setLeads((prev) => prev.filter((l) => l.id !== id));
      closeModal();
    },
    [closeModal]
  );

  // --- Drag & Drop nativo (sem biblioteca externa) ---

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageId | null>(null);

  const handleDragStart = useCallback((leadId: string) => {
    setDraggingId(leadId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverStage(null);
  }, []);

  const handleDragEnterColumn = useCallback(
    (stageId: StageId) => {
      if (!draggingId) return;
      setDragOverStage(stageId);
    },
    [draggingId]
  );

  const handleDropOnColumn = useCallback(
    (stageId: StageId) => {
      if (!draggingId) return;
      setLeads((prev) =>
        prev.map((l) =>
          l.id === draggingId
            ? {
                ...l,
                stageId,
              }
            : l
        )
      );
      setDraggingId(null);
      setDragOverStage(null);
    },
    [draggingId]
  );

  // --- Import / Export CSV (Excel) ---

  const handleExport = useCallback(() => {
    if (!leads.length) {
      alert("Nenhum contato para exportar.");
      return;
    }
    const header = "Nome;Telefone";
    const rows = leads.map((l) => `${l.name};${l.phone}`);
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contatos_easylar.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [leads]);

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = String(event.target?.result || "");
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
        if (lines.length <= 1) {
          alert("Arquivo vazio ou sem dados.");
          return;
        }
        const [, ...rows] = lines;
        const imported: Lead[] = rows
          .map((row) => row.split(/[;,]/))
          .map((cols) => ({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: (cols[0] || "").trim(),
            phone: (cols[1] || "").trim(),
            stageId: "novo_contato" as StageId,
          }))
          .filter((l) => l.name && l.phone);

        if (!imported.length) {
          alert("Nenhum contato válido encontrado no arquivo.");
          return;
        }

        setLeads((prev) => [...prev, ...imported]);
      };
      reader.readAsText(file, "utf-8");
      e.target.value = "";
    },
    []
  );

  const leadsByStage = useMemo(() => {
    const map: Record<StageId, Lead[]> = {
      novo_contato: [],
      tentativa_contato: [],
      contato_realizado: [],
      visita_agendada: [],
      visita_realizada: [],
      venda: [],
      desistencia: [],
    };
    for (const lead of leads) {
      map[lead.stageId].push(lead);
    }
    return map;
  }, [leads]);

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">CRM</h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Baixar contatos (Excel)
          </button>

          <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
            Importar contatos (Excel)
            <input
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => openCreateModal("novo_contato")}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            Novo contato
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {STAGES.map((stage) => {
          const isActiveDrop = dragOverStage === stage.id;
          return (
            <div
              key={stage.id}
              className={`flex min-h-[260px] flex-col rounded-2xl border bg-white/70 p-3 shadow-sm transition ${
                isActiveDrop ? "border-emerald-400 bg-emerald-50" : "border-slate-200"
              }`}
              onDragEnter={() => handleDragEnterColumn(stage.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOnColumn(stage.id)}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {stage.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {leadsByStage[stage.id].length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {leadsByStage[stage.id].length === 0 ? (
                  <p className="mt-2 text-xs text-slate-400">
                    Nenhum contato neste estágio.
                  </p>
                ) : (
                  leadsByStage[stage.id].map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openEditModal(lead.id)}
                      className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left text-xs shadow-sm transition ${
                        draggingId === lead.id
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      <span className="font-semibold text-slate-900">
                        {lead.name || "Sem nome"}
                      </span>
                      {lead.phone && (
                        <span className="text-[11px] text-slate-600">
                          Tel: {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="text-[11px] text-slate-500">
                          {lead.email}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalState.mode !== "closed" && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onKeyDown={handleModalKeyDown}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl outline-none"
            tabIndex={-1}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {modalState.mode === "create"
                    ? "Novo contato"
                    : "Editar contato"}
                </h3>
                <p className="text-xs text-slate-500">
                  Preencha as informações do lead. Pressione ESC para fechar.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <LeadForm
              state={modalState}
              onSave={saveLead}
              onDelete={deleteLead}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </section>
  );
};

type LeadFormProps = {
  state: LeadModalState;
  onSave: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
};

const LeadForm: React.FC<LeadFormProps> = ({
  state,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [values, setValues] = useState<Lead>(state.lead);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Nome*
          </label>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Nome do cliente"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Telefone*
          </label>
          <input
            name="phone"
            value={values.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="(31) 99999-9999"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            E-mail
          </label>
          <input
            name="email"
            value={values.email || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="cliente@email.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Etapa
          </label>
          <select
            name="stageId"
            value={values.stageId}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                stageId: e.target.value as StageId,
              }))
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700">
          Observações
        </label>
        <textarea
          name="notes"
          value={values.notes || ""}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          placeholder="Histórico de atendimento, preferências, objeções..."
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancelar
          </button>
        </div>

        {state.mode === "edit" && (
          <button
            type="button"
            onClick={() => onDelete(values.id)}
            className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Excluir contato
          </button>
        )}
      </div>
    </form>
  );
};

export default CRMBoard;
