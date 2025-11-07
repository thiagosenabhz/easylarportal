import SearchBar from '@/app/components/SearchBar';
import ProjectCard from '@/app/components/ProjectCard';
import projects from '@/app/_data/projects';
import ScrollHint from '@/app/components/ScrollHint';

export default function HomePage() {
  const pre = projects.filter(p => p.status === 'Pré-abertura');
  const opp = projects.filter(p => p.status === 'Oportunidade');
  return (
    <main>
      <section className="bg-brandBlue text-white">
        <div className="container-xl py-10">
          <h1 className="text-3xl font-bold">Encontre o imóvel dos seus sonhos</h1>
          <div className="mt-4 bg-white/10 p-3 rounded-2xl">
            <SearchBar />
          </div>
          <ScrollHint />
        </div>
      </section>
      <section id="pre-abertura" className="container-xl py-8">
        <h2 className="text-xl font-semibold mb-4">Pré-abertura</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pre.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
      <section id="oportunidades" className="container-xl pb-12">
        <h2 className="text-xl font-semibold mb-4">Oportunidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opp.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    </main>
  );
}
