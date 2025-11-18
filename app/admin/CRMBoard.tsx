"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

type LeadStageId =
  | "new"
  | "attempt"
  | "contacted"
  | "scheduled"
  | "done"
  | "lost";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  stage: LeadStageId;
}

const STAGES: { id: LeadStageId; title: string }[] = [
  { id: "new",        title: "Novo contato" },
  { id: "attempt",    title: "Tentativa de contato" },
  { id: "contacted",  title: "Contato realizado" },
  { id: "scheduled",  title: "Visita agendada" },
  { id: "done",       title: "Visita realizada" },
  { id: "lost",       title: "Desistência" },
];

type ModalMode = "create" | "edit";

interface LeadFormState {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

function createEmptyForm(): LeadFormState {
  return {
    name: "",
    email: "",
    phone: "",
    notes: "",
  };
}

export default function CRMBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadFormState>(createEmptyForm);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeLead = useMemo(
    () => leads.find((lead) => lead.id === activeLeadId) ?? null,
    [leads, activeLeadId]
  );

  // Fecha modal com ESC
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setActiveLeadId(null);
    setForm(createEmptyForm());
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setModalMode("edit");
    setActiveLeadId(lead.id);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof LeadFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Preencha pelo menos nome e telefone para salvar o contato.");
      return;
    }

    if (modalMode === "create") {
      const newLead: Lead = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim(),
        stage: "new",
      };
      setLeads((prev) => [...prev, newLead]);
    } else if (modalMode === "edit" && activeLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === activeLead.id
            ? {
                ...lead,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                notes: form.notes.trim(),
              }
            : lead
        )
      );
    }

    setIsModalOpen(false);
  };

  const handleDeleteLead = () => {
    if (!activeLead) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este contato? Essa ação não pode ser desfeita."
    );
    if (!confirmed) return;

    setLeads((prev) => prev.filter((lead) => lead.id !== activeLead.id));
    setIsModalOpen(false);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setLeads((prev) => {
      const current = Array.from(prev);
      const leadIndex = current.findIndex((l) => l.id === draggableId);
      if (leadIndex === -1) return prev;

      const lead = current[leadIndex];
      current.splice(leadIndex, 1);

      const newStageId = destination.droppableId as LeadStageId;

      // Recalcula índice considerando apenas leads da coluna de destino
      const before = current.filter((l) => l.stage === newStageId);
      const insertIndex = current.findIndex((l) => {
        if (l.stage !== newStageId) return false;
        const positionAmongStage = before.indexOf(l);
        return positionAmongStage == destination.index;
      });

      const updatedLead: Lead = { ...lead, stage: newStageId };

      if (insertIndex == -1) {
        current.push(updatedLead);
      } else {
        current.splice(insertIndex, 0, updatedLead);
      }

      return current;
    });
  };

  // Exporta todos os contatos (Nome + Telefone)
  const handleExportCsv = () => {
    if (!leads.length) {
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
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "contatos_easylar.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Importa contatos a partir de CSV (Nome;Telefone ou Nome,Telefone)
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (!lines.length) return;

        const dataLines = lines.slice(1); // ignora cabeçalho
        const imported: Lead[] = [];

        for (const line of dataLines) {
          const separator = line.includes(";") ? ";" : ",";
          const [rawName = "", rawPhone = ""] = line.split(separator);

          const name = rawName.trim();
          const phone = rawPhone.trim();

          if (!name || !phone) continue;

          imported.push({
            id: crypto.randomUUID(),
            name,
            phone,
            email: "",
            notes: "",
            stage: "new",
          });
        }

        if (!imported.length) {
          alert("Nenhum contato válido encontrado no arquivo.");
          return;
        }

        setLeads((prev) => [...prev, ...imported]);
      } catch (error) {
        console.error(error);
        alert("Não foi possível importar o arquivo. Verifique o formato do CSV.");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file, "utf-8");
  };

  const leadsByStage = useMemo(() => {
    const map: Record<LeadStageId, Lead[]> = {
      new: [],
      attempt: [],
      contacted: [],
      scheduled: [],
      done: [],
      lost: [],
    };

    for (const lead of leads) {
      map[lead.stage].push(lead);
    }

    return map;
  }, [leads]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">CRM</h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Baixar contatos (Excel)
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Importar contatos (Excel)
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            Novo contato
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {STAGES.map((stage) => {
            const stageLeads = leadsByStage[stage.id];

            return (
              <div
                key={stage.id}
                className="flex min-h-[260px] flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {stage.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {stageLeads.length}
                  </span>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-1 flex-col gap-3 rounded-xl border border-dashed border-slate-200 p-2 transition ${
                        snapshot.isDraggingOver ? "bg-emerald-50" : "bg-slate-50/40"
                      }`}
                    >
                      {stageLeads.length === 0 && (
                        <p className="text-xs text-slate-400">
                          Nenhum contato neste estágio.
                        </p>
                      )}

                      {stageLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(draggableProvided, draggableSnapshot) => (
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(lead)}
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              className={`flex flex-col items-start rounded-xl border bg-white px-3 py-2 text-left text-xs shadow-sm transition ${
                                draggableSnapshot.isDragging
                                  ? "border-emerald-300 shadow-md"
                                  : "border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              <span className="mb-1 line-clamp-1 font-semibold text-slate-900">
                                {lead.name || "Sem nome"}
                              </span>
                              {lead.phone && (
                                <span className="text-[11px] text-slate-700">
                                  Tel: {lead.phone}
                                </span>
                              )}
                              {lead.email && (
                                <span className="text-[11px] text-slate-500">
                                  {lead.email}
                                </span>
                              )}
                              {lead.notes && (
                                <span className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                                  {lead.notes}
                                </span>
                              )}
                            </button>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <p className="mt-2 text-xs text-slate-400">
        Próximo passo: ativar drag-and-drop persistente em banco de dados (Supabase).
      </p>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              {modalMode === "create" ? "Novo contato" : "Editar contato"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Nome*
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Telefone*
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Observações
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar (Esc)
                </button>

                <button
                  type="button"
                  onClick={handleSaveLead}
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                >
                  Salvar
                </button>
              </div>

              {modalMode === "edit" && (
                <button
                  type="button"
                  onClick={handleDeleteLead}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Excluir contato
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
