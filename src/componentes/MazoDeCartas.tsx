import React from 'react';
import type { CartaProps } from '../tipos/tiposCarta'; // Agregado "type" aquí
import ComponenteCarta from './ComponenteCarta';

interface MazoProps {
  cartas: CartaProps[];
  onCardClick: (carta: CartaProps) => void;
  onDelete: (id: number) => void;
  onEdit: (carta: CartaProps) => void; // <-- Agregado esto que faltaba
}

const MazoDeCartas: React.FC<MazoProps> = ({ cartas, onCardClick, onDelete, onEdit }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {cartas.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-400 text-xl italic">El mazo está vacío. ¡Crea tu primera carta!</p>
        </div>
      ) : (
        cartas.map((carta) => (
          <div 
            key={carta.id || carta.idCard} 
            className="transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer"
          >
            <ComponenteCarta 
              {...carta} 
              onCardClick={() => onCardClick(carta)}
              onDelete={() => onDelete(carta.id)}
              onEdit={() => onEdit(carta)} // Ahora sí lo acepta
            />
          </div>
        ))
      )}
    </div>
  );
};

export default MazoDeCartas;