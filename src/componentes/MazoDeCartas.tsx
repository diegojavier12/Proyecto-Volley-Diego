import type { CartaProps } from '../tipos/tiposCarta';

interface MazoProps {
  cartas: CartaProps[];
  onCardClick: (carta: CartaProps) => void;
  onDelete: (id: number) => void;
  onEdit: (carta: CartaProps) => void;
  seleccionadas: CartaProps[];
  onToggleSeleccion: (carta: CartaProps) => void;
}

function MazoDeCartas({ cartas, onCardClick, onDelete, onEdit, seleccionadas, onToggleSeleccion }: MazoProps) {
  return (
    
    <div className="w-full max-w-7xl mx-auto p-6">
      
      { }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {cartas.map((carta) => {
          const estaSeleccionada = seleccionadas.some((c) => c.id === carta.id);

          return (
            <div 
              key={carta.id} 
              className={`w-72 bg-[#161d26] border-2 rounded-2xl p-4 flex flex-col justify-between transition-all h-117.5 ${
                estaSeleccionada ? 'border-orange-500 scale-[1.02] shadow-lg shadow-orange-500/10' : 'border-[#1f2937]'
              }`}
            >
              { }
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-xs font-bold bg-[#242f3d] px-2 py-1 rounded-md border border-neutral-700">
                  N° {carta.numero || 0}
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSeleccion(carta);
                  }}
                  className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded border transition-all ${
                    estaSeleccionada
                      ? 'bg-orange-600 border-orange-500 text-white'
                      : 'bg-[#242f3d] border-neutral-700 text-gray-400 hover:text-white hover:border-neutral-500'
                  }`}
                >
                  {estaSeleccionada ? '✓ Titular' : '+ Convocado'}
                </button>
              </div>

              { }
              <div onClick={() => onCardClick(carta)} className="cursor-pointer flex-1 flex flex-col justify-between">
                <div>
                  <img 
                    src={carta.pictureUrl} 
                    alt={carta.name} 
                    className="w-full h-40 object-cover rounded-xl mb-2 bg-neutral-800" 
                  />
                  
                  <h3 className="text-white font-black text-lg leading-tight uppercase tracking-wide truncate">{carta.name}</h3>
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">{carta.posicion}</span>
                  <p className="text-gray-400 text-xs my-2 line-clamp-2 min-h-8 leading-snug">
                    {carta.description}
                  </p>
                </div>

                { }
                <div className="flex justify-around bg-black/30 p-2 rounded-xl my-2 text-center text-xs font-mono border border-neutral-900">
                  <div>
                    <span className="text-gray-500 text-[10px] block font-bold uppercase">Ataque</span>
                    <span className="text-amber-500 font-black">{carta.attack}</span>
                  </div>
                  <div className="border-l border-neutral-800 h-6 my-auto"></div>
                  <div>
                    <span className="text-gray-500 text-[10px] block font-bold uppercase">Defensa</span>
                    <span className="text-blue-400 font-black">{carta.defense}</span>
                  </div>
                </div>
              </div>

              { }
              <div className="flex justify-between gap-3 mt-2 pt-2 border-t border-[#1f2937]">
                <button 
                  onClick={() => onEdit(carta)} 
                  className="flex-1 text-center bg-[#202b3a] hover:bg-[#2b3a4f] text-white text-xs font-bold py-2 rounded-xl transition-all border border-neutral-800"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(carta.id)} 
                  className="flex-1 text-center bg-red-950/30 hover:bg-red-600 border border-red-900/60 text-red-400 hover:text-white text-xs font-bold py-2 rounded-xl transition-all"
                >
                  Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MazoDeCartas;