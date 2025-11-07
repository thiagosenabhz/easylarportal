'use client';
import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
const LeadModal = dynamic(() => import('@/app/components/LeadModal'), { ssr: false });

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const shouldRender = useMemo(() => !pathname || pathname === '/' || pathname.startsWith('/imovel/'), [pathname]);
  if (!shouldRender) return null;

  return (
    <>
      <button aria-label="Falar no WhatsApp" onClick={()=>setOpen(true)} className="fixed bottom-4 right-4 z-[90] rounded-full shadow-xl bg-brandGreen text-white p-4 hover:bg-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="26" height="26" fill="currentColor">
          <path d="M19.11 17.16c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.35-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.01-.22-.53-.45-.46-.61-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.11 2.83c.14.18 1.93 2.95 4.68 4.14.65.28 1.16.44 1.56.56.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.27.23-.62.23-1.15.16-1.27-.07-.12-.25-.2-.52-.34zM16.01 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.38 1.63 6.21L3.2 28.8l6.76-1.78a12.75 12.75 0 0 0 6.05 1.54c7.07 0 12.8-5.73 12.8-12.8 0-7.07-5.73-12.8-12.8-12.8zm0 23.04c-2.23 0-4.3-.65-6.03-1.77l-.43-.27-4.01 1.05 1.07-3.91-.28-.4a10.87 10.87 0 1 1 9.68 5.31z"/>
        </svg>
      </button>
      <LeadModal open={open} onClose={()=>setOpen(false)} />
    </>
  );
}
