import CardDetail from "../card";
import type { Card } from "../../types/card"; // Añade la palabra 'type'

interface Props {
    selectedCard: Card;
    onClose: () => void;
    onEditClick: (card: Card) => void;
    onDeleteClick: (numero: number) => void;
}

export const CardDetailModal = ({ selectedCard, onClose, onEditClick, onDeleteClick }: Props) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-40 p-4" 
            onClick={onClose}
        >
            <CardDetail
                {...selectedCard}
                onCardClick={() => {}} // No hace nada al hacer clic dentro del modal
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                isFlipped={true}
                isModalView={true} 
            />
        </div>
    );
};