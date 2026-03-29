import React from 'react';
import type { CartaProps } from '../tipos/tiposCarta';

const Carta: React.FC<CartaProps & { onCardClick: any, onDelete: any, onEdit: any }> = (props) => {
  return (
    <div onClick={() => props.onCardClick(props)} className="max-w-72 w-full rounded-xl overflow-hidden shadow-2xl m-3 bg-gray-900 border-2 border-[#FF7E00] transform transition hover:scale-105 cursor-pointer relative p-1">
      <div className="absolute top-2 right-2 z-20 flex space-x-2">
        <button onClick={(e) => { e.stopPropagation(); props.onEdit(props); }} className="p-2 bg-blue-600 rounded-full text-white"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
        <button onClick={(e) => { e.stopPropagation(); props.onDelete(props.id); }} className="p-2 bg-red-600 rounded-full text-white"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.86 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M1 7h22" /></svg></button>
      </div>
      <div className="h-48 overflow-hidden bg-black">
        <img className="w-full h-full object-cover" src={props.pinctureUrl} alt={props.name} />
      </div>
      <div className="px-4 py-3">
        <h2 className="font-black text-xl uppercase text-[#FF7E00] truncate">{props.name}</h2>
        <span className="text-[10px] font-bold text-gray-500 uppercase">{props.posicion}</span>
        <div className="flex justify-between mt-2 bg-black/40 p-2 rounded border border-gray-800">
          <div className="text-center"><p className="text-[9px] text-gray-500 font-bold">ATK</p><p className="font-black text-[#FF7E00]">{props.attack}</p></div>
          <div className="text-center"><p className="text-[9px] text-gray-500 font-bold">DEF</p><p className="font-black text-blue-400">{props.defense}</p></div>
          <div className="text-center"><p className="text-[9px] text-gray-500 font-bold">VIT</p><p className="font-black text-green-400">{props.lifepoint}</p></div>
        </div>
      </div>
    </div>
  );
};
export default Carta;