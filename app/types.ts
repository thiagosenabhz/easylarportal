import type { StaticImageData } from "next/image";

// Tipologias de quartos e diferenciais
export interface ProjectTypologies {
  // NOVO: lista de quantidades de quartos (ex.: [1, 2, 3, 4])
  bedrooms?: number[];

  // CAMPOS ANTIGOS (mantidos por compatibilidade e UI do admin)
  studio?: boolean;
  oneBedroom?: boolean;
  twoBedroom?: boolean;
  threeBedroom?: boolean;

  // Diferenciais
  coverage?: boolean;
  privativa?: boolean;
  // Futuro: poderemos adicionar tipos de cobertura (linear / duplex / superior)
}

// Informações de vagas de garagem
export interface ProjectParking {
  // NOVO: lista de quantidades de vagas (use 0 para "sem vaga")
  spots?: number[];

  // CAMPOS ANTIGOS (mantidos por compatibilidade e UI do admin)
  spots0?: boolean;
  spots1?: boolean;
  spots2?: boolean;

  // Vaga avulsa
  avulsa?: boolean;
}

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

  // Imagens (URLs públicas ou import de StaticImage)
  thumb: string | StaticImageData;    // Imagem principal (fachada 3D ou destaque)
  updatedFacade?: string | StaticImageData; // Foto atual da obra (opcional)
  gallery?: (string | StaticImageData)[];   // Outras imagens gerais

  // Futuro (Supabase): poderemos especializar para lazer/plantas/implantação
  leisure: string[];                  // Lista de itens de lazer (texto)

  typologies: ProjectTypologies;
  parking: ProjectParking;

  showFacadeComparison?: boolean;     // Ativa a divisão diagonal na página do imóvel
}

export type ProjectList = Project[];
