'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const LeadModal = dynamic(() => import('@/app/components/LeadModal'), { ssr: false, loading: () => null });

export default function FloatingWhatsApp() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        aria-label="WhatsApp"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 h-16 w-16 rounded-2xl shadow-lg bg-[#25D366] hover:brightness-95 flex items-center justify-center"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="h-9 w-9" />
      </button>
      {open && <LeadModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
