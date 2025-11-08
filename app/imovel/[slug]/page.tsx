import FloatingWhatsApp from '@/app/components/FloatingWhatsApp';

export default function ImovelPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <a href="/" className="mb-4 inline-block rounded-xl bg-gray-100 px-4 py-2 hover:bg-gray-200">
        ← Voltar
      </a>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.3fr_.9fr]">
        <div className="relative rounded-2xl bg-gray-200 p-6">
          {/* botões sobrepostos na foto */}
          <div className="absolute left-4 top-4 flex flex-col gap-3">
            {['Área de lazer', 'Plantas', 'Implantação'].map((b) => (
              <button key={b} className="rounded-xl bg-white/90 px-4 py-2 text-sm hover:bg-white">
                {b}
              </button>
            ))}
          </div>

          <div className="flex h-[420px] items-center justify-center text-4xl text-gray-500">
            Azul e Verde
          </div>
        </div>

        <aside className="rounded-2xl bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">Azul e Verde</h1>
          <p className="text-sm text-gray-600">Centro-Sul • Belo Horizonte-MG</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {['2/3 quartos', 'Sem vaga demarcada', 'Varanda', 'Área privativa', 'Cobertura duplex'].map((t) => (
              <span key={t} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button className="rounded-xl border px-4 py-2">Unidade 2 quartos</button>
            <button className="rounded-xl border px-4 py-2">Unidade 3 quartos</button>
          </div>

          <button
            onClick={() => {
              const ev = new KeyboardEvent('keydown', { key: 'Escape' }); // garante fechar se já tiver modal
              document.dispatchEvent(ev);
              // abre o mesmo modal do WhatsApp via botão flutuante
              const openBtn = document.querySelector<HTMLButtonElement>('button[aria-label="WhatsApp"]');
              openBtn?.click();
            }}
            className="mt-4 h-11 rounded-xl bg-emerald-500 px-5 font-medium text-white hover:bg-emerald-600"
          >
            Agendar visita
          </button>
        </aside>
      </div>

      <FloatingWhatsApp />
    </main>
  );
}
