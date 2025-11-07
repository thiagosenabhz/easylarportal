'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
type Lang = 'pt'|'en';
type Dict = Record<string,string>;
type DictMap = Record<Lang, Dict>;
const DICT: DictMap = {
  pt: {
    brand:'EasyLar', search:'Buscar', preOpening:'Pré-abertura', opportunities:'Oportunidades',
    findHome:'Encontre o imóvel dos seus sonhos', adminAccess:'Acesso do administrador', scheduleVisit:'Agendar visita',
    talkToConsultant:'Falar com consultor', back:'Voltar',
  },
  en: {
    brand:'EasyLar', search:'Search', preOpening:'Pre-opening', opportunities:'Opportunities',
    findHome:'Find your dream home', adminAccess:'Admin access', scheduleVisit:'Schedule a visit',
    talkToConsultant:'Talk to agent', back:'Back',
  }
};
const Ctx = createContext<{lang:Lang,setLang:(l:Lang)=>void,t:(k:string)=>string}|null>(null);
export function useLang(){ const c = useContext(Ctx); if(!c) throw new Error('useLang must be used inside LanguageProvider'); return c; }
export default function LanguageProvider({ children }:{children: React.ReactNode}){
  const [lang,setLang]=useState<Lang>('pt');
  useEffect(()=>{ const s=localStorage.getItem('lang') as Lang|null; if(s) setLang(s); },[]);
  useEffect(()=>{ localStorage.setItem('lang',lang); document.documentElement.lang = lang==='pt'?'pt-BR':'en'; },[lang]);
  const t = (k:string)=> DICT[lang][k] ?? k;
  const value = useMemo(()=>({lang,setLang,t}),[lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
