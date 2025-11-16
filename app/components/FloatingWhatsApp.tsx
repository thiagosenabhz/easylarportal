"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

export type FloatingWhatsAppProps = {
  /**
   * Função chamada quando o botão é clicado.
   * Normalmente abre o LeadModal global.
   */
  onOpenLeadModal?: () => void;
};

export default function FloatingWhatsApp({
  onOpenLeadModal,
}: FloatingWhatsAppProps) {
  const pathname = usePathname();

  // Oculta o botão em qualquer rota de administração
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onOpenLeadModal) {
      onOpenLeadModal();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Falar com consultor pelo WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg shadow-black/30 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#25D366]"
    >
      {/* Ícone vetorizado do WhatsApp (SVG inline) */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="fill-white"
      >
        <path d="M16 3C9.383 3 4 8.383 4 15c0 2.416.713 4.659 1.953 6.542L4 29l7.7-1.953A11.877 11.877 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10a9.86 9.86 0 0 1-4.911-1.322l-.351-.203-4.579 1.162 1.216-4.463-.228-.364A9.83 9.83 0 0 1 6 15c0-5.514 4.486-10 10-10zm-3.277 5.004a.636.636 0 0 0-.457.215c-.24.26-.874.854-.874 1.98 0 1.126.895 2.214 1.02 2.369.125.155 1.757 2.806 4.285 3.818 2.106.837 2.535.671 2.992.63.457-.042 1.476-.604 1.685-1.188.208-.583.208-1.082.146-1.188-.062-.105-.229-.167-.478-.292-.25-.125-1.476-.729-1.704-.812-.229-.083-.395-.125-.562.125-.167.25-.645.812-.791.979-.146.167-.291.188-.54.063-.25-.125-1.056-.389-2.012-1.239-.744-.663-1.246-1.482-1.393-1.732-.146-.25-.016-.385.11-.51.113-.113.25-.292.374-.437.125-.146.167-.25.25-.416.083-.167.042-.313-.021-.437-.062-.125-.54-1.343-.743-1.843-.196-.469-.4-.406-.54-.415z" />
      </svg>
    </button>
  );
}
