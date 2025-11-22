// app/admin/page.tsx
// Versão estável, sem chamadas ao Supabase nem componentes dinâmicos.
// Apenas estrutura visual do painel, para evitar qualquer erro de build.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do administrador – EasyLar",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Painel do administrador – área interna
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Esta é uma primeira versão estável do painel. Ainda não grava dados
          em banco; vamos conectar o formulário de empreendimento e o CRM em
          etapas separadas, sempre garantindo que o site público continue estável.
        </p>
      </header>

      {/* Seção de atalhos principais */}
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
          Ações rápidas
        </h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Estes botões ainda são apenas visuais (sem navegação). Vamos ligar
          cada fluxo em passos futuros.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm sm:text-sm"
          >
            Novo empreendimento
          </button>

          <button
            type="button"
            className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 sm:text-sm"
          >
            CRM (em breve)
          </button>

          <button
            type="button"
            className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 sm:text-sm"
          >
            Relatórios (em breve)
          </button>
        </div>
      </section>

      {/* Layout do formulário básico, estático, sem lógica de envio */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
          Rascunho de novo empreendimento (layout estático)
        </h2>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
          Este formulário serve apenas como base visual. O botão de salvar
          ainda não envia os dados para lugar nenhum. Quando o fluxo estiver
          validado, vamos conectar ao Supabase e ao CRM.
        </p>

        <form className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Nome do empreendimento
            </label>
            <input
              type="text"
              placeholder="Ex: Viva Residence"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Cidade
            </label>
            <input
              type="text"
              placeholder="Ex: Belo Horizonte - MG"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Bairro
            </label>
            <input
              type="text"
              placeholder="Ex: Luxemburgo"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Preço a partir de (R$)
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Data de abertura de vendas (mês/ano)
            </label>
            <input
              type="text"
              placeholder="Ex: março de 2025"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Previsão de entrega (mês/ano)
            </label>
            <input
              type="text"
              placeholder="Ex: dezembro de 2028"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 sm:text-sm">
              Observações internas (não aparece no site)
            </label>
            <textarea
              rows={3}
              placeholder="Anotações rápidas sobre o empreendimento, condições de lançamento, descontos, etc."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 sm:text-sm">
            Próximo passo: ligar este layout ao banco de dados (Supabase) e ao
            CRM, sempre testando primeiro em ambiente seguro.
          </p>
          <button
            type="button"
            className="cursor-not-allowed rounded-xl bg-slate-300 px-5 py-2 text-xs font-medium text-slate-600 sm:text-sm"
          >
            Salvar rascunho (em breve)
          </button>
        </div>
      </section>
    </main>
  );
}
