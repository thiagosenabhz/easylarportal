'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Carrega o modal apenas no client (evita SSR e erros de hooks de rota)
const LeadModal = dynamic(() => import('@/app/components/LeadModal'), {
  ssr: false,
  loading: () => null,
});

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [hideIcon, setHideIcon] = useState(false);

  return (
    <>
      <button
        aria-label="WhatsApp"
        onClick={() => setOpen(true)}
        className="
          fixed right-6 bottom-6 z-50
          flex items-center justify-center
          h-14 w-14 rounded-full
          bg-emerald-500 hover:bg-emerald-600
          shadow-lg shadow-emerald-900/20
          transition-transform hover:scale-[1.03] active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-emerald-600
        "
      >
        {!hideIcon && (
          <img
            src="/whatsapp.png"
            alt="WhatsApp"
            className="h-8 w-8 select-none"
            draggable={false}
            onError={() => setHideIcon(true)}  // se der erro, apenas some
          />
        )}
      </button>

      {open && <LeadModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
