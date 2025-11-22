import dynamicImport from "next/dynamic";

// Força esta rota a rodar só no lado do servidor em runtime (sem prerender estático)
export const dynamic = "force-dynamic";

const AdminPageClient = dynamicImport(() => import("./AdminPageClient"), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminPageClient />;
}
