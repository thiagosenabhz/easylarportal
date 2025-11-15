"use client";

import { useState } from "react";
import LeadModal, {
  type LeadFormData,
} from "@/app/components/LeadModal";

type FloatingWhatsAppProps = {
  /**
   * Callback opcional para abrir o LeadModal de fora.
   * Se não for passado, o próprio componente controla o modal internamente.
   */
  onOpenLeadModal?: () => void;
};

const WHATSAPP_PHONE = "5531996090508"; // ajuste se quiser outro número

function buildWhatsAppUrl(data: LeadFormData): string {
  const finalidade =
    data.purpose === "investimento" ? "Investimento" : "Moradia";

  const linhas: string[] = [];

  if (data.name) linhas.push(`Nome: ${data.name}`);
  if (data.phone) linhas.push(`Telefone: ${data.phone}`);
  if (data.email) linhas.push(`E-mail: ${data.email}`);
  linhas.push(`Finalidade: ${finalidade}`);
  if (data.notes) linhas.push(`Observações: ${data.notes}`);

  const msg = `Olá, estou entrando em contato pelo portal EasyLar.%0A%0A${linhas.join(
    "%0A"
  )}`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
}

export default function FloatingWhatsApp({
  onOpenLeadModal,
}: FloatingWhatsAppProps) {
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const handleClick = () => {
    if (onOpenLeadModal) {
      // Usa o modal global (layout ou página pai)
      onOpenLeadModal();
    } else {
      // Usa o modal interno deste componente (ex.: página de empreendimento)
      setIsInternalModalOpen(true);
    }
  };

  const handleSubmit = (data: LeadFormData) => {
    const url = buildWhatsAppUrl(data);
    window.open(url, "_blank");
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-xl bg-[#25D366] shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#25D366]"
        aria-label="Falar com consultor pelo WhatsApp"
      >
        {/* Ícone simples do WhatsApp (pode substituir por SVG oficial se quiser) */}
        <span className="text-2xl text-white">✆</span>
      </button>

      {/* Modal interno só é usado quando NÃO existe onOpenLeadModal externo */}
      {!onOpenLeadModal && (
        <LeadModal
          isOpen={isInternalModalOpen}
          onClose={() => setIsInternalModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
