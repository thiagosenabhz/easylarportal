"use client";

import React from "react";

type FloatingWhatsAppProps = {
  onOpenLeadModal: () => void;
};

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  onOpenLeadModal,
}) => {
  const handleClick = () => {
    onOpenLeadModal();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#25D366]"
    >
      {/* Ícone oficial simples em SVG branco */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-white"
      >
        <path d="M16.003 3.2C9.836 3.2 4.8 8.237 4.8 14.403c0 2.515.862 4.842 2.31 6.692L5.6 26.4l5.488-1.47a11.13 11.13 0 0 0 4.915 1.143c6.166 0 11.203-5.037 11.203-11.203 0-6.166-5.037-11.2-11.203-11.2Zm0 20.53a9.28 9.28 0 0 1-4.716-1.293l-.338-.199-3.257.873.87-3.178-.22-.327a9.28 9.28 0 0 1-1.45-4.885c0-5.135 4.176-9.31 9.31-9.31 5.135 0 9.31 4.175 9.31 9.31 0 5.135-4.175 9.31-9.31 9.31Zm5.09-6.985c-.278-.139-1.645-.812-1.9-.904-.255-.093-.44-.139-.626.139-.185.278-.72.903-.883 1.088-.162.185-.325.209-.603.07-.278-.139-1.174-.433-2.237-1.381-.827-.738-1.385-1.65-1.548-1.928-.162-.278-.017-.429.122-.568.125-.124.278-.323.417-.485.139-.162.185-.278.278-.463.093-.185.046-.347-.023-.486-.07-.139-.626-1.51-.858-2.064-.226-.542-.456-.469-.626-.477l-.535-.009c-.185 0-.486.07-.74.347-.255.278-.97.949-.97 2.315 0 1.366.994 2.683 1.132 2.87.139.185 1.954 2.99 4.733 4.188.662.285 1.18.455 1.584.583.665.211 1.27.181 1.749.11.533-.08 1.645-.673 1.878-1.323.232-.65.232-1.207.162-1.323-.069-.116-.255-.185-.533-.324Z" />
      </svg>
    </button>
  );
};

export default FloatingWhatsApp;
