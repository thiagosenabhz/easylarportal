export type VagaTipo = '1 vaga' | '2 vagas' | 'vaga avulsa' | 'sem vaga demarcada';

export type Project = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state?: string;
  neighborhood?: string;
  bedroomsLabel?: string;
  parkingLabel?: string;
  features?: string[];
  priceFrom?: string;
  /** Thumbnail (URL or /public path). Optional. */
  thumb?: string;
};
