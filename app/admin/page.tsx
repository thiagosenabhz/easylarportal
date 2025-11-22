import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const AdminPageClient = dynamic(() => import("./AdminPageClient"), {
  ssr: false,
});

export default function AdminPage() {
  return <AdminPageClient />;
}
