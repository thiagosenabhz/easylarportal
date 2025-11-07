'use client';
import React from 'react';

const chips = {
  cidades: ['Belo Horizonte', 'Contagem'],
  quartos: ['Studio', '1 quarto', '2 quartos', '3 quartos'],
  vagas: ['1 vaga', '2 vagas', 'Vaga avulsa'],
  extras: ['Varanda', 'Área privativa']
};

export default function SearchBar(){
  const [sel, setSel] = React.useState<Record<string, Set<string>>>({
    cidades: new Set(), quartos: new Set(), vagas: new Set(), extras: new Set()
  });
  function toggle(group:string, value:string){
    const next = new Set(sel[group]); next.has(value) ? next.delete(value) : next.add(value);
    setSel({ ...sel, [group]: next });
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {chips.cidades.map(v => (
          <button key={v} onClick={()=>toggle('cidades', v)} className={`chip ${sel.cidades.has(v)?'chip-on':''}`}>{v}</button>
        ))}
        {chips.quartos.map(v => (
          <button key={v} onClick={()=>toggle('quartos', v)} className={`chip ${sel.quartos.has(v)?'chip-on':''}`}>{v}</button>
        ))}
        {chips.vagas.map(v => (
          <button key={v} onClick={()=>toggle('vagas', v)} className={`chip ${sel.vagas.has(v)?'chip-on':''}`}>{v}</button>
        ))}
        {chips.extras.map(v => (
          <button key={v} onClick={()=>toggle('extras', v)} className={`chip ${sel.extras.has(v)?'chip-on':''}`}>{v}</button>
        ))}
      </div>
    </div>
  );
}
