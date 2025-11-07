import Link from 'next/link';
import type { Project } from '@/app/_data/projects';
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export default function ProjectCard({ project }: { project: Project }) {
  const p = project;
  return (
    <article className="card overflow-hidden">
      <img src={p.thumb || 'https://placehold.co/640x360?text=EasyLar'} alt={p.name} className="w-full h-44 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{p.name}</h3>
        <p className="text-sm text-neutral-600">{[p.neighborhood, p.city && (p.state ? p.city + '-' + p.state : p.city)].filter(Boolean).join(' • ')}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {p.bedrooms?.length ? <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">{p.bedrooms.join('/')} quartos</span> : null}
          {'vagas' in p && p.vagas !== undefined ? <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">{p.vagas === 0 ? 'Sem vaga demarcada' : `${p.vagas} vaga(s)`}</span> : null}
          {p.varanda ? <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">Varanda</span> : null}
          {p.areaPrivativa ? <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">Área privativa</span> : null}
          {p.cobertura && <span className="px-2 py-1 rounded bg-blue-50 text-brandBlue">Cobertura {p.cobertura}</span>}
        </div>
        {typeof p.priceFrom === 'number' && (
          <p className="mt-2 text-emerald-700 font-semibold">{BRL.format(p.priceFrom)} <span className="text-neutral-500 font-normal text-sm">a partir</span></p>
        )}
        <div className="mt-3 flex gap-2">
          <Link href={`/imovel/${p.slug}`} className="flex-1 inline-flex items-center justify-center btn btn-primary">Ver detalhes</Link>
          <Link href={`/imovel/${p.slug}?tipologia=${p.bedrooms?.[0] || ''}`} className="btn border">Unidade {p.bedrooms?.[0] || ''}q</Link>
        </div>
      </div>
    </article>
  );
}
