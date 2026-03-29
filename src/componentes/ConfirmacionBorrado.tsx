
import React from 'react';


interface Props {
  abierto: boolean;    
  onConfirmar: () => void; 
  onCancelar: () => void;  
}

const ConfirmacionBorrado: React.FC<Props> = ({ abierto, onConfirmar, onCancelar }) => {
 
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border-2 border-red-600 p-8 rounded-xl text-center shadow-2xl max-w-sm w-full">
        
        <h2 className="text-2xl font-bold text-white mb-2 uppercase">¿Eliminar Guerrero?</h2>
        <p className="text-gray-400 mb-8 text-sm">Esta acción es permanente y no se puede deshacer.</p>
        
        <div className="flex gap-4">
          <button 
            onClick={onCancelar} 
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
          >
            NO, VOLVER
          </button>
          <button 
            onClick={onConfirmar} 
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded"
          >
            SÍ, BORRAR
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmacionBorrado;