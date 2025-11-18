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
