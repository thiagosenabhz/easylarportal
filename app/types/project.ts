import type { StaticImageData } from "next/image";

export interface Project {
  id: string;
  slug: string;
  name: string;
  city: string;                       // Ex: "Belo Horizonte - MG"
  neighborhood: string;               // Ex: "Pampulha"
  state?: string;                     // Ex: "MG"
  openingDate: string;                // "yyyy-mm-dd"
  deliveryDate: string;               // "yyyy-mm-dd"
  priceFrom: number;                  // Preço inicial em reais (inteiro)
  isLaunch: boolean;                  // true = Lançamento, false = Oportunidade
  thumb: string | StaticImageData;    // Caminho da imagem principal
  gallery?: (string | StaticImageData)[];
  leisure: string[];                  // Lista de itens de lazer
  typologies: {
    studio?: boolean;
    oneBedroom?: boolean;
    twoBedroom?: boolean;
    threeBedroom?: boolean;
    coverage?: boolean;
    privativa?: boolean;
  };
  parking: {
    spots0?: boolean;
    spots1?: boolean;
    spots2?: boolean;
    avulsa?: boolean;
  };
  showFacadeComparison?: boolean;
  updatedFacade?: string | StaticImageData;
}

export type ProjectList = Project[];
