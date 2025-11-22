import NextDynamic from "next/dynamic";

// Força o Next a tratar /admin como rota 100% dinâmica (sem pré-renderização estática)
export const dynamic = "force-dynamic";

// Carrega o componente de cliente apenas no browser
const AdminPageClient = NextDynamic(() => import("./AdminPageClient"), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminPageClient />;
}
