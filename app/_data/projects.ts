import type { ProjectList } from "@/app/types";

export const projects: ProjectList = [
  {
    id: "azul-e-verde",
    slug: "azul-e-verde",
    name: "Azul e Verde",
    city: "Belo Horizonte - MG",
    neighborhood: "Centro-Sul",
    state: "MG",
    openingDate: "2025-01-01",
    deliveryDate: "2029-02-01",
    priceFrom: 420000,
    isLaunch: true,
    thumb: "/empreendimentos/azul-e-verde/thumb.jpg",
    gallery: ["/empreendimentos/azul-e-verde/fachada_atual.jpg"],
    leisure: [
      "Piscina adulto e infantil",
      "Espaço gourmet",
      "Academia",
      "Salão de festas"
    ],
    typologies: {
      oneBedroom: false,
      twoBedroom: true,
      threeBedroom: true,
      coverage: true,
      privativa: false
    },
    parking: {
      spots1: true,
      spots2: true,
      avulsa: true
    },
    showFacadeComparison: true,
    updatedFacade: "/empreendimentos/azul-e-verde/fachada_atual.jpg"
  },
  {
    id: "vivence-lagoa",
    slug: "vivence-lagoa",
    name: "Vivence Lagoa",
    city: "Belo Horizonte - MG",
    neighborhood: "Pampulha",
    state: "MG",
    openingDate: "2024-06-01",
    deliveryDate: "2028-12-01",
    priceFrom: 390000,
    isLaunch: false,
    thumb: "/empreendimentos/vivence-lagoa/thumb.jpg",
    gallery: ["/empreendimentos/vivence-lagoa/fachada_atual.jpg"],
    leisure: [
      "Piscina com raia",
      "Coworking",
      "Quadra recreativa"
    ],
    typologies: {
      studio: false,
      oneBedroom: false,
      twoBedroom: true,
      threeBedroom: false,
      coverage: false,
      privativa: true
    },
    parking: {
      spots1: true,
      spots2: false,
      avulsa: true
    },
    showFacadeComparison: false
  }
];

