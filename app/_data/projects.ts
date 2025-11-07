export type Cobertura = 'linear' | 'duplex';
export type Project = {
  slug: string;
  name: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  priceFrom?: number;
  bedrooms?: number[];
  vagas?: number;
  varanda?: boolean;
  areaPrivativa?: boolean;
  cobertura?: Cobertura | null;
  status?: 'Pré-abertura' | 'Oportunidade';
  thumb?: string;
};

export const projects: Project[] = [
  {
    slug: 'vivence-lagoa',
    name: 'Vivence Lagoa',
    neighborhood: 'Pampulha',
    city: 'Belo Horizonte',
    state: 'MG',
    priceFrom: 299000,
    bedrooms: [2],
    vagas: 1,
    varanda: true,
    areaPrivativa: false,
    cobertura: null,
    status: 'Oportunidade',
    thumb: 'https://placehold.co/640x360?text=Vivence+Lagoa'
  },
  {
    slug: 'azul-e-verde',
    name: 'Azul e Verde',
    neighborhood: 'Centro-Sul',
    city: 'Belo Horizonte',
    state: 'MG',
    priceFrom: 420000,
    bedrooms: [2,3],
    vagas: 0,
    varanda: true,
    areaPrivativa: true,
    cobertura: 'duplex',
    status: 'Pré-abertura',
    thumb: 'https://placehold.co/640x360?text=Azul+e+Verde'
  }
];
export default projects;
