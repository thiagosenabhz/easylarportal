'use client';
import projects from '@/app/_data/projects';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import VisitModal from '@/app/components/VisitModal';

export default function ImovelPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  const router = useRouter();
  const [openVisit, setOpenVisit] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const searchParams = useSearchParams();
  const selected = searchParams.get('tipologia') || '';

  if (!project) return <div className="container-xl py-10">Empreendimento não encontrado.</div>;

  const compareAllowed = Boolean((project as any).compareEnabled && (project as any).obraPhoto);

  return (
    <div className="container-xl py-4 space-y-6">
      <div className="sticky top-[64px] z-30 bg-[var(--bg)] py-3">
        <button onClick={()=>router.back()} className="btn border mr-2">← Voltar</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative">
        <div className="relative">
          {!showCompare && (
            <img src={project.thumb || 'https://placehold.co/1200x675?text=Fachada'} alt={project.name} className="w-full rounded-2xl border" />
          )}
          {showCompare && compareAllowed && (
            <div className="relative w-full rounded-2xl overflow-hidden border">
              <img src={(project as any).presentationPhoto || 'https://placehold.co/1200x675?text=Fachada+Apresentacao'} className="w-full block" />
              <div className="absolute inset-0" style={{clipPath:'polygon(0% 0%, 100% 0%, 0% 100%)', overflow:'hidden'}}>
                <img src={(project as any).obraPhoto} className="w-full block" />
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <a href="#lazer" className="btn bg-white/90">Área de lazer</a>
            <a href="#plantas" className="btn bg-white/90">Plantas</a>
            <a href="#implantacao" className="btn bg-white/90">Implantação</a>
            {compareAllowed && <button onClick={()=>setShowCompare(!showCompare)} className="btn bg-white/90">Comparar fachada/obra</button>}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-neutral-600">{[project.neighborhood, project.city && (project.state ? project.city + '-' + project.state : project.city)].filter(Boolean).join(' • ')}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {project.bedrooms?.length ? <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">{project.bedrooms.join('/')} quartos</span> : null}
            {'vagas' in project && project.vagas !== undefined ? <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">{project.vagas === 0 ? 'Sem vaga demarcada' : `${project.vagas} vaga(s)`}</span> : null}
            {project.varanda ? <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">Varanda</span> : null}
            {project.areaPrivativa ? <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">Área privativa</span> : null}
            {project.cobertura && <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">Cobertura {project.cobertura}</span>}
          </div>

          <div className="mt-6 space-x-2">
            {project.bedrooms?.map(b => (
              <button key={b} className={`btn border inline-block ${selected==String(b)?'bg-brandBlue text-white':''}`}>Unidade {b} quartos</button>
            ))}
          </div>

          <div className="mt-6">
            <button onClick={()=>setOpenVisit(true)} className="btn btn-primary">Agendar visita</button>
          </div>
        </div>
      </div>

      <VisitModal open={openVisit} onClose={()=>setOpenVisit(false)} />
    </div>
  );
}
