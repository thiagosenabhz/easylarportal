// app/api/projects/route.ts
// Rota interna para expor a lista de empreendimentos.
// Etapa 3: ainda usa o array estático de `_data/projects`.
// Na etapa 4, este arquivo será o ponto único para integrar com o Supabase.

import { NextResponse } from "next/server";
import { projects } from "@/app/_data/projects";

export async function GET() {
  return NextResponse.json(projects);
}
