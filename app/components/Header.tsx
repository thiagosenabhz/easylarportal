'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const AdminLogin = dynamic(() => import('@/app/components/admin/AdminLogin'), { ssr: false });

export default function Header() {
  const [lang, setLang] = useState<'pt'|'en'>('pt');
  const [openAdmin, setOpenAdmin] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') as 'pt'|'en' | null : null;
    if (stored) setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <header className="bg-brandBlue text-white">
      <div className="container-xl py-3 flex items-center gap-4">
        <div className="font-bold text-xl">EasyLar</div>
        <nav className="hidden md:flex gap-4 opacity-90">
          <a href="/">Encontre</a>
          <a href="/#pre-abertura">Pré-abertura</a>
          <a href="/#oportunidades">Oportunidades</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>setOpenAdmin(true)} className="btn bg-white/10 hover:bg-white/20">Acesso do administrador</button>
          <button onClick={()=>setLang(lang==='pt'?'en':'pt')} className="btn bg-white text-brandBlue">{lang.toUpperCase()}</button>
        </div>
      </div>
      <AdminLogin open={openAdmin} onClose={()=>setOpenAdmin(false)} />
    </header>
  );
}
