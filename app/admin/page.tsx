export const metadata = {
  title: 'Painel do Administrador',
};

export default function Admin() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Painel do Administrador</h1>

      <div className="mb-6 flex gap-3">
        <a href="#novo" className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Novo Empreendimento
        </a>
        <a href="#crm" className="rounded-xl bg-gray-100 px-4 py-2 hover:bg-gray-200">
          CRM
        </a>
        <a href="#relatorios" className="rounded-xl bg-gray-100 px-4 py-2 hover:bg-gray-200">
          Relatórios
        </a>
      </div>

      {/* Novo Empreendimento */}
      <section id="novo" className="mb-10 rounded-2xl bg-white p-5 shadow">
        <h2 className="mb-3 text-lg font-semibold">Cadastro rápido</h2>
        <p className="mb-4 text-sm text-gray-600">
          Formulário de criação ficará aqui (integração futura com Supabase).
        </p>

        <form className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 rounded-xl border px-3" placeholder="Nome do empreendimento" />
          <input className="h-11 rounded-xl border px-3" placeholder="Bairro" />
          <select className="h-11 rounded-xl border px-3">
            <option value="">Cidade</option>
            <option value="bh">Belo Horizonte</option>
            <option value="contagem">Contagem</option>
          </select>
          <input className="h-11 rounded-xl border px-3" placeholder="Data de abertura de vendas" />
          <input className="h-11 rounded-xl border px-3" placeholder="Previsão de entrega" />
          <input className="h-11 rounded-xl border px-3" placeholder="Preço a partir de" />
          <textarea className="col-span-full h-28 rounded-xl border p-3" placeholder="Itens das áreas de lazer" />
          <button type="button" className="mt-2 h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 sm:w-auto">
            Salvar rascunho
          </button>
        </form>
      </section>

      {/* CRM */}
      <section id="crm" className="rounded-2xl bg-white p-5 shadow">
        <h2 className="mb-3 text-lg font-semibold">CRM</h2>
        <p className="mb-4 text-sm text-gray-600">Kanban vertical (próximo passo).</p>

        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <input className="h-11 rounded-xl border px-3" placeholder="Nome" />
          <input className="h-11 rounded-xl border px-3" placeholder="Telefone" />
          <input className="h-11 rounded-xl border px-3" placeholder="Email" />
          <input className="sm:col-span-2 h-11 rounded-xl border px-3" placeholder="Interesses (studio/1/2/3q, cobertura, privativa…)" />
          <input className="h-11 rounded-xl border px-3" placeholder="Observações" />
          <button className="h-11 rounded-xl bg-emerald-500 px-4 font-medium text-white hover:bg-emerald-600 sm:w-max">
            Adicionar lead
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-7">
          {['Novo contato', 'Tentativa', 'Contato realizado', 'Visita agendada', 'Visita realizada', 'Venda', 'Desistência'].map((c) => (
            <div key={c} className="min-h-[240px] rounded-xl border bg-gray-50 p-3">
              <div className="mb-2 text-sm font-medium">{c}</div>
              <div className="text-xs text-gray-500">Arraste leads para atualizar o status.</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
