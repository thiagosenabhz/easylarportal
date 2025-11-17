
"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LeadModal, { type LeadFormData } from "./LeadModal";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Oculta completamente o botão na área administrativa
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleLeadSubmit = (data: LeadFormData) => {
    // Evita erro de TypeScript independente dos valores exatos do enum/tipo
    const purposeLabel =
      String(data.purpose) === "investment" ? "Investimento" : "Moradia";

    const lines = [
      "Olá, vim pelo site EasyLar.",
      `Nome: ${data.name}`,
      data.email ? `E-mail: ${data.email}` : "",
      data.phone ? `Telefone: ${data.phone}` : "",
      `Finalidade: ${purposeLabel}`,
      data.notes ? `Observações: ${data.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/5531996090508?text=${encodeURIComponent(
      lines
    )}`;

    window.open(whatsappUrl, "_blank");
    setIsLeadModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsLeadModalOpen(true)}
        aria-label="Falar com consultor no WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[#25D366]"
      >
        <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={40}
          height={40}
          priority={false}
        />
      </button>

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}
