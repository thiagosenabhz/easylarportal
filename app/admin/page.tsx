"use client";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Painel do administrador – modo seguro de teste
        </h1>
        <p className="mt-4 text-sm text-slate-700">
          Esta página está temporariamente simplificada só para garantir que o deploy funcione
          sem erros de build. Depois que o /admin estiver estável, voltamos a conectar o formulário
          de novo empreendimento e o CRM passo a passo.
        </p>
      </div>
    </main>
  );
}
