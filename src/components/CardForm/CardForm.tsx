import type { FormEvent, ChangeEvent } from "react"; // Quitamos el "React" de adelante
import type { Card, FormFields } from "../../types/card";
import { CloseIcon } from "./CloseIcon";

interface Props {
    editingCard: Card | null;
    formData: FormFields;
    error: string;
    onClose: () => void;
    onSave: (e: FormEvent) => void; // Actualizado aquí también
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
export const CardForm = ({ 
    editingCard, 
    formData, 
    error, 
    onClose, 
    onSave, 
    onChange 
}: Props) => {

    // Función auxiliar para la vista previa
    const isValidUrl = (url: string) => {
        try { new URL(url); return true; } catch (e) { return false; }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 relative flex flex-wrap lg:flex-nowrap space-x-0 lg:space-x-8"
                onClick={e => e.stopPropagation()} 
            >
                <button 
                    className="absolute top-4 right-4 p-2 rounded-full bg-[#FF7E00] text-white hover:bg-[#FF9800] transition-colors shadow-lg z-10" 
                    onClick={onClose} 
                    title="Cerrar"
                >
                    <CloseIcon />
                </button>

                <form onSubmit={onSave} className="flex-1 space-y-4 w-full lg:w-1/2">
                    <h3 className="text-2xl font-bold text-[#3E2723] mb-4 border-b-2 border-[#FFB300] pb-2">
                        {editingCard ? `Editar Carta #${editingCard.numero}` : 'Agregar Nueva Carta'}
                    </h3>

                    {['nombre', 'tipo', 'ataque', 'defensa', 'vida', 'imagen'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label htmlFor={field} className="font-semibold capitalize text-[#FF7E00]">
                                {field === 'imagen' ? 'URL Imagen (Obligatorio URL)' : field}
                            </label>
                            <input
                                type={['ataque', 'defensa', 'vida'].includes(field) ? 'number' : 'text'}
                                name={field}
                                id={field}
                                value={formData[field as keyof FormFields] ?? ''} 
                                onChange={onChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#FF7E00] focus:border-[#FF7E00] transition-shadow duration-200 text-gray-800"
                                required
                            />
                        </div>
                    ))}
                    
                    <div className="flex flex-col">
                        <label htmlFor="descripcion" className="font-semibold text-[#FF7E00]">Descripción</label>
                        <textarea
                            name="descripcion"
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={onChange}
                            rows={3}
                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#FF7E00] focus:border-[#FF7E00] transition-shadow duration-200 text-gray-800"
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md mt-4 shadow-md text-sm font-medium">
                            <strong>Atención:</strong> {error}
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full bg-[#FFB300] hover:bg-[#FF9800] text-black font-bold py-3 rounded-lg text-lg transition duration-150 ease-in-out shadow-lg mt-6"
                    >
                        {editingCard ? 'Guardar Cambios' : 'Agregar Carta'}
                    </button>
                </form>

                {/* Vista Previa */}
                <div className="mt-8 lg:mt-0 w-full lg:w-1/2 flex justify-center items-start">
                    <div className="bg-[#FFF8E1] p-6 rounded-xl shadow-xl w-72 border-4 border-[#FF7E00]">
                        <h4 className="text-xl font-black text-[#3E2723] mb-3 border-b-2 border-[#FFB300] pb-2">Vista Previa</h4>
                        <img
                            src={formData.imagen && isValidUrl(formData.imagen) ? formData.imagen : 'https://via.placeholder.com/300?text=Previsualizar+Imagen'}
                            alt="Previsualización"
                            className="w-full h-40 object-cover rounded-lg border-2 border-[#FFB300] my-3 shadow-md"
                        />
                        <p className="font-black text-xl text-[#3E2723]">{formData.nombre || 'Nombre'}</p>
                        <p className="text-xs italic mt-2 text-gray-700 max-h-16 overflow-hidden">
                            Descripción: {formData.descripcion || 'Descripción corta...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};