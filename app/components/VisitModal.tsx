'use client';
import { useState } from 'react';
import { useLang } from '@/app/components/lang/LanguageProvider';
export default function VisitModal({open=false,onClose}:{open?:boolean,onClose:()=>void}){
  const {t}=useLang();
  const [date,setDate]=useState(''); const [time,setTime]=useState('');
  if(!open) return null;
  const mk = (h:string)=>h.replace(/[-:]/g,''); 
  const start = (date && time)? `${mk(date)}T${mk(time)}00Z` : '';
  const end   = (date && time)? (()=>{ const [hh,mm]=time.split(':').map(x=>parseInt(x||'0',10)); const nh=String(hh+1).padStart(2,'0'); return `${mk(date)}T${nh}${mm}00Z`; })() : '';
  const href  = (date && time)? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Visita EasyLar')}&details=${encodeURIComponent('Visita ao empreendimento via portal EasyLar')}&dates=${start}/${end}` : undefined;
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md">
        <h3 className="text-lg font-semibold">{t('scheduleVisit')}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded-lg px-3 py-2"/>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="border rounded-lg px-3 py-2"/>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn border">Cancelar</button>
          <a href={href || '#'} target="_blank" className={`btn btn-primary ${!href && 'pointer-events-none opacity-50'}`}>Adicionar ao Google Agenda</a>
        </div>
        <p className="text-xs text-neutral-500 mt-2">Também podemos integrar com Calendly/Google Appointment Schedule para slots automáticos.</p>
      </div>
    </div>
  );
}
