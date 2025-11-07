'use client';
import { useState } from 'react';

type Lead = { id: string; name: string; phone: string; email: string; notes?: string };
const initial: Record<string, Lead[]> = {
  'Novo contato': [],
  'Tentativa de contato': [],
  'Contato realizado': [],
  'Visita agendada': [],
  'Visita realizada': [],
  'Venda': [],
  'Desistência': []
};

export default function CRMBoard(){
  const [cols,setCols]=useState<Record<string,Lead[]>>(initial);
  function addLead(){ 
    const id = Math.random().toString(36).slice(2,8);
    const l:Lead = {id,name:'Novo Lead',phone:'',email:''};
    setCols({...cols, ['Novo contato']:[l, ...cols['Novo contato']]});
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">CRM</h2>
        <button className="btn btn-primary" onClick={addLead}>Novo contato</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(cols).map(([stage,items])=>(
          <div key={stage} className="bg-white rounded-xl border p-2">
            <div className="font-medium mb-2">{stage}</div>
            <div className="space-y-2">
              {items.map(l=>(
                <div key={l.id} className="p-2 rounded-lg border bg-slate-50">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-neutral-500">{l.email || 'sem e-mail'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500">Próximo passo: ativar drag-and-drop e persistir no Supabase.</p>
    </div>
  );
}
