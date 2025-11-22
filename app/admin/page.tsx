import dynamic from "next/dynamic";

const AdminShellClient = dynamic(() => import("./AdminShellClient"), {
  ssr: false,
  loading: () => (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Painel do administrador – carregando
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Carregando ferramentas de administração do EasyLar...
      </p>
    </main>
  ),
});

export const metadata = {
  title: "Painel do administrador – EasyLar",
};

export default function AdminPage() {
  return <AdminShellClient />;
}
