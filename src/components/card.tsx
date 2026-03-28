import React from "react";
import type { Card } from "../types/card";

interface CardProps {
  numero: number;
  nombre: string;
  tipo: string;
  imagen: string;
  onCardClick: () => void;
  // Mantenemos estas para que no den error si las usas
  onEditClick?: (card: Card) => void;
  onDeleteClick?: (numero: number) => void;
}

const CardDetail: React.FC<CardProps> = ({ 
  nombre, tipo, imagen, onCardClick 
}) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg border-4 border-[#FF7E00] overflow-hidden m-2 w-64 transition-transform hover:scale-105 cursor-pointer"
      onClick={onCardClick}
    >
      {/* Tu contenedor de imagen original */}
      <div className="h-56 bg-gray-100 overflow-hidden">
        <img 
          src={imagen || "https://via.placeholder.com/150"} 
          alt={nombre} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Tu contenedor de texto original */}
      <div className="p-4 bg-white font-sans">
        <h3 className="text-2xl font-black text-center uppercase text-gray-900 mb-1">
          {nombre}
        </h3>
        <p className="text-sm text-[#FF7E00] font-bold text-center uppercase tracking-widest">
          {tipo}
        </p>
      </div>
    </div>
  );
};

export default CardDetail;