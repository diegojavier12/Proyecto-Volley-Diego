import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "./Header/Header";
import CardDetail from "./card"; 
import { CardForm } from "./CardForm/CardForm";
import type { Card, FormFields } from "../types/card";

interface Appv2Props {
    mazo: Card[];
    setMazo: React.Dispatch<React.SetStateAction<Card[]>>;
}

export default function Appv2({ mazo, setMazo }: Appv2Props) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<FormFields>({
        nombre: "", ataque: 0, defensa: 0, vida: 100, descripcion: "", imagen: "", tipo: "", numero: 0
    });

    // EFECTO CLAVE: Cuando el ID cambia (al hacer click en una carta), rellenamos el formulario
    useEffect(() => {
        if (id) {
            const carta = mazo.find(c => String(c.numero) === id);
            if (carta) {
                setFormData({
                    nombre: carta.nb_name,
                    ataque: carta.nu_atk,
                    defensa: carta.nu_def,
                    vida: carta.nu_hp,
                    descripcion: carta.nb_description,
                    imagen: carta.nb_image,
                    tipo: carta.nb_type,
                    numero: carta.numero || 0
                });
                setIsFormVisible(true); // Mostramos el panel si no estaba abierto
            }
        }
    }, [id, mazo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ["ataque", "defensa", "vida"].includes(name) ? Number(value) : value
        }));
    };

    const handleSaveCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        // Si hay un ID, es una edición (PUT), si no, es creación (POST)
        const metodo = id ? 'PUT' : 'POST';
        const url = id ? `https://educapi-v2.onrender.com/card/${id}` : "https://educapi-v2.onrender.com/card";

        const payload = {
            nb_name: formData.nombre,
            nb_type: formData.tipo,
            nu_atk: formData.ataque,
            nu_def: formData.defensa,
            nu_hp: formData.vida,
            nb_description: formData.descripcion,
            nb_image: formData.imagen
        };

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 
                    'Content-Type': 'application/json', 
                    'usersecretpasskey': 'Dieg804808RO' 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                if (id) {
                    // Actualizar en el mazo local
                    setMazo(prev => prev.map(c => c.numero === Number(id) ? (data.data || data) : c));
                } else {
                    // Agregar nuevo
                    setMazo(prev => [...prev, data.data || data]);
                }
                resetForm();
            } else {
                setError("Error al procesar la carta.");
            }
        } catch {
            setError("Error de conexión con el servidor.");
        }
    };

    const resetForm = () => {
        setFormData({ nombre: "", ataque: 0, defensa: 0, vida: 100, descripcion: "", imagen: "", tipo: "", numero: 0 });
        setIsFormVisible(false);
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-[#A1887F] p-4 flex flex-col items-center">
            <Header />

            {/* BOTÓN CREAR NUEVA (Limpia el formulario y lo abre) */}
            {!isFormVisible && (
                <button 
                    className="mt-8 bg-white px-8 py-3 rounded-full border-4 border-[#FF7E00] font-black text-[#FF7E00] shadow-xl hover:scale-105 transition-all uppercase"
                    onClick={() => {
                        setFormData({ nombre: "", ataque: 0, defensa: 0, vida: 100, descripcion: "", imagen: "", tipo: "", numero: 0 });
                        setIsFormVisible(true);
                        navigate("/home");
                    }}
                >
                    + Crear Nueva Carta
                </button>
            )}

            <div className="flex flex-row w-full max-w-[1400px] gap-8 mt-10 items-start">
                
                {/* COLUMNA IZQUIERDA: SIEMPRE EL FORMULARIO */}
                {isFormVisible && (
                    <div className="w-[450px] shrink-0 sticky top-6">
                        <div className="bg-white rounded-3xl shadow-2xl p-6 border-t-[10px] border-[#FF7E00] relative">
                            
                            <button 
                                onClick={resetForm}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold z-10"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-black text-[#FF7E00] mb-6 uppercase text-center">
                                {id ? "Información de Carta" : "Crear Nueva Carta"}
                            </h2>

                            <CardForm 
                                editingCard={id ? mazo.find(c => String(c.numero) === id) || null : null}
                                formData={formData}
                                error={error}
                                onSave={handleSaveCard}
                                onClose={resetForm} 
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                )}

                {/* COLUMNA DERECHA: EL MAZO */}
                <div className={`flex flex-wrap gap-4 p-2 transition-all duration-500 ${isFormVisible ? 'flex-1 justify-start' : 'w-full justify-center'}`}>
                    {mazo.map((card) => (
                        <CardDetail 
                            key={card.numero} 
                            numero={card.numero || 0}
                            nombre={card.nb_name}
                            tipo={card.nb_type}
                            imagen={card.nb_image}
                            onCardClick={() => {
                                // Al hacer click, la URL cambia y el useEffect de arriba rellena el formulario
                                navigate(`/vista-carta/${card.numero}`);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}