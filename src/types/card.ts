export interface Card {
  numero?: number;
  name: string;
  attributes?: string;
  attack: number;
  defense: number;
  lifePoints: number;
  description: string;
  pictureUrl: string;
  idCard?: number;
}

export interface FormFields {
  nombre: string;
  tipo?: string;
  ataque: number;
  defensa: number;
  vida: number;
  descripcion: string;
  imagen: string;
  numero: number;
}