import React from "react";
import type { FormFields } from "../../types/card";

interface CardFormProps {
    editingCard: any;
    formData: FormFields;
    error: string;
    onClose: () => void;
    onSave: (e: React.FormEvent) => void;
    // Corregimos la definición del evento para que no dé error en App.tsx
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CardForm = ({ editingCard, formData, error, onClose, onSave, onChange }: CardFormProps) => {
    return (
        // Agregamos el recuadro blanco aquí
        <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-xl relative border-t-[10px] border-[#FF7E00]">
            {/* Botón X para cerrar (ClaseClcon.tsx o CloseIcon.tsx) */}
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold z-10"
            >
                ✕
            </button>

            <form onSubmit={onSave} className="flex flex-col gap-4">
                <h2 className="text-2xl font-black text-[#FF7E00] uppercase text-center mb-2">
                    {editingCard ? "Editar Jugador" : "Nuevo Jugador"}
                </h2>
                
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">Nombre del Personaje</label>
                    <input name="nombre" value={formData.nombre} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">Tipo / Posición</label>
                        <input name="tipo" value={formData.tipo} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">Ataque</label>
                        <input type="number" name="ataque" value={formData.ataque} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00]" />
                    </div>
                </div>

                {/* Agregamos Defensa y Vida aquí (si no los tenías) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">Defensa</label>
                        <input type="number" name="defensa" value={formData.defensa} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00]" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">Vida (HP)</label>
                        <input type="number" name="vida" value={formData.vida} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00]" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">URL Imagen</label>
                    <input name="imagen" value={formData.imagen} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00]" />
                </div>

                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-[#FF7E00] uppercase mb-1">Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={onChange} className="bg-blue-50 p-3 rounded-xl border-none outline-[#FF7E00] h-20 resize-none" />
                </div>

                {error && <p className="text-red-500 text-xs font-black text-center">{error}</p>}

                <div className="flex gap-3 mt-4">
                    <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 p-3 rounded-2xl font-black hover:bg-gray-200">
                        CANCELAR
                    </button>
                    <button type="submit" className="flex-1 bg-[#FF7E00] text-white p-3 rounded-2xl font-black shadow-lg hover:bg-[#e67200]">
                        GUARDAR
                    </button>
                </div>
            </form>
        </div>
    );
};