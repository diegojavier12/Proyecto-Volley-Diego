import type { Card } from "../../types/card";

interface CardDetailModalProps {
    selectedCard: Card;
    onClose: () => void;
    onEditClick: (card: Card) => void;
    onDeleteClick: (num: number) => void;
}

export const CardDetailModal = ({ selectedCard, onClose, onEditClick, onDeleteClick }: CardDetailModalProps) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md relative border-t-[12px] border-[#FF7E00]">
                
                {/* Botón cerrar */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold z-10"
                >
                    ✕
                </button>

                {/* Imagen del Personaje */}
                <img 
                    src={selectedCard.nb_image} 
                    alt={selectedCard.nb_name} 
                    className="w-full h-64 object-cover" 
                />

                <div className="p-6 flex flex-col items-center">
                    <h2 className="text-3xl font-black text-gray-800 uppercase italic leading-none">
                        {selectedCard.nb_name}
                    </h2>
                    <p className="text-[#FF7E00] font-bold text-sm tracking-[0.2em] mb-6 uppercase">
                        {selectedCard.nb_type}
                    </p>

                    {/* Stats Grilla */}
                    <div className="grid grid-cols-3 gap-4 w-full mb-6">
                        <div className="bg-orange-50 p-2 rounded-xl text-center border border-orange-100">
                            <span className="block text-[10px] font-black text-orange-400">ATK</span>
                            <span className="text-xl font-black text-orange-600">{selectedCard.nu_atk}</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-xl text-center border border-blue-100">
                            <span className="block text-[10px] font-black text-blue-400">DEF</span>
                            <span className="text-xl font-black text-blue-600">{selectedCard.nu_def}</span>
                        </div>
                        <div className="bg-red-50 p-2 rounded-xl text-center border border-red-100">
                            <span className="block text-[10px] font-black text-red-400">HP</span>
                            <span className="text-xl font-black text-red-600">{selectedCard.nu_hp}</span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-center italic mb-8 px-4 leading-tight">
                        "{selectedCard.nb_description}"
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex gap-4 w-full">
                        <button 
                            onClick={() => onEditClick(selectedCard)}
                            className="flex-1 bg-white border-2 border-[#FF7E00] text-[#FF7E00] py-3 rounded-2xl font-black hover:bg-orange-50 transition-colors"
                        >
                            EDITAR
                        </button>
                        <button 
                            onClick={() => onDeleteClick(selectedCard.numero || 0)}
                            className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-black hover:bg-red-600 transition-colors"
                        >
                            ELIMINAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};