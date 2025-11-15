import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <p className="text-sm text-gray-600">
            Carregando empreendimentos...
          </p>
        </main>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
