"use client";

import { useState } from "react";
import CRMBoard from "@/app/components/admin/CRMBoard";
import NewProjectForm from "./NewProjectForm";

type Tab = "project" | "crm" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("crm");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab("project")}
          className={
            activeTab === "project"
              ? "bg-blue-600 text-white px-4 py-2 rounded-full"
              : "bg-gray-200 px-4 py-2 rounded-full"
          }
        >
          Novo Empreendimento
        </button>

        <button
          onClick={() => setActiveTab("crm")}
          className={
            activeTab === "crm"
              ? "bg-blue-600 text-white px-4 py-2 rounded-full"
              : "bg-gray-200 px-4 py-2 rounded-full"
          }
        >
          CRM
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={
            activeTab === "reports"
              ? "bg-blue-600 text-white px-4 py-2 rounded-full"
              : "bg-gray-200 px-4 py-2 rounded-full"
          }
        >
          Relatórios
        </button>
      </div>

      {activeTab === "project" && (
        <section className="bg-white p-6 rounded-xl shadow">
          <NewProjectForm />
        </section>
      )}

      {activeTab === "crm" && (
        <section className="bg-white p-6 rounded-xl shadow">
          <CRMBoard />
        </section>
      )}

      {activeTab === "reports" && (
        <section className="bg-white p-6 rounded-xl shadow">
          <p>Relatórios serão ativados futuramente.</p>
        </section>
      )}
    </main>
  );
}
