// app/components/SearchSidebar.tsx
'use client'

import * as React from 'react'
import { projects, type Project, type VagaTipo } from '@/app/_data/projects'

type Option = { id: string; label: string }

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

function notEmpty<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined && v !== ''
}

export default function SearchSidebar() {
  // estados selecionados
  const [cidade, setCidade] = React.useState<string | null>(null)
  const [bairro, setBairro] = React.useState<string | null>(null)
  const [quartos, setQuartos] = React.useState<number | null>(null)
  const [vagas, setVagas] = React.useState<VagaTipo | null>(null)
  const [privativa, setPrivativa] = React.useState<boolean | null>(null)
  const [cobertura, setCobertura] = React.useState<'duplex' | 'linear' | null>(null)

  // lista base, já filtrada pela cidade (quando houver)
  const base: Project[] = React.useMemo(() => {
    if (!cidade) return projects
    return projects.filter(p => p.cidade === cidade)
  }, [cidade])

  // Opções de cidade (fixas a partir dos dados)
  const cidades: Option[] = React.useMemo(() => {
    return uniq(projects.map(p => p.cidade))
      .filter(notEmpty)
      .map(c => ({ id: c, label: c }))
  }, [])

  // Opções de bairro (dependem da cidade)
  const bairros: Option[] = React.useMemo(() => {
    const origem = base.map(p =>
      (p.bairro ?? (p as any)?.endereco?.bairro ?? '').toString().trim().toLowerCase()
    ).filter(Boolean)

    return uniq(origem).map(b => ({ id: b, label: capitalize(b) }))
  }, [base])

  // Opções de quartos (dependem da cidade/bairro)
  const quartosOpts: Option[] = React.useMemo(() => {
    const origem = base
      .filter(p => (bairro ? (p.bairro ?? '').toLowerCase() === bairro : true))
      .flatMap(p => p.features.quartos)
    return uniq(origem).sort((a, b) => a - b).map(q => ({ id: String(q), label: `${q} quarto${q > 1 ? 's' : ''}` }))
  }, [base, bairro])

  // Opções de vagas (dependem da cidade/bairro/quartos)
  const vagasOpts: Option[] = React.useMemo(() => {
    const origem = base
      .filter(p => (bairro ? (p.bairro ?? '').toLowerCase() === bairro : true))
      .filter(p => (quartos ? p.features.quartos.includes(quartos) : true))
      .flatMap(p => p.features.vagas)

    // regra de “auto-selecionar vaga avulsa” caso 2 vagas não existam:
    // (essa parte fica na lógica de busca final, aqui só populamos opções válidas)
    return uniq(origem).map(v => ({ id: v, label: capitalize(v) }))
  }, [base, bairro, quartos])

  // Opções de “área privativa” (sim/não)
  const privativaOpts: Option[] = React.useMemo(() => {
    const origem = base
      .filter(p => (bairro ? (p.bairro ?? '').toLowerCase() === bairro : true))
      .map(p => p.features.areaPrivativa ? 'Sim' : 'Não')
    return uniq(origem).map(v => ({ id: v, label: v }))
  }, [base, bairro])

  // Opções de cobertura
  const coberturaOpts: Option[] = React.useMemo(() => {
    const origem = base
      .filter(p => (bairro ? (p.bairro ?? '').toLowerCase() === bairro : true))
      .map(p => p.features.cobertura)
      .filter(notEmpty)
    return uniq(origem).map(v => ({ id: v, label: `Cobertura ${v}` }))
  }, [base, bairro])

  // Busca final (apenas prepara dados; plugaremos na listagem)
  const resultados = React.useMemo(() => {
    let lista = [...projects]

    if (cidade) lista = lista.filter(p => p.cidade === cidade)
    if (bairro) lista = lista.filter(p => (p.bairro ?? '').toLowerCase() === bairro)

    if (quartos) lista = lista.filter(p => p.features.quartos.includes(quartos))

    if (vagas) {
      // Se usuário escolheu '2 vagas' e nenhum projeto tem, mas existe 'vaga avulsa',
      // poderíamos marcar automaticamente. Por enquanto, só filtramos pelas vagas.
      lista = lista.filter(p => p.features.vagas.includes(vagas))
    }

    if (privativa !== null) {
      lista = lista.filter(p => Boolean(p.features.areaPrivativa) === Boolean(privativa))
    }

    if (cobertura) {
      lista = lista.filter(p => p.features.cobertura === cobertura)
    }

    return lista
  }, [cidade, bairro, quartos, vagas, privativa, cobertura])

  // UI muito simples (você pode estilizar como preferir)
  return (
    <aside className="w-full max-w-xs space-y-4">
      <Select
        label="Cidade"
        value={cidade}
        onChange={setCidade}
        options={cidades}
        placeholder="Selecione a cidade"
      />

      <Select
        label="Bairro"
        value={bairro}
        onChange={(v) => setBairro(v?.toLowerCase() ?? null)}
        options={bairros}
        placeholder="Selecione o bairro"
        disabled={!cidade}
      />

      <Select
        label="Quartos"
        value={quartos ? String(quartos) : null}
        onChange={(v) => setQuartos(v ? Number(v) : null)}
        options={quartosOpts}
        placeholder="Selecione quartos"
        disabled={!cidade}
      />

      <Select
        label="Vagas"
        value={vagas}
        onChange={(v) => setVagas((v as VagaTipo) ?? null)}
        options={vagasOpts}
        placeholder="Selecione vagas"
        disabled={!cidade}
      />

      <Select
        label="Área privativa"
        value={privativa === null ? null : privativa ? 'Sim' : 'Não'}
        onChange={(v) => setPrivativa(v === null ? null : v === 'Sim')}
        options={privativaOpts}
        placeholder="Possui área privativa?"
        disabled={!cidade}
      />

      <Select
        label="Cobertura"
        value={cobertura}
        onChange={(v) => setCobertura((v as 'duplex' | 'linear') ?? null)}
        options={coberturaOpts}
        placeholder="Tipo de cobertura"
        disabled={!cidade}
      />

      {/* Aqui você pode colocar um botão "Aplicar filtros" e/ou exibir contagem */}
      <div className="text-sm text-slate-600">
        {resultados.length} resultado(s) com os filtros atuais.
      </div>
    </aside>
  )
}

/** Componente de Select genérico */
function Select(props: {
  label: string
  value: string | null
  onChange: (v: string | null) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
}) {
  const { label, value, onChange, options, placeholder, disabled } = props
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white disabled:bg-slate-100"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
      >
        <option value="">{placeholder ?? 'Selecione'}</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}
