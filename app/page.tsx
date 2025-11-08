import * as React from 'react';
import SearchSidebar from '@/app/components/SearchSidebar';
import { projects } from '@/app/_data/projects';

/**
 * Home (frontpage) — import corrigido para { projects } (export nomeado).
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 lg:px-6 py-6 grid md:grid-cols-[20rem,1fr] gap-8">
      <SearchSidebar />
      <section className="space-y-4">
        {projects.map((p) => (
          <article key={p.id} className="p-4 rounded-lg border bg-white">
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-neutral-600">
              {[p.neighborhood, p.city && (p.state ? p.city + ' - ' + p.state : p.city)]
                .filter(Boolean)
                .join(' • ')}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
