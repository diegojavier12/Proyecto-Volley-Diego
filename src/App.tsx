import React, { useState } from "react";
import "./App.css";

// Tipos
import type { Card, FormFields } from "./types/card";

// Componentes
import { Header } from "./components/Header/Header";
import { CardForm } from "./components/CardForm/CardForm";
import { CardDetailModal } from "./components/CardDetailModal/CardDetailModal";
import CardDetail from "./components/card";

const initialCards: Card[] = [
    {
        ataque: 270,
        nombre: "Shōyō Hinata",
        defensa: 100,
        descripcion: "Atacante central (middle blocker) de Karasuno, a pesar de su corta estatura. Es el protagonista de la serie y es conocido por su increíble agilidad, saltos sobrehumanos y su determinación inquebrantable.",
        imagen: "https://i.redd.it/p9ovxh9mtcw51.jpg",
        numero: 1,
        tipo: "Atacante y Salto",
        vida: 100,
    },
    {
        ataque: 60,
        nombre: "Yū Nishinoya",
        defensa: 450,
        descripcion: "Libero del equipo de voleibol de Karasuno. Es famoso por sus increíbles reflejos, su velocidad y su habilidad para salvar cualquier balón (guardián de Karasuno).",
        imagen: "https://i.pinimg.com/originals/57/50/f8/5750f89c92db4b576a4b73be419d17bf.jpg",
        numero: 2,
        tipo: "Defensor y Rapidez",
        vida: 100,
    },
    {
        ataque: 280,
        nombre: "Tobio Kageyama",
        defensa: 380,
        descripcion: "Armador/colocador genio de Karasuno. Inicialmente conocido como el Rey de la Cancha por su actitud autoritaria, destaca por su precisión técnica inigualable.",
        imagen: "https://i.pinimg.com/736x/a2/d8/10/a2d810489524f93d25da8f6e45a50b5f.jpg",
        numero: 3,
        tipo: "Armador Y Sacador",
        vida: 100,
    },
];

function App() {
    const [cards, setCards] = useState<Card[]>(initialCards);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<FormFields>({
        nombre: "", ataque: 0, defensa: 0, vida: 100,
        descripcion: "", imagen: "", tipo: "", numero: 0
    });

    const toggleFormModal = (open: boolean, cardToEdit: Card | null = null) => {
        setIsModalOpen(open);
        setError("");
        if (open && cardToEdit) {
            setEditingCard(cardToEdit);
            setFormData(cardToEdit as FormFields);
        } else {
            setEditingCard(null);
            setFormData({ nombre: "", ataque: 0, defensa: 0, vida: 100, descripcion: "", imagen: "", tipo: "", numero: 0 });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ["ataque", "defensa", "vida"].includes(name) ? Number(value) : value
        } as FormFields));
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre || !formData.descripcion || !formData.imagen) {
            setError("Rellena todos los campos.");
            return;
        }

        if (editingCard) {
            setCards(cards.map(c => c.numero === editingCard.numero ? { ...formData, numero: c.numero } as Card : c));
        } else {
            const newCard = { ...formData, numero: cards.length + 1 } as Card;
            setCards([...cards, newCard]);
        }
        toggleFormModal(false);
    };

    // Objeto con acciones para las cartas
    const cardActions = {
        onCardClick: setSelectedCard,
        onEditClick: (card: Card) => toggleFormModal(true, card),
        onDeleteClick: (num: number) => setCards(cards.filter(c => c.numero !== num))
    };

    return (
        <div className="min-h-screen bg-[#A1887F] flex flex-col items-center p-8">
            <Header />

            <div className="flex flex-wrap justify-center max-w-5xl w-full">
                {cards.map((card) => (
                    <CardDetail 
                        key={card.numero} 
                        {...card} 
                        {...cardActions}
                        isFlipped={false}
                        isModalView={false}
                    />
                ))}
            </div>

            <button 
                className="mt-10 bg-white p-4 rounded-full border-2 border-[#FF7E00] font-bold"
                onClick={() => toggleFormModal(true)}
            >
                Agregar Nueva Carta
            </button>

            {isModalOpen && (
                <CardForm 
                    editingCard={editingCard}
                    formData={formData}
                    error={error}
                    onClose={() => toggleFormModal(false)}
                    onSave={handleSaveCard}
                    onChange={handleInputChange}
                />
            )}

            {selectedCard && (
                <CardDetailModal 
                    selectedCard={selectedCard}
                    onClose={() => setSelectedCard(null)}
                    onEditClick={cardActions.onEditClick}
                    onDeleteClick={cardActions.onDeleteClick}
                />
            )}
        </div>
    );
}

export default App;