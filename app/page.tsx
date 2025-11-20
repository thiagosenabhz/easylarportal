import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="max-w-xl px-4 py-8 rounded-2xl bg-white shadow-sm border border-slate-100">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900">
              EasyLar – carregando
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Estamos preparando os empreendimentos para você.
            </p>
          </div>
        </main>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
