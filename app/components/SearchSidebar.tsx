'use client';

import * as React from 'react';
import type { Project, VagaTipo } from '@/app/types';
import { projects } from '@/app/_data/projects';

/**
 * Barra lateral de filtros (versão estável para compilar no Vercel).
 * - Importa os tipos de '@/app/types'
 * - Importa os dados como { projects }
 */
type Option = { id: string; label: string };

function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }
function cap(s: string) { return s.replace(/(^|\s)\p{L}/gu, m => m.toUpperCase()); }

export default function SearchSidebar() {
  const [cidade, setCidade] = React.useState<string | null>(null);
  const [bairro, setBairro] = React.useState<string | null>(null);
  const [tipologia, setTipologia] = React.useState<string | null>(null);
  const [vagas, setVagas] = React.useState<VagaTipo | null>(null);
  const [areaPrivativa, setAreaPrivativa] = React.useState<boolean | null>(null);
  const [vagaAvulsa, setVagaAvulsa] = React.useState<boolean | null>(null);

  const cidades: Option[] = uniq(projects.map(p => [p.city, p.state].filter(Boolean).join(' - ')))
    .map(c => ({ id: c, label: c }));

  const bairros: Option[] = (() => {
    const data = cidade
      ? projects.filter(p => [p.city, p.state].filter(Boolean).join(' - ') === cidade)
      : projects;
    return uniq(data.map(p => (p.neighborhood || '').toLowerCase()).filter(Boolean))
      .map(b => ({ id: b, label: cap(b) }));
  })();

  const tipologias: Option[] = uniq(projects.map(p => p.bedroomsLabel || '').filter(Boolean))
    .map(t => ({ id: t, label: t }));

  const vagasOpts: Option[] = [
    { id: '1 vaga', label: '1 vaga' },
    { id: '2 vagas', label: '2 vagas' },
    { id: 'vaga avulsa', label: 'Vaga avulsa' },
  ];

  return (
    <aside className="w-full md:w-80 space-y-4">
      <Section title="Cidade">
        <PillGroup value={cidade} onChange={setCidade} options={cidades} />
      </Section>

      <Section title="Bairro">
        <PillGroup value={bairro} onChange={setBairro} options={bairros} />
      </Section>

      <Section title="Tipologia">
        <PillGroup value={tipologia} onChange={setTipologia} options={tipologias} />
      </Section>

      <Section title="Vagas">
        <PillGroup value={vagas} onChange={(v) => setVagas(v as VagaTipo)} options={vagasOpts} />
      </Section>

      <Section title="Diferenciais">
        <Toggle label="Área privativa" checked={!!areaPrivativa} onChange={setAreaPrivativa} />
        <Toggle label="Vaga avulsa" checked={!!vagaAvulsa} onChange={setVagaAvulsa} />
      </Section>
    </aside>
  );
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold mb-2">{props.title}</h4>
      <div className="flex flex-wrap gap-2">{props.children}</div>
    </div>
  );
}

function PillGroup({
  value, onChange, options,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  options: Option[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(active ? null : o.id)}
            className={[
              'px-3 py-1.5 rounded-full border text-sm',
              active
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50',
            ].join(' ')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  label, checked, onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 mr-4 text-sm cursor-pointer">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-neutral-300"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
