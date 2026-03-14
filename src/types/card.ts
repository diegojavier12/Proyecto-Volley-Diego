export type Card = {
    numero: number;
    nombre: string;
    tipo: string;
    ataque: number;
    defensa: number;
    descripcion: string;
    imagen: string;
    vida: number;
};

export type FormFields = Partial<Card> & { descripcion: string; tipo: string };