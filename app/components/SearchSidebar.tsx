'use client';

import { useMemo, useState } from 'react';
import projects from '@/app/_data/projects';

type Opt = { id: string; label: string };

const cidades: Opt[] = [
  { id: 'bh', label: 'Belo Horizonte' },
  { id: 'contagem', label: 'Contagem' },
];

const tipologias: Opt[] = [
  { id: 'studio', label: 'Studio' },
  { id: '1q', label: '1 quarto' },
  { id: '2q', label: '2 quartos' },
  { id: '3q', label: '3 quartos' },
];

const vagas: Opt[] = [
  { id: '1', label: '1 vaga' },
  { id: '2', label: '2 vagas' },
];

const especiais: Opt[] = [
  { id: 'privativa', label: 'Área privativa' },
  { id: 'cobertura', label: 'Cobertura' },
];

export default function SearchSidebar() {
  const [cidade, setCidade] = useState<string | null>(null);
  const [bairro, setBairro] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [vaga, setVaga] = useState<string | null>(null);
  const [avulsa, setAvulsa] = useState<boolean | null>(null);
  const [flag, setFlag] = useState<string | null>(null); // privativa/cobertura

  // Bairros disponíveis de acordo com a cidade
  const bairros: Opt[] = useMemo(() => {
    if (!cidade)
      return Array.from(
        new Set(projects.map((p) => p.bairro.toLowerCase()))
      ).map((b) => ({ id: b, label: capitalize(b) }));
    return Array.from(
      new Set(
        projects.filter((p) => p.cidade === cidade).map((p) => p.bairro.toLowerCase())
      )
    ).map((b) => ({ id: b, label: capitalize(b) }));
  }, [cidade]);

  // Regras de disponibilidade (travas inteligentes)
  const availability = useMemo(() => {
    const filtered = projects.filter((p) => {
      if (cidade && p.cidade !== cidade) return false;
      if (bairro && p.bairro.toLowerCase() !== bairro) return false;
      return true;
    });

    // quais tipologias existem sob esses filtros
    const tiposOK = new Set<string>();
    const vagasOK = new Set<string>();
    let temAvulsa = false;
    const flagsOK = new Set<string>(); // privativa/cobertura

    filtered.forEach((p) => {
      p.unidades.forEach((u) => {
        tiposOK.add(u.tipo); // 'studio'|'1q'|'2q'|'3q'
        vagasOK.add(String(u.vagas ?? 0));
        if (u.vagaAvulsa) temAvulsa = true;
        if (u.areaPrivativa) flagsOK.add('privativa');
        if (u.cobertura) flagsOK.add('cobertura');
      });
    });

    return { tiposOK, vagasOK, temAvulsa, flagsOK };
  }, [cidade, bairro]);

  const disabledTipo = (id: string) => !availability.tiposOK.has(id);
  const disabledVaga = (id: string) => !availability.vagasOK.has(id);
  const disabledFlag = (id: string) => !availability.flagsOK.has(id);

  const onApply = () => {
    // redireciona com query params (simples)
    const qp = new URLSearchParams();
    if (cidade) qp.set('cidade', cidade);
    if (bairro) qp.set('bairro', bairro || '');
    if (tipo) qp.set('tipo', tipo);
    if (vaga) qp.set('vagas', vaga);
    if (avulsa) qp.set('avulsa', '1');
    if (flag) qp.set('flag', flag);
    const url = `/?${qp.toString()}`;
    window.location.assign(url);
  };

  return (
    <aside className="w-full max-w-xs shrink-0 rounded-2xl bg-white/70 p-4 backdrop-blur-md [box-shadow:0_6px_20px_rgba(0,0,0,.08)]">
      <h3 className="mb-3 text-lg font-semibold">Filtrar</h3>

      {/* Cidade */}
      <Section title="Cidade">
        <ChipGroup
          options={cidades}
          value={cidade}
          onChange={setCidade}
          allowUnset
        />
      </Section>

      {/* Bairro */}
      <Section title="Bairro">
        <ChipGroup
          options={bairros}
          value={bairro}
          onChange={setBairro}
          allowUnset
        />
      </Section>

      {/* Tipologia */}
      <Section title="Tipologia">
        <ChipGroup
          options={tipologias}
          value={tipo}
          onChange={(v) => setTipo(v)}
          isDisabled={disabledTipo}
          allowUnset
        />
      </Section>

      {/* Vagas */}
      <Section title="Vagas">
        <ChipGroup
          options={vagas}
          value={vaga}
          onChange={setVaga}
          isDisabled={(id) => disabledVaga(id)}
          allowUnset
        />
        <label className="mt-2 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!avulsa}
            onChange={(e) => setAvulsa(e.target.checked)}
            disabled={!availability.temAvulsa}
          />
          <span>Vaga avulsa</span>
        </label>
      </Section>

      {/* Especiais */}
      <Section title="Diferenciais">
        <ChipGroup
          options={especiais}
          value={flag}
          onChange={setFlag}
          isDisabled={disabledFlag}
          allowUnset
        />
      </Section>

      <button
        onClick={onApply}
        className="mt-3 h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700"
      >
        Aplicar filtros
      </button>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-sm font-medium text-gray-700">{title}</div>
      {children}
    </div>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  isDisabled,
  allowUnset,
}: {
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (val: string | null) => void;
  isDisabled?: (id: string) => boolean;
  allowUnset?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.id;
        const disabled = isDisabled?.(o.id) ?? false;
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(active && allowUnset ? null : o.id)}
            className={[
              'rounded-full px-3 py-1 text-sm',
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : active
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            ].join(' ')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function capitalize(s: string) {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}
