import React from 'react';
import type { CartaProps } from '../tipos/tiposCarta';
import ComponenteCarta from './ComponenteCarta';

interface MazoProps {
  cartas: CartaProps[];
  onCardClick: (carta: CartaProps) => void;
  onDelete: (id: number) => void;
  onEdit: (carta: CartaProps) => void;
  seleccionadas: CartaProps[]; // <--- Agregado para rastrear qué cartas están seleccionadas
  onToggleSeleccion: (carta: CartaProps) => void; // <--- Agregado para activar el cambio
}

const MazoDeCartas: React.FC<MazoProps> = ({ cartas, onCardClick, onDelete, onEdit, seleccionadas = [], onToggleSeleccion }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {cartas.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-400 text-xl italic">El mazo está vacío. ¡Crea tu primera carta!</p>
        </div>
      ) : (
        cartas.map((carta) => {
          const idActual = carta.id;
          // Comprobamos si esta carta específica se encuentra en la alineación del campo de batalla
          const isSelected = seleccionadas.some((c) => c.id === idActual);

          return (
            <div 
              key={idActual || carta.idCard} 
              className="transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer"
            >
              <ComponenteCarta 
                {...carta} 
                onCardClick={() => onCardClick(carta)}
                onDelete={() => onDelete(idActual)}
                onEdit={() => onEdit(carta)} 
                estaSeleccionada={isSelected} // <--- Enviamos el booleano real
                onToggleSeleccion={() => onToggleSeleccion(carta)} // <--- Pasamos la acción
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default MazoDeCartas;