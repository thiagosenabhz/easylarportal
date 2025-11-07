'use client';
import { useState } from 'react';
import LeadModal from '@/app/components/LeadModal';

export default function FloatingWhatsApp(){
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="WhatsApp"
        onClick={()=>setOpen(true)}
        className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center"
      >
        {/* Se você adicionar /public/whatsapp.svg usaremos o oficial */}
        <img src="/whatsapp.svg" alt="" className="h-7 w-7" onError={(e:any)=>{ e.currentTarget.style.display='none'; }}/>
        <span className="text-white text-2xl leading-none" aria-hidden>🟢</span>
      </button>
      <LeadModal open={open} onClose={()=>setOpen(false)} />
    </>
  );
}
