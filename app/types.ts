
// app/types.ts

export type Project = {
  id: string;
  slug: string;
  name: string;

  // Localização
  city?: string;
  state?: string;
  neighborhood?: string;

  // Segmentações
  bedroomsLabel?: string;
  parkingLabel?: string;
  features?: string[];

  // Preço
  priceFrom?: string;

  // Imagem de capa opcional
  thumb?: string;
};
