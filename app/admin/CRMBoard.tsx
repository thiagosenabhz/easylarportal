"use client";

import React, { useEffect, useRef, useState } from "react";

type StageId =
  | "novo-contato"
  | "tentativa"
  | "contato"
  | "visita-agendada"
  | "visita-realizada"
  | "venda"
  | "desistencia";

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  stageId: StageId;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const STAGES: { id: StageId; title: string }[] = [
  { id: "novo-contato", title: "Novo contato" },
  { id: "tentativa", title: "Tentativa de contato" },
  { id: "contato", title: "Contato realizado" },
  { id: "visita-agendada", title: "Visita agendada" },
  { id: "visita-realizada", title: "Visita realizada" },
  { id: "venda", title: "Venda" },
  { id: "desistencia", title: "Desistência" },
];

const emptyForm: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export default function CRMBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadFormData>(emptyForm);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Abre modal de novo contato
  const handleOpenNewLead = () => {
    setEditingLead(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  // Abre modal para editar / visualizar
  const handleOpenEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      notes: lead.notes ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    setForm(emptyForm);
  };

  // Fecha modal com ESC
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  const handleChangeForm = (field: keyof LeadFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = () => {
    if (!form.name.trim()) {
      alert("Preencha pelo menos o nome do contato.");
      return;
    }

    if (editingLead) {
      // edição
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === editingLead.id
            ? {
                ...lead,
                name: form.name.trim(),
                email: form.email.trim() || undefined,
                phone: form.phone.trim() || undefined,
                notes: form.notes.trim() || undefined,
              }
            : lead
        )
      );
    } else {
      // criação
      const newLead: Lead = {
        id: `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        notes: form.notes.trim() || undefined,
        stageId: "novo-contato",
      };
      setLeads((prev) => [newLead, ...prev]);
    }

    closeModal();
  };

  const handleDeleteLead = () => {
    if (!editingLead) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este contato?"
    );
    if (!confirmed) return;

    setLeads((prev) => prev.filter((lead) => lead.id !== editingLead.id));
    closeModal();
  };

  // Drag and drop
  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOverColumn = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDropOnColumn = (stageId: StageId) => {
    if (!draggedLeadId) return;
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === draggedLeadId ? { ...lead, stageId } : lead
      )
    );
    setDraggedLeadId(null);
  };

  // Exportar contatos (Nome + Telefone) em CSV abrível no Excel
  const handleExportToExcel = () => {
    if (leads.length === 0) {
      alert("Não há contatos para exportar.");
      return;
    }

    const header = ["Nome", "Telefone"];
    const rows = leads.map((lead) => [lead.name || "", lead.phone || ""]);

    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const csvLines = [
      header.map(escapeCell).join(";"),
      ...rows.map((row) => row.map(escapeCell).join(";")),
    ];

    const csvContent = csvLines.join("\n");
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

  // Importar contatos (Nome + Telefone) via CSV
  const handleClickImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedLeads = parseContactsFromCSV(text);

      if (importedLeads.length === 0) {
        alert(
          "Nenhum contato válido foi encontrado. Verifique se o arquivo possui colunas Nome e Telefone."
        );
        return;
      }

      setLeads((prev) => [
        ...importedLeads.map(
          (c) =>
            ({
              id: `import-${Date.now()}-${Math.random()
                .toString(16)
                .slice(2)}`,
              name: c.name,
              phone: c.phone,
              stageId: "novo-contato" as StageId,
            } as Lead)
        ),
        ...prev,
      ]);

      alert(`Importamos ${importedLeads.length} contato(s).`);
    } catch (error) {
      console.error(error);
      alert(
        "Não foi possível importar o arquivo. Certifique-se de que ele está em formato CSV."
      );
    } finally {
      event.target.value = "";
    }
  };

  const leadsByStage = (stageId: StageId) =>
    leads.filter((lead) => lead.stageId === stageId);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">CRM</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportToExcel}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Baixar contatos (Excel)
          </button>

          <button
            type="button"
            onClick={handleClickImport}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Importar contatos (Excel)
          </button>

          <button
            type="button"
            onClick={handleOpenNewLead}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
          >
            Novo contato
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </header>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="flex h-[420px] w-64 flex-col rounded-2xl border border-gray-200 bg-white"
              onDragOver={handleDragOverColumn}
              onDrop={() => handleDropOnColumn(stage.id)}
            >
              <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {stage.title}
                </h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {leadsByStage(stage.id).length}
                </span>
              </header>

              <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
                {leadsByStage(stage.id).length === 0 && (
                  <p className="px-2 text-xs text-gray-400">
                    Nenhum contato neste estágio.
                  </p>
                )}

                {leadsByStage(stage.id).map((lead) => (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    onClick={() => handleOpenEditLead(lead)}
                    className="cursor-grab rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <p className="font-semibold text-gray-900">
                      {lead.name}
                    </p>
                    {lead.phone && (
                      <p className="mt-0.5 text-[11px] text-gray-600">
                        Tel: {lead.phone}
                      </p>
                    )}
                    {lead.email && (
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {lead.email}
                      </p>
                    )}
                    {lead.notes && (
                      <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">
                        {lead.notes}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Próximo passo: ativar drag-and-drop persistente em banco de dados
        (Supabase).
      </p>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-900">
              {editingLead ? "Detalhes do contato" : "Novo contato"}
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Nome*
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleChangeForm("name", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nome completo do contato"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      handleChangeForm("email", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Telefone (DDD)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      handleChangeForm("phone", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="(31) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    handleChangeForm("notes", e.target.value)
                  }
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Histórico de atendimento, perfil, interesse, renda, etc."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {editingLead ? (
                <button
                  type="button"
                  onClick={handleDeleteLead}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Excluir contato
                </button>
              ) : (
                <span />
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveLead}
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingLead ? "Salvar alterações" : "Salvar contato"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Utilitário simples para ler CSV com colunas Nome / Telefone
function parseContactsFromCSV(text: string): { name: string; phone: string }[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return [];

  // Remove cabeçalho
  const dataLines = lines.slice(1);

  const results: { name: string; phone: string }[] = [];

  for (const line of dataLines) {
    if (!line) continue;

    // Tenta separar por ";" e depois por ","
    let parts = splitCsvLine(line, ";");
    if (parts.length < 2) {
      parts = splitCsvLine(line, ",");
    }

    const name = (parts[0] || "").trim();
    const phone = (parts[1] || "").trim();

    if (!name && !phone) continue;

    results.push({ name: stripQuotes(name), phone: stripQuotes(phone) });
  }

  return results;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const parts: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      current += char;
    } else if (char === delimiter && !insideQuotes) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  parts.push(current);
  return parts;
}

function stripQuotes(value: string): string {
  let v = value.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    v = v.slice(1, -1);
  }
  return v.replace(/""/g, '"').trim();
}
