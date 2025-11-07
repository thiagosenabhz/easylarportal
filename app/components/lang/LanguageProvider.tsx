'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
type Lang = 'pt'|'en';
type Dict = Record<string,string>;
type DictMap = Record<Lang, Dict>;
const DICT: DictMap = {
  pt: { findHome:'Encontre o imóvel dos seus sonhos', searchPlaceholder:'Buscar por bairro, empreendimento...', search:'Buscar', preOpening:'Pré-abertura', opportunities:'Oportunidades', details:'Ver detalhes', adminAccess:'Acesso do administrador', scheduleVisit:'Agendar visita', unit:'Unidade', back:'Voltar', talkToConsultant:'Falar com consultor' },
  en: { findHome:'Find your dream home', searchPlaceholder:'Search by neighborhood, development...', search:'Search', preOpening:'Pre-opening', opportunities:'Opportunities', details:'See details', adminAccess:'Admin access', scheduleVisit:'Schedule a visit', unit:'Unit', back:'Back', talkToConsultant:'Talk to agent' }
};
const LangContext = createContext<{lang:Lang,setLang:(l:Lang)=>void,t:(k:string)=>string}|null>(null);
export function useLang(){ const c = useContext(LangContext); if(!c) throw new Error('useLang must be used inside LanguageProvider'); return c; }
export default function LanguageProvider({ children }:{children: React.ReactNode}){
  const [lang,setLang]=useState<Lang>('pt');
  useEffect(()=>{ const s=localStorage.getItem('lang') as Lang|null; if(s) setLang(s); },[]);
  useEffect(()=>{ localStorage.setItem('lang',lang); document.documentElement.lang = lang==='pt'?'pt-BR':'en'; },[lang]);
  const t = (k:string)=> DICT[lang][k] ?? k;
  const value = useMemo(()=>({lang,setLang,t}),[lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
