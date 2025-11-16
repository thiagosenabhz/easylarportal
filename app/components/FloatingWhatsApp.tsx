"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { LeadFormData } from "@/app/components/LeadModal";

// Props do botão flutuante de WhatsApp.
// onOpenLeadModal é usado nas páginas públicas para abrir o LeadModal global.
export type FloatingWhatsAppProps = {
  onOpenLeadModal?: () => void;
};

// Função compartilhada para montar a mensagem e abrir o WhatsApp.
// Ela é passada como onSubmit para o LeadModal.
export function handleLeadSubmit(data: LeadFormData) {
  // Evita erro de tipo do TypeScript convertendo para string simples.
  const rawPurpose = String(data.purpose);
  const purposeLabel =
    rawPurpose === "investment" || rawPurpose === "Investimento"
      ? "Investimento"
      : "Moradia";

  const lines = [
    "Olá, vim pelo site EasyLar.",
    data.name ? `Nome: ${data.name}` : "",
    data.email ? `E-mail: ${data.email}` : "",
    data.phone ? `Telefone: ${data.phone}` : "",
    `Finalidade: ${purposeLabel}`,
    data.notes ? "" : "",
    data.notes ? `Observações: ${data.notes}` : "",
  ].filter(Boolean);

  const message = lines.join("\n");
  const encoded = encodeURIComponent(message);

  const phone = "5531996090508"; // número de destino no formato DDI + DDD + número
  const url = `https://wa.me/${phone}?text=${encoded}`;

  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}

// Componente do botão flutuante (quadrado, bordas arredondadas, ícone vetorizado).
export default function FloatingWhatsApp({ onOpenLeadModal }: FloatingWhatsAppProps) {
  const pathname = usePathname();

  // Esconde automaticamente o botão em qualquer rota de administração.
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleClick = () => {
    if (onOpenLeadModal) {
      onOpenLeadModal();
      return;
    }

    // Fallback: se não vier LeadModal, abre uma mensagem simples mesmo assim.
    const phone = "5531996090508";
    const text = encodeURIComponent("Olá, vim pelo site EasyLar.");
    const url = `https://wa.me/${phone}?text=${text}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return (
    <button
      type="button"
      aria-label="Falar por WhatsApp"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg shadow-black/25 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <Image
        src="/whatsapp-icon.svg"
        alt="WhatsApp"
        width={32}
        height={32}
        priority
      />
    </button>
  );
}
