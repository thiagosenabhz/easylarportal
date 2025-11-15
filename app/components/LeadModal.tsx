"use client";

import React, { FormEvent, useState } from "react";

type LeadPurpose = "moradia" | "investimento";

export type LeadFormData = {
  name: string;
  phone: string;
  email: string;
  purpose: LeadPurpose;
  notes: string;
  consent: boolean;
};

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
};

const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [purpose, setPurpose] = useState<LeadPurpose>("moradia");
  const [consent, setConsent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data: LeadFormData = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      purpose,
      notes: String(formData.get("notes") || ""),
      consent,
    };

    onSubmit(data);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Falar com consultor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Seu nome*
              </label>
              <input
                name="name"
                required
                autoComplete="name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Telefone (DDD)*
              </label>
              <input
                name="phone"
                required
                autoComplete="tel"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="purposeOption"
                checked={purpose === "moradia"}
                onChange={() => setPurpose("moradia")}
              />
              Moradia
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="purposeOption"
                checked={purpose === "investimento"}
                onChange={() => setPurpose("investimento")}
              />
              Investimento
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Observações — Faça um breve relato da sua busca para
              direcionarmos melhor seu atendimento.
            </label>
            <textarea
              name="notes"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            Autorizo o contato por e-mail, WhatsApp e telefone conforme LGPD.
          </label>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1ebe5a]"
            >
              Enviar pelo WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
