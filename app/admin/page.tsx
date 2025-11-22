// app/admin/page.tsx
// Versão estável e totalmente estática do painel de administrador.
// Sem hooks, sem imports externos – apenas layout visual para evitar
// qualquer problema de "Maximum call stack size exceeded" no build.

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Painel do administrador – área interna
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Esta é uma primeira versão estável do painel. Nada aqui grava dados
            em banco ainda – serve apenas como rascunho visual para futura
            conexão com o formulário de empreendimentos, CRM e relatórios.
          </p>
        </header>

        <section className="mb-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Ações rápidas
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Estes botões ainda são apenas visuais (sem navegação). Em uma
            próxima etapa vamos ligar cada fluxo em páginas internas separadas.
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
              type="button"
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 sm:text-sm"
            >
              Relatórios / Backup (em breve)
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Rascunho de novo empreendimento (layout estático)
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Este formulário é apenas um esqueleto visual. O botão de salvar
            ainda não envia os dados para lugar nenhum – em outra etapa vamos
            conectar isso ao Supabase e ao CRM.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Nome do empreendimento
              </label>
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: Viva Residence"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Cidade
              </label>
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: Belo Horizonte - MG"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Bairro
              </label>
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: Luxemburgo"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Preço a partir de (R$)
              </label>
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: 350000"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Data de abertura de vendas (mês/ano)
              </label>
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: 032025"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Previsão de entrega (mês/ano)
              </label>
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: 032028"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Observações internas (não aparece no site)
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Anotações internas sobre o produto, público-alvo, política comercial etc."
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Próximo passo: ligar este layout ao banco de dados (Supabase) e ao
              CRM, sempre testando primeiro em ambiente seguro para não quebrar
              o site público.
            </p>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-full bg-slate-300 px-4 py-2 text-xs font-medium text-slate-700 sm:text-sm"
            >
              Salvar rascunho (em breve)
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
