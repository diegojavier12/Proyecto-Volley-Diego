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
        nu_atk: 270,
        nb_name: "Shōyō Hinata",
        nu_def: 100,
        nb_description: "Atacante central (middle blocker) de Karasuno, a pesar de su corta estatura.",
        nb_image: "https://i.redd.it/p9ovxh9mtcw51.jpg",
        numero: 1,
        nb_type: "Atacante y Salto",
        nu_hp: 100,
    },
    {
        nu_atk: 60,
        nb_name: "Yū Nishinoya",
        nu_def: 450,
        nb_description: "Libero del equipo de voleibol de Karasuno. Famoso por sus reflejos.",
        nb_image: "https://i.pinimg.com/originals/57/50/f8/5750f89c92db4b576a4b73be419d17bf.jpg",
        numero: 2,
        nb_type: "Defensor y Rapidez",
        nu_hp: 100,
    },
    {
        nu_atk: 280,
        nb_name: "Tobio Kageyama",
        nu_def: 380,
        nb_description: "Armador/colocador genio de Karasuno. El Rey de la Cancha.",
        nb_image: "https://i.pinimg.com/736x/a2/d8/10/a2d810489524f93d25da8f6e45a50b5f.jpg",
        numero: 3,
        nb_type: "Armador Y Sacador",
        nu_hp: 100,
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

    // MODIFICADO: Aseguramos que cargue TODOS los campos al editar y los limpie al crear
    const toggleFormModal = (open: boolean, cardToEdit: Card | null = null) => {
        setIsModalOpen(open);
        setError("");
        if (open && cardToEdit) {
            setEditingCard(cardToEdit);
            setFormData({
                nombre: cardToEdit.nb_name,
                ataque: cardToEdit.nu_atk,    // <-- Antes quizás no estaba cargando nu_atk
                defensa: cardToEdit.nu_def,  // <-- Cargamos defensa
                vida: cardToEdit.nu_hp,      // <-- Cargamos vida
                descripcion: cardToEdit.nb_description,
                imagen: cardToEdit.nb_image,
                tipo: cardToEdit.nb_type,
                numero: cardToEdit.numero || 0
            });
        } else {
            setEditingCard(null);
            // Limpiamos con valores por defecto para que no queden vacíos
            setFormData({ 
                nombre: "", 
                ataque: 0, 
                defensa: 0, 
                vida: 100, 
                descripcion: "", 
                imagen: "", 
                tipo: "", 
                numero: 0 
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ["ataque", "defensa", "vida"].includes(name) ? Number(value) : value
        }));
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre || !formData.descripcion || !formData.imagen) {
            setError("Rellena todos los campos.");
            return;
        }

        const newCardData: Card = {
            nb_name: formData.nombre,
            nu_atk: formData.ataque,
            nu_def: formData.defensa,
            nu_hp: formData.vida,
            nb_description: formData.descripcion,
            nb_image: formData.imagen,
            nb_type: formData.tipo,
            numero: editingCard ? editingCard.numero : cards.length + 1
        };

        if (editingCard) {
            setCards(cards.map(c => c.numero === editingCard.numero ? newCardData : c));
        } else {
            setCards([...cards, newCardData]);
        }
        toggleFormModal(false);
    };

    const cardActions = {
        onCardClick: (card: Card) => setSelectedCard(card),
        onEditClick: (card: Card) => {
            setSelectedCard(null);
            toggleFormModal(true, card);
        },
        onDeleteClick: (num: number) => {
            setCards(cards.filter(c => c.numero !== num));
            setSelectedCard(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#A1887F] flex flex-col items-center p-8">
            <Header />

            <div className="flex flex-wrap justify-center max-w-6xl w-full gap-6 mt-6">
                {cards.map((card) => (
                    <CardDetail 
                        key={card.numero} 
                        numero={card.numero || 0}
                        nombre={card.nb_name}
                        tipo={card.nb_type}
                        imagen={card.nb_image}
                        onCardClick={() => cardActions.onCardClick(card)}
                    />
                ))}
            </div>

            <button 
                className="mt-10 bg-white p-4 rounded-full border-2 border-[#FF7E00] font-bold shadow-md hover:scale-105 transition-transform"
                onClick={() => toggleFormModal(true)}
            >
                Agregar Nueva Carta
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative">
                        <CardForm 
                            editingCard={editingCard}
                            formData={formData}
                            error={error}
                            onClose={() => toggleFormModal(false)}
                            onSave={handleSaveCard}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
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