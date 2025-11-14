import type { ProjectList } from "@/app/types";

export const projects: ProjectList = [
  {
    id: "azul-e-verde",
    slug: "azul-e-verde",
    name: "Azul e Verde",
    city: "Belo Horizonte - MG",
    neighborhood: "Centro-Sul",
    state: "MG",
    openingDate: "2024-11-01",
    deliveryDate: "2029-01-01",
    priceFrom: 420000,
    isLaunch: true,
    thumb: "/empreendimentos/azul-e-verde/thumb.jpg",
    updatedFacade: "/empreendimentos/azul-e-verde/fachada_atual.jpg",
    leisure: ["Piscina", "Salão de festas", "Academia"],
    typologies: {
      // Novo modelo
      bedrooms: [2, 3],
      coverage: true,
      privativa: false,
      // Campos antigos (preenchidos para compatibilidade)
      twoBedroom: true,
      threeBedroom: true
    },
    parking: {
      // Novo modelo: 1 e 2 vagas disponíveis
      spots: [1, 2],
      // Campos antigos para compatibilidade
      spots1: true,
      spots2: true,
      avulsa: true
    },
    showFacadeComparison: false
  },
  {
    id: "vivence-lagoa",
    slug: "vivence-lagoa",
    name: "Vivence Lagoa",
    city: "Belo Horizonte - MG",
    neighborhood: "Pampulha",
    state: "MG",
    openingDate: "2023-05-01",
    deliveryDate: "2028-11-01",
    priceFrom: 390000,
    isLaunch: false,
    thumb: "/empreendimentos/vivence-lagoa/thumb.jpg",
    updatedFacade: "/empreendimentos/vivence-lagoa/fachada_atual.jpg",
    leisure: ["Piscina", "Espaço gourmet", "Playground"],
    typologies: {
      bedrooms: [2],
      privativa: true,
      twoBedroom: true
    },
    parking: {
      spots: [1],
      spots1: true,
      avulsa: true
    },
    showFacadeComparison: false
  }
];
