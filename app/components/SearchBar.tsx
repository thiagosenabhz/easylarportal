'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch }:{ onSearch?: (q:string)=>void }) {
  const [q, setQ] = useState('');
  return (
    <div className="flex gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por bairro, empreendimento..." className="flex-1 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-brandGreen" />
      <button onClick={()=>onSearch?.(q)} className="btn btn-primary">Buscar</button>
    </div>
  );
}
