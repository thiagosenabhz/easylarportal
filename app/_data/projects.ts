
// app/_data/projects.ts
import { Project } from "@/app/types";

export const projects: Project[] = [
  {
    id: "azul-e-verde",
    slug: "azul-e-verde",
    name: "Azul e Verde",
    city: "Belo Horizonte",
    state: "MG",
    neighborhood: "Centro-Sul",
    bedroomsLabel: "2/3 quartos",
    parkingLabel: "Sem vaga demarcada",
    features: ["Varanda", "Área privativa", "Cobertura duplex"],
    priceFrom: "R$ 420.000",
    thumb: "",
  },
  {
    id: "vivence-lagoa",
    slug: "vivence-lagoa",
    name: "Vivence Lagoa",
    city: "Belo Horizonte",
    state: "MG",
    neighborhood: "Pampulha",
    bedroomsLabel: "2 quartos",
    parkingLabel: "1 vaga(s)",
    features: ["Varanda"],
    priceFrom: "R$ 299.000",
    thumb: "",
  },
];

export default projects;
