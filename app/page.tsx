// app/page.tsx

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-xl px-4 py-8 rounded-2xl bg-white shadow-sm border border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          EasyLar – portal em atualização
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          A página inicial está em manutenção para receber o novo layout.
          O restante das funcionalidades (admin, CRM, WhatsApp etc.) continua
          disponível normalmente.
        </p>
      </div>
    </main>
  );
}
