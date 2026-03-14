import type { Card } from "../types/card"; // Importa el tipo centralizado
import { CloseIcon } from "./CardForm/CloseIcon"; // Reutiliza el icono que ya tienes

interface Props extends Card {
    onCardClick: (card: Card | null) => void;
    onEditClick: (card: Card) => void;
    onDeleteClick: (numero: number) => void;
    isFlipped?: boolean; 
    isModalView?: boolean; 
}

function CardDetail({
    ataque, defensa, descripcion, imagen, nombre, numero, tipo, vida,
    onCardClick, onEditClick, onDeleteClick, isFlipped = false, isModalView = false,
}: Props) {
    const cardData: Card = { numero, nombre, tipo, ataque, defensa, descripcion, imagen, vida };
    const handleCardClick = () => {
        if (!isModalView) {
            onCardClick(cardData);
        }
    };
    const cardBaseClasses = "bg-[#FFF8E1] rounded-xl shadow-2xl transition-all duration-300 ease-in-out cursor-pointer font-sans";
    const hoverClasses = isModalView ? "" : "hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,160,0,0.8)]"; 
    const cardSizeClasses = isModalView ? "w-[300px] h-auto p-4 border-4 border-[#FF7E00]" : "w-64 p-4 m-4 border-2 border-[#FF7E00] flex flex-col items-center text-center";
    const textPrimary = "text-[#3E2723]"; 
    const textHighlight = "text-[#FF7E00]"; 
    const textAttack = "text-red-700";
    const textDefense = "text-blue-700";

    if (!isFlipped && !isModalView) {
        return (
            <div 
                className={`${cardBaseClasses} ${cardSizeClasses} ${hoverClasses} justify-center items-center`}
                onClick={handleCardClick}
            >
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <img
                        src={imagen}
                        alt={nombre}
                        className="w-full h-48 object-cover rounded-lg border-2 border-[#FFB300] shadow-md"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Cargando+Imagen'; }} 
                    />
                    <p className={`mt-2 font-black text-xl ${textPrimary}`}>{nombre}</p>
                </div>
            </div>
        );
    }
    return (
        <div 
            className={`${cardBaseClasses} ${cardSizeClasses} ${hoverClasses} ${textPrimary} ${isModalView ? "relative" : ""}`}
            onClick={isModalView ? undefined : handleCardClick}
        >
            {}
            {isModalView && (
                <button 
                    className="absolute top-3 right-3 p-1 rounded-full bg-white hover:bg-gray-200 transition-colors z-10" 
                    onClick={() => onCardClick(null)} 
                    title="Cerrar"
                >
                    <CloseIcon />
                </button>
            )}
            <h3 className="text-xl font-black mb-2 border-b-2 border-[#FFB300] pb-1 w-full">
                {nombre} <span className={`text-sm font-normal ${textHighlight} ml-1`}>&mdash; #{numero}</span>
            </h3>
            <img
                src={imagen}
                alt={nombre}
                className={`w-full ${isModalView ? 'h-48' : 'h-40'} object-cover rounded-lg border-4 border-[#FFB300] my-2 shadow-lg`}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Cargando+Imagen'; }} 
            />
            <div className="text-left w-full space-y-1 text-sm">
                <p><span className="font-semibold text-base">Tipo:</span> {tipo}</p>
                <p><span className={`font-semibold text-base ${textAttack}`}>Ataque:</span> {ataque}</p>
                <p><span className={`font-semibold text-base ${textDefense}`}>Defensa:</span> {defensa}</p>
                <p><span className={`font-semibold text-base ${textDefense}`}>Vida:</span> {vida}</p>
            </div>

            <p className="text-xs italic mt-3 text-gray-700 w-full text-justify border-t-2 border-[#FFB300] pt-3">
                <span className="font-bold">Descripción:</span> {descripcion} 
            </p>

            <div className="flex justify-around w-full mt-4 space-x-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEditClick(cardData); }}
                    className="bg-[#FFB300] hover:bg-[#FF9800] text-black font-bold py-1 px-3 rounded-full text-sm transition duration-150 ease-in-out shadow-md"
                >
                    Editar
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteClick(numero); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-sm transition duration-150 ease-in-out shadow-md"
                >
                    Borrar
                </button>
            </div>
        </div>
    );
}; // <--- ESTA ES LA LLAVE QUE FALTA PARA CERRAR LA FUNCIÓN

export default CardDetail;