import projects from '@/app/_data/projects';
import Link from 'next/link';

export default function ImovelPage({ params, searchParams }: { params: { slug: string }, searchParams: { tipologia?: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return <div className="container-xl py-10">Empreendimento não encontrado.</div>;

  return (
    <div className="container-xl py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={project.thumb || 'https://placehold.co/800x450?text=EasyLar'} alt={project.name} className="w-full rounded-2xl border" />
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
              <Link key={b} href={`/imovel/${project.slug}?tipologia=${b}`} className="btn border inline-block">Unidade {b} quartos</Link>
            ))}
          </div>

          <div className="mt-6">
            <a href="#agendar" className="btn btn-primary">Agendar visita</a>
          </div>
        </div>
      </div>
    </div>
  );
}
