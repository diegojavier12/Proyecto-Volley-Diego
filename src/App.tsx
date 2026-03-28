import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
        nb_description: "Atacante central de Karasuno. Conocido por su agilidad y saltos sobrehumanos.",
        nb_image: "https://i.redd.it/p9ovxh9mtcw51.jpg",
        numero: 1,
        nb_type: "Atacante y Salto",
        nu_hp: 100,
    },
    {
        nu_atk: 60,
        nb_name: "Yū Nishinoya",
        nu_def: 450,
        nb_description: "Libero de Karasuno. Famoso por sus reflejos y por ser el guardián del equipo.",
        nb_image: "https://i.pinimg.com/originals/57/50/f8/5750f89c92db4b576a4b73be419d17bf.jpg",
        numero: 2,
        nb_type: "Defensor y Rapidez",
        nu_hp: 100,
    },
    {
        nu_atk: 280,
        nb_name: "Tobio Kageyama",
        nu_def: 380,
        nb_description: "Armador genio de Karasuno. Destaca por su precisión técnica inigualable.",
        nb_image: "https://i.pinimg.com/736x/a2/d8/10/a2d810489524f93d25da8f6e45a50b5f.jpg",
        numero: 3,
        nb_type: "Armador Y Sacador",
        nu_hp: 100,
    },
];

function App() {
    const navigate = useNavigate();
    const [cards, setCards] = useState<Card[]>(initialCards);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [formData, setFormData] = useState<FormFields>({
        nombre: "", ataque: 0, defensa: 0, vida: 100,
        descripcion: "", imagen: "", tipo: "", numero: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ["ataque", "defensa", "vida"].includes(name) ? Number(value) : value
        }));
    };

    const openForm = (card: Card | null = null) => {
        if (card) {
            setEditingCard(card);
            setFormData({
                nombre: card.nb_name, ataque: card.nu_atk, defensa: card.nu_def,
                vida: card.nu_hp, descripcion: card.nb_description,
                imagen: card.nb_image, tipo: card.nb_type, numero: card.numero || 0
            });
            navigate(`/editar/${card.numero}`);
        } else {
            setEditingCard(null);
            setFormData({ nombre: "", ataque: 0, defensa: 0, vida: 100, descripcion: "", imagen: "", tipo: "", numero: 0 });
            navigate("/nuevo");
        }
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        // Forzamos un número válido para que TS no llore
        const idFinal = editingCard?.numero ?? Date.now();
        
        const cardToSave: Card = {
            nb_name: formData.nombre,
            nu_atk: formData.ataque,
            nu_def: formData.defensa,
            nu_hp: formData.vida,
            nb_description: formData.descripcion,
            nb_image: formData.imagen,
            nb_type: formData.tipo,
            numero: idFinal
        };

        if (editingCard) {
            setCards(cards.map(c => c.numero === editingCard.numero ? cardToSave : c));
        } else {
            setCards([...cards, cardToSave]);
        }
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#A1887F] flex flex-col items-center p-8">
            <Header />

            <Routes>
                <Route path="/" element={
                    <>
                        <div className="flex flex-wrap justify-center max-w-6xl w-full gap-6 mt-6">
                            {cards.map((card) => (
                                <CardDetail 
                                    key={card.numero} 
                                    numero={card.numero ?? 0} // <--- ESTO ARREGLA EL ERROR DE LA LÍNEA 70
                                    nombre={card.nb_name}
                                    tipo={card.nb_type}
                                    imagen={card.nb_image}
                                    onCardClick={() => {
                                        setSelectedCard(card);
                                        navigate(`/detalle/${card.numero}`);
                                    }}
                                />
                            ))}
                        </div>
                        <button 
                            className="mt-10 bg-white p-4 rounded-full border-2 border-[#FF7E00] font-bold shadow-lg"
                            onClick={() => openForm()}
                        >
                            Agregar Nueva Carta
                        </button>
                    </>
                } />

                {/* Rutas de Formulario con el diseño de recuadro blanco */}
                <Route path="/nuevo" element={
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <CardForm 
                            editingCard={null} formData={formData} error="" 
                            onClose={() => navigate("/")} onSave={handleSaveCard} onChange={handleInputChange} 
                        />
                    </div>
                } />

                <Route path="/editar/:id" element={
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <CardForm 
                            editingCard={editingCard} formData={formData} error="" 
                            onClose={() => navigate("/")} onSave={handleSaveCard} onChange={handleInputChange} 
                        />
                    </div>
                } />
            </Routes>

            {selectedCard && (
                <CardDetailModal 
                    selectedCard={selectedCard}
                    onClose={() => { setSelectedCard(null); navigate("/"); }}
                    onEditClick={(card) => { setSelectedCard(null); openForm(card); }}
                    onDeleteClick={(num) => {
                        setCards(cards.filter(c => c.numero !== num));
                        setSelectedCard(null);
                        navigate("/");
                    }}
                />
            )}
        </div>
    );
}

export default App;