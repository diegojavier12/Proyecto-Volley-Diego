export interface Card {
  numero?: number;
  nb_name: string;
  nb_type: string;
  nu_atk: number;
  nu_def: number;
  nu_hp: number;
  nb_description: string;
  nb_image: string;
}

export interface FormFields {
  nombre: string;
  tipo: string;
  ataque: number;
  defensa: number;
  vida: number;
  descripcion: string;
  imagen: string;
  numero: number;
}