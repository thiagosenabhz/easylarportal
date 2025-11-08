// app/_data/projects.ts
export type VagaTipo = '1 vaga' | '2 vagas' | 'vaga avulsa' | 'sem vaga demarcada'

export type Project = {
  id: string
  slug: string
  title: string
  /** Cidade usada nos filtros principais */
  cidade: 'Belo Horizonte' | 'Contagem'
  /** Bairro usado no filtro de bairros (opcional mas recomendado) */
  bairro?: string
  /** Etiquetas livres (ex.: "Varanda", "Área privativa" etc.) */
  tags: string[]
  /** Preço "a partir de" (em reais) */
  priceFrom: number
  /** Features estruturadas usadas pelos filtros */
  features: {
    quartos: number[]              // ex.: [2,3]
    vagas: VagaTipo[]              // ex.: ['1 vaga', 'vaga avulsa']
    varanda?: boolean
    areaPrivativa?: boolean
    cobertura?: 'duplex' | 'linear' | null
  }
  /** Campo aberto para evoluções futuras */
  extra?: Record<string, unknown>
}

// ====== DADOS EXEMPLO ======
// Pode manter/ajustar conforme seus empreendimentos reais.
export const projects: Project[] = [
  {
    id: 'azul-e-verde',
    slug: 'azul-e-verde',
    title: 'Azul e Verde',
    cidade: 'Belo Horizonte',
    bairro: 'Centro-Sul',
    priceFrom: 420000,
    tags: ['Sem vaga demarcada', 'Varanda', 'Área privativa', 'Cobertura duplex'],
    features: {
      quartos: [2, 3],
      vagas: ['sem vaga demarcada', 'vaga avulsa'],
      varanda: true,
      areaPrivativa: true,
      cobertura: 'duplex',
    },
  },
  {
    id: 'vivence-lagoa',
    slug: 'vivence-lagoa',
    title: 'Vivence Lagoa',
    cidade: 'Belo Horizonte',
    bairro: 'Pampulha',
    priceFrom: 299000,
    tags: ['1 vaga(s)', 'Varanda'],
    features: {
      quartos: [2],
      vagas: ['1 vaga'],
      varanda: true,
      areaPrivativa: false,
      cobertura: null,
    },
  },
]
