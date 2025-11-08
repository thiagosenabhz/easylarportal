import SearchSidebar from '@/app/components/SearchSidebar';
import FloatingWhatsApp from '@/app/components/FloatingWhatsApp';
import projects from '@/app/_data/projects';

export const metadata = {
  title: 'EasyLar',
  description: 'Encontre o imóvel dos seus sonhos',
};

export default function Home() {
  return (
    <main className="min-h-[100dvh]">
      {/* hero simples */}
      <section className="bg-blue-700 py-10 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold">
            Encontre o imóvel dos seus sonhos
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-6">
          <SearchSidebar />

          <div className="grow">
            <h2 className="mb-3 text-xl font-semibold">Pré-abertura</h2>
            {/* cards mockados com base no _data/projects */}
            {projects.slice(0, 1).map((p) => (
              <article
                key={p.slug}
                className="mb-6 overflow-hidden rounded-2xl border bg-white"
              >
                <div className="h-56 w-full bg-gray-200" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.nome}</h3>
                  <p className="text-sm text-gray-600">
                    {p.bairro} • {p.cidade === 'bh' ? 'Belo Horizonte' : 'Contagem'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {['2/3 quartos', 'Sem vaga demarcada', 'Varanda', 'Área privativa', 'Cobertura duplex'].map((t) => (
                      <span key={t} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">R$</span>{' '}
                      <span className="text-lg font-semibold">420.000</span>{' '}
                      <span className="text-gray-500">a partir</span>
                    </div>
                    <a
                      href={`/imovel/${p.slug}`}
                      className="h-10 rounded-xl bg-emerald-500 px-4 text-white hover:bg-emerald-600"
                    >
                      Ver detalhes
                    </a>
                  </div>
                </div>
              </article>
            ))}

            <h2 className="mt-8 mb-3 text-xl font-semibold">Oportunidades</h2>
            {projects.slice(1, 2).map((p) => (
              <article
                key={p.slug}
                className="mb-6 overflow-hidden rounded-2xl border bg-white"
              >
                <div className="h-56 w-full bg-gray-200" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.nome}</h3>
                  <p className="text-sm text-gray-600">
                    {p.bairro} • {p.cidade === 'bh' ? 'Belo Horizonte' : 'Contagem'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['2 quartos', '1 vaga(s)', 'Varanda'].map((t) => (
                      <span key={t} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">R$</span>{' '}
                      <span className="text-lg font-semibold">299.000</span>{' '}
                      <span className="text-gray-500">a partir</span>
                    </div>
                    <a
                      href={`/imovel/${p.slug}`}
                      className="h-10 rounded-xl bg-emerald-500 px-4 text-white hover:bg-emerald-600"
                    >
                      Ver detalhes
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <FloatingWhatsApp />
    </main>
  );
}
