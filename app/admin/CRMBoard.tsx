"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  DragEvent,
} from "react";

type StageId =
  | "new"
  | "attempt"
  | "contacted"
  | "scheduled"
  | "visited"
  | "sold"
  | "lost";

type Stage = {
  id: StageId;
  title: string;
};

const STAGES: Stage[] = [
  { id: "new", title: "Novo contato" },
  { id: "attempt", title: "Tentativa de contato" },
  { id: "contacted", title: "Contato realizado" },
  { id: "scheduled", title: "Visita agendada" },
  { id: "visited", title: "Visita realizada" },
  { id: "sold", title: "Venda" },
  { id: "lost", title: "Desistência" },
];

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  stageId: StageId;
  notes?: string;
};

type LeadModalState =
  | { mode: "closed" }
  | { mode: "create"; stageId: StageId }
  | { mode: "edit"; lead: Lead };

type OpenLeadModalState = Extract<
  LeadModalState,
  { mode: "create" | "edit" }
>;

type LeadModalProps = {
  state: OpenLeadModalState;
  onSave: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
};

// Gera um lead vazio para o estágio escolhido
function createEmptyLead(stageId: StageId): Lead {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now());

  return {
    id,
    name: "",
    phone: "",
    email: "",
    stageId,
    notes: "",
  };
}

// ====================== MODAL DE LEAD ===========================

const LeadModal: React.FC<LeadModalProps> = ({
  state,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [values, setValues] = useState<Lead>(() => {
    if (state.mode === "edit") {
      return state.lead;
    }
    return createEmptyLead(state.stageId);
  });

  // Sempre que o "state" mudar (abrir outro lead ou estágio), reseta o formulário
  useEffect(() => {
    if (state.mode === "edit") {
      setValues(state.lead);
    } else {
      setValues(createEmptyLead(state.stageId));
    }
  }, [state]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleStageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as StageId;
    setValues((prev) => ({ ...prev, stageId: value }));
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim() || !values.phone.trim()) {
      return;
    }
    onSave(values);
  };

  const handleDelete = () => {
    if (!onDelete || state.mode !== "edit") return;
    const ok = window.confirm("Deseja realmente excluir este contato?");
    if (ok) {
      onDelete(state.lead.id);
    }
  };

  const title = state.mode === "edit" ? "Editar contato" : "Novo contato";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nome*
              </label>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Nome do contato"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Telefone*
              </label>
              <input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="(31) 9 9999-9999"
                required
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                value={values.email ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="contato@exemplo.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Etapa
              </label>
              <select
                value={values.stageId}
                onChange={handleStageChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Observações
            </label>
            <textarea
              name="notes"
              value={values.notes ?? ""}
              onChange={handleChange}
              className="min-h-[80px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Histórico, objeções, pontos importantes..."
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            {state.mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Excluir contato
              </button>
            )}

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====================== BOARD / KANBAN ===========================

export default function CRMBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [modalState, setModalState] = useState<LeadModalState>({
    mode: "closed",
  });

  // Drag & drop
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageId | null>(null);

  const leadsByStage = useMemo(() => {
    const map: Record<StageId, Lead[]> = {
      new: [],
      attempt: [],
      contacted: [],
      scheduled: [],
      visited: [],
      sold: [],
      lost: [],
    };
    for (const lead of leads) {
      map[lead.stageId].push(lead);
    }
    return map;
  }, [leads]);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleDragOverColumn = (
    event: DragEvent<HTMLDivElement>,
    stageId: StageId
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);
  };

  const handleDropOnColumn = (
    event: DragEvent<HTMLDivElement>,
    stageId: StageId
  ) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              stageId,
            }
          : lead
      )
    );

    setDraggingId(null);
    setDragOverStage(null);
  };

  // Modal handlers
  const openCreateModal = (stageId: StageId) => {
    setModalState({ mode: "create", stageId });
  };

  const openEditModal = (lead: Lead) => {
    setModalState({ mode: "edit", lead });
  };

  const closeModal = () => setModalState({ mode: "closed" });

  const handleSaveLead = (lead: Lead) => {
    setLeads((prev) => {
      const exists = prev.some((item) => item.id === lead.id);
      if (exists) {
        return prev.map((item) => (item.id === lead.id ? lead : item));
      }
      return [...prev, lead];
    });
    closeModal();
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    closeModal();
  };

  // =================== EXPORT / IMPORT CSV =======================

  const handleDownloadCsv = () => {
    if (leads.length === 0) {
      alert("Não há contatos para exportar.");
      return;
    }

    const header = "Nome;Telefone";
    const rows = leads.map((lead) => {
      const safeName = (lead.name || "").replace(/;/g, ",");
      const safePhone = (lead.phone || "").replace(/;/g, ",");
      return `${safeName};${safePhone}`;
    });
    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contatos_easylar.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);

      if (lines.length <= 1) return;

      const [, ...dataLines] = lines;
      const imported: Lead[] = dataLines
        .map((line) => line.replace(/\\"/g, ""))
        .map((line) => line.split(/[;,]/))
        .map((parts) => {
          const name = (parts[0] || "").trim();
          const phone = (parts[1] || "").trim();
          if (!name || !phone) return null;

          return {
            ...createEmptyLead("new"),
            name,
            phone,
          } as Lead;
        })
        .filter((lead): lead is Lead => lead !== null);

      if (imported.length === 0) return;

      setLeads((prev) => [...prev, ...imported]);
    };

    reader.readAsText(file, "utf-8");
    // limpa o input para permitir importar o mesmo arquivo novamente
    event.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Baixar contatos (Excel)
          </button>

          <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Importar contatos (Excel)
            <input
              type="file"
              accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={handleImportCsv}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal("new")}
          className="rounded-full bg-emerald-500 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          Novo contato
        </button>
      </div>

      {/* Kanban ocupando a largura toda: grid responsivo, sem scroll horizontal interno */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {STAGES.map((stage) => {
          const stageLeads = leadsByStage[stage.id];
          const isDragOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`flex min-h-[260px] flex-col rounded-2xl border bg-white/70 p-3 text-sm shadow-sm transition ${
                isDragOver
                  ? "border-emerald-400 ring-1 ring-emerald-300"
                  : "border-slate-200"
              }`}
              onDragOver={(event) => handleDragOverColumn(event, stage.id)}
              onDrop={(event) => handleDropOnColumn(event, stage.id)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-800">
                  {stage.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {stageLeads.length}
                </span>
              </div>

              <div className="flex-1 space-y-2">
                {stageLeads.length === 0 && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Nenhum contato neste estágio.
                  </p>
                )}

                {stageLeads.map((lead) => {
                  const isDragging = draggingId === lead.id;
                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openEditModal(lead)}
                      className={`cursor-pointer rounded-xl border px-3 py-2 text-[11px] shadow-sm transition ${
                        isDragging
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
                      }`}
                    >
                      <div className="font-semibold text-slate-800">
                        {lead.name || "Novo Lead"}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Tel: {lead.phone || "sem telefone"}
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-slate-400">
                          {lead.email}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {modalState.mode !== "closed" && (
        <LeadModal
          state={modalState as OpenLeadModalState}
          onSave={handleSaveLead}
          onDelete={handleDeleteLead}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
