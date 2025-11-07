'use client';
import { useState } from 'react';

function TabButton({ active, children, onClick }:{active:boolean, children:React.ReactNode, onClick:()=>void}){
  return <button onClick={onClick} className={`px-3 py-2 rounded-xl border ${active?'bg-brandBlue text-white':'bg-white'}`}>{children}</button>
}

export default function AdminPage(){
  const [tab, setTab] = useState<'novo'|'crm'|'relatorios'>('novo');
  return (
    <div className="container-xl py-8">
      <h1 className="text-2xl font-semibold mb-4">Painel do Administrador</h1>
      <div className="flex gap-2 mb-6">
        <TabButton active={tab==='novo'} onClick={()=>setTab('novo')}>Novo Empreendimento</TabButton>
        <TabButton active={tab==='crm'} onClick={()=>setTab('crm')}>CRM</TabButton>
        <TabButton active={tab==='relatorios'} onClick={()=>setTab('relatorios')}>Relatórios</TabButton>
      </div>

      {tab==='novo' && (
        <div className="card p-4">
          <h2 className="font-semibold mb-3">Cadastro rápido</h2>
          <p className="text-sm text-neutral-600">Formulário de criação ficará aqui (integração futura com Supabase).</p>
        </div>
      )}
      {tab==='crm' && (
        <div className="card p-4">
          <h2 className="font-semibold mb-3">CRM Interativo</h2>
          <p className="text-sm text-neutral-600">Kanban de leads (em breve).</p>
        </div>
      )}
      {tab==='relatorios' && (
        <div className="card p-4">
          <h2 className="font-semibold mb-3">Relatórios</h2>
          <p className="text-sm text-neutral-600">Gráficos e métricas (em breve).</p>
        </div>
      )}
    </div>
  )
}
