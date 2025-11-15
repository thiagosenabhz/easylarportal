"use client";

import { useState } from "react";
import LeadModal, { type LeadFormData } from "@/app/components/LeadModal";

export type FloatingWhatsAppProps = {
  /**
   * Quando for passado (caso do layout/admin), o clique no botão
   * apenas dispara essa função para abrir o LeadModal global.
   * Quando NÃO for passado (caso da página de empreendimento),
   * o próprio componente abre o LeadModal local.
   */
  onOpenLeadModal?: () => void;
};

const WHATSAPP_NUMBER = "5531996090508"; // número em formato internacional

export default function FloatingWhatsApp({
  onOpenLeadModal,
}: FloatingWhatsAppProps) {
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);

  const handleClick = () => {
    if (onOpenLeadModal) {
      // Usa o modal global (layout / Admin)
      onOpenLeadModal();
      return;
    }

    // Usa o modal local (páginas normais)
    setIsLocalModalOpen(true);
  };

  const handleSubmit = (data: LeadFormData) => {
    // Monta mensagem padrão para o WhatsApp
    const purposeLabel =
      data.purpose === "investimento" ? "Investimento" : "Moradia";

    const message = [
      `Olá, meu nome é ${data.name}.`,
      `Tenho interesse em imóveis EasyLar.`,
      "",
      `Finalidade: ${purposeLabel}`,
      data.email ? `E-mail: ${data.email}` : "",
      data.phone ? `Telefone: ${data.phone}` : "",
      data.notes ? "",  # quebra de linha antes das observações
      data.notes ? `Observações: ${data.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }

    setIsLocalModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/40 transition hover:scale-105 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Falar com um consultor pelo WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-7 w-7 text-white"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.59 2 2.21 6.37 2.21 11.82c0 2.08.61 4.02 1.78 5.72L2 22l4.6-1.48a9.97 9.97 0 0 0 5.44 1.59h.01c5.45 0 9.83-4.37 9.83-9.82C21.88 6.37 17.49 2 12.04 2Zm5.8 14.18c-.24.67-1.22 1.27-1.68 1.3-.43.04-.97.06-1.57-.1-.36-.1-.83-.27-1.44-.52-2.54-1.1-4.19-3.66-4.32-3.83-.13-.18-1.03-1.37-1.03-2.61 0-1.24.65-1.84.88-2.1.23-.26.5-.32.67-.32.17 0 .34 0 .49.01.16.01.37-.06.58.44.22.53.74 1.84.8 1.97.06.13.1.29.02.47-.08.18-.12.29-.24.45-.13.15-.27.34-.39.46-.13.13-.26.27-.11.53.15.26.67 1.11 1.44 1.8 1 0.9 1.83 1.18 2.1 1.31.27.13.43.11.59-.07.16-.18.68-.79.86-1.06.18-.26.36-.22.61-.13.25.09 1.6.75 1.87.89.28.13.46.2.53.31.07.12.07.68-.17 1.35Z" />
        </svg>
      </button>

      {/* Modal local só é usado quando NÃO recebemos onOpenLeadModal */}
      {!onOpenLeadModal && (
        <LeadModal
          isOpen={isLocalModalOpen}
          onClose={() => setIsLocalModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
