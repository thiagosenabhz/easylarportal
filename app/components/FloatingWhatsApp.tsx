"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const PHONE_NUMBER = "5531996090508"; // ajuste se necessário

const FloatingWhatsApp: React.FC = () => {
  const pathname = usePathname();

  // Esconde o botão em qualquer rota de admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const message = encodeURIComponent(
    "Olá! Estou no Portal EasyLar e gostaria de falar com um consultor."
  );

  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-105 hover:shadow-xl"
      aria-label="Falar pelo WhatsApp"
    >
      <Image
        src="/whatsapp.png"
        alt="WhatsApp"
        width={32}
        height={32}
        priority
      />
    </a>
  );
};

export default FloatingWhatsApp;
