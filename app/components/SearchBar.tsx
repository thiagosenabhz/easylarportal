'use client';
import { useState } from 'react';
import { useLang } from '@/app/components/lang/LanguageProvider';
const bedroomsOpts = ['Studio','1 quarto','2 quartos','3 quartos'];
export default function SearchBar(){
  const {t}=useLang();
  const [q,setQ]=useState('');
  const [open,setOpen]=useState(false);
  function handleSearch(){ console.log('buscar',{q}); }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder={t('searchPlaceholder')} className="flex-1 rounded-xl border bg-white text-neutral-800 px-4 py-2 outline-none focus:ring-2 focus:ring-brandGreen"/>
        <button onClick={handleSearch} className="btn btn-primary">{t('search')}</button>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button onClick={()=>setOpen(!open)} className="px-3 py-1 rounded-full border bg-white">Filtros rápidos</button>
        {open && (
          <div className="flex flex-wrap gap-2">
            {bedroomsOpts.map(o=>(<button key={o} className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border">{o}</button>))}
            <span className="px-3 py-1 rounded-full bg-blue-50 text-brandBlue border">Varanda</span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-brandBlue border">Área privativa</span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-brandBlue border">Sem vaga demarcada</span>
          </div>
        )}
      </div>
    </div>
  );
}
