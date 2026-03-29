import React from 'react';
import type { CartaProps } from '../tipos/tiposCarta';

const ModalCartaDetalle: React.FC<{ carta: CartaProps, isOpen: boolean, onClose: any }> = ({ carta, isOpen, onClose }) => {
  if (!isOpen || !carta) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border-4 border-[#FF7E00] w-full max-w-4xl h-full max-h-[80vh] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-[#FF7E00] z-50">&times;</button>
        <div className="w-full md:w-1/2 p-10 overflow-y-auto text-white">
          <h1 className="text-5xl font-black mb-3 uppercase italic text-[#FF7E00]">{carta.name}</h1>
          <p className="text-sm font-bold tracking-widest uppercase mb-8 border-b border-gray-800 pb-4">POSICIÓN: {carta.posicion}</p>
          <h3 className="text-[#FF7E00] font-bold uppercase text-xs mb-2">Descripción:</h3>
          <p className="text-gray-300 italic mb-10 bg-gray-950/50 p-4 rounded border border-gray-800">{carta.description}</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-950 p-4 rounded border border-[#FF7E00]"><p className="text-xs text-gray-500 uppercase font-bold">Ataque</p><p className="text-3xl font-black text-[#FF7E00]">{carta.attack}</p></div>
            <div className="bg-gray-950 p-4 rounded border border-blue-500"><p className="text-xs text-gray-500 uppercase font-bold">Defensa</p><p className="text-3xl font-black text-blue-500">{carta.defense}</p></div>
            <div className="bg-gray-950 p-4 rounded border-green-500"><p className="text-xs text-gray-500 uppercase font-bold">Vida</p><p className="text-3xl font-black text-green-500">{carta.lifepoint}</p></div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-black flex justify-center items-center p-6">
          <img src={carta.pinctureUrl} alt={carta.name} className="max-h-full max-w-full object-contain rounded-lg border-2 border-gray-800" />
        </div>
      </div>
    </div>
  );
};
export default ModalCartaDetalle;