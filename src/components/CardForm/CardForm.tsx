import React from "react";
import type { FormFields } from "../../types/card";

interface CardFormProps {
    editingCard: any;
    formData: FormFields;
    error: string;
    onClose: () => void;
    onSave: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CardForm = ({ editingCard, formData, error, onClose, onSave, onChange }: CardFormProps) => {
    return (
        <form onSubmit={onSave} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#FF7E00] uppercase text-center">
                {editingCard ? "Editar Jugador" : "Nuevo Jugador"}
            </h2>
            
            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#FF7E00] uppercase">Nombre del Personaje</label>
                <input name="nombre" value={formData.nombre} onChange={onChange} className="bg-blue-50 p-2 rounded-lg border-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-[#FF7E00] uppercase">Tipo / Posición</label>
                    <input name="tipo" value={formData.tipo} onChange={onChange} className="bg-blue-50 p-2 rounded-lg border-none" />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-[#FF7E00] uppercase">Ataque</label>
                    <input type="number" name="ataque" value={formData.ataque} onChange={onChange} className="bg-blue-50 p-2 rounded-lg border-none" />
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#FF7E00] uppercase">URL Imagen</label>
                <input name="imagen" value={formData.imagen} onChange={onChange} className="bg-blue-50 p-2 rounded-lg border-none" />
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#FF7E00] uppercase">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={onChange} className="bg-blue-50 p-2 rounded-lg border-none h-20" />
            </div>

            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

            <div className="flex gap-2 mt-4">
                <button type="button" onClick={onClose} className="flex-1 bg-gray-200 p-2 rounded-full font-bold">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#FF7E00] text-white p-2 rounded-full font-bold">Guardar</button>
            </div>
        </form>
    );
};