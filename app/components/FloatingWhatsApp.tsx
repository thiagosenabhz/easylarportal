'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Carrega o modal apenas no cliente (evita SSR e o erro de useSearchParams)
const LeadModal = dynamic(() => import('@/app/components/LeadModal'), {
  ssr: false,
  loading: () => null,
});

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="WhatsApp"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center"
      >
        {/* Coloque /public/whatsapp.svg para usar a marca oficial */}
        <img
          src="/whatsapp.svg"
          alt=""
          className="h-7 w-7"
          onError={(e: any) => {
            // fallback discreto se o svg ainda não existir
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-white text-2xl leading-none" aria-hidden>
          🟢
        </span>
      </button>

      {open && <LeadModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
