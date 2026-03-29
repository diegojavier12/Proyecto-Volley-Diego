export interface CartaProps {
    id: number;
    idCard?: number;
    name: string;
    description: string;
    attack: number;
    defense: number;
    lifepoint: number;
    pinctureUrl: string;
    posicion: 'Atacante' | 'Armador' | 'Libero' | 'Bloqueador' | 'Universal';
    numero?: number;
}