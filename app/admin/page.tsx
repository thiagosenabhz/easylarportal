"use client";

import "./globals.css";
import type { ReactNode } from "react";
import { useState, FormEvent } from "react";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";
import LeadModal, {
  type LeadFormData,
} from "@/app/components/LeadModal";
import { parseCurrencyBRL } from "@/app/utils/currency";

type Tab = "project" | "crm" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("project");
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <h1 className="mb-6 text-xl font-semibold text-gray-900">
          Painel do Administrador
        </h1>

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

        {activeTab === "project" && <NewProjectForm />}
        {activeTab === "crm" && <CRMBoard />}
        {activeTab === "reports" && (
          <p className="text-sm text-gray-600">
            Área de relatórios em desenvolvimento.
          </p>
        )}
      </main>

      <FloatingWhatsApp onOpenLeadModal={() => setIsLeadModalOpen(true)} />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}
