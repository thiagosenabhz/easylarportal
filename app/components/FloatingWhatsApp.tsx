'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Carrega modais apenas no cliente (evita SSR e erros de useSearchParams)
const LeadModal = dynamic(() => import('@/app/components/LeadModal'), {
  ssr: false,
  loading: () => null,
});

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  // Fechar no ESC (segurança extra além do próprio modal)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        aria-label="WhatsApp"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 h-16 w-16 rounded-xl shadow-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        {/* ícone oficial em branco sobre fundo verde */}
        <img
          src="/whatsapp.png"
          alt="WhatsApp"
          className="h-8 w-8 pointer-events-none select-none"
          draggable={false}
        />
      </button>

      {open && <LeadModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
