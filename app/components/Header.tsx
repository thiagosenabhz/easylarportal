'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { useLang } from '@/app/components/lang/LanguageProvider';
const AdminLogin = dynamic(()=>import('@/app/components/admin/AdminLogin'),{ssr:false});
export default function Header(){
  const {lang,setLang,t}=useLang();
  const [openAdmin,setOpenAdmin]=React.useState(false);
  return (
    <header className="bg-brandBlue text-white sticky top-0 z-40">
      <div className="container-xl py-3 flex items-center gap-4">
        <a href="/" className="font-bold text-xl">EasyLar</a>
        <nav className="hidden md:flex gap-4 opacity-90">
          <a href="/">{t('search')}</a>
          <a href="/#pre-abertura">{t('preOpening')}</a>
          <a href="/#oportunidades">{t('opportunities')}</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>setOpenAdmin(true)} className="btn bg-white/10 hover:bg-white/20">{t('adminAccess')}</button>
          <button onClick={()=>setLang(lang==='pt'?'en':'pt')} className="btn bg-white text-brandBlue">{lang.toUpperCase()}</button>
        </div>
      </div>
      <AdminLogin open={openAdmin} onClose={()=>setOpenAdmin(false)} />
    </header>
  );
}
