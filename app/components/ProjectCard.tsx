
// app/components/ProjectCard.tsx
import Link from "next/link";
import { Project } from "@/app/types";

type Props = { p: Project };

export default function ProjectCard({ p }: Props) {
  const imgSrc =
    p.thumb && p.thumb.trim().length > 0
      ? p.thumb
      : `https://placehold.co/640x360?text=${encodeURIComponent(p.name || "EasyLar")}`;

  const location = [p.neighborhood, p.city && (p.state ? `${p.city} - ${p.state}` : p.city)]
    .filter(Boolean)
    .join(" • ");

  return (
    <article className="card overflow-hidden">
      <img src={imgSrc} alt={p.name || "Empreendimento"} className="w-full h-44 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{p.name}</h3>
        {location && <p className="text-sm text-neutral-600">{location}</p>}
        {Array.isArray(p.features) && p.features.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {p.features.map((f, i) => (
              <span
                key={i}
                className="rounded-md bg-blue-50 text-blue-700 px-2 py-1 text-xs border border-blue-100"
              >
                {f}
              </span>
            ))}
          </div>
        )}
        {p.priceFrom && (
          <p className="mt-3 text-sm">
            <span className="font-semibold">{p.priceFrom}</span>{" "}
            <span className="text-neutral-500">a partir</span>
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <Link href={`/imovel/${p.slug}`} className="btn btn-primary">
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
