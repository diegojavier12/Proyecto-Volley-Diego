
import React, { useState, useEffect } from 'react';
import type { CartaProps } from '../tipos/tiposCarta';

interface EditarProps {
  cartaActual: CartaProps;
  onGuardar: (cartaEditada: CartaProps) => void;
  onCancelar: () => void;
}

const FormularioEditarCarta: React.FC<EditarProps> = ({ cartaActual, onCancelar }) => {
  const [formData, setFormData] = useState<CartaProps>(cartaActual);

 
  useEffect(() => {
    setFormData(cartaActual);
  }, [cartaActual]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseInt(value) || 0) : value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
   const urlAPI = `https://educapi-v2.onrender.com/card/${formData.idCard}`; 

const respuesta = await fetch(urlAPI, {
  method: 'PATCH',
  headers: {
    "usersecretpasskey": "Dieg804808RO",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: formData.name,
    description: formData.description,
    attack: formData.attack,
    defense: formData.defense,
    lifePoints: formData.lifepoint,
    pictureUrl: formData.pinctureUrl,
    attributes: { raza: formData.posicion }
  })
});

console.log(respuesta);
  };

  const labelClass = "text-xs font-bold text-gray-500 uppercase mb-1 block";
  const inputClass = "w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition-all";

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 border-2 border-blue-900 rounded-2xl shadow-2xl mb-10 relative">
      <div className="absolute top-4 right-4 text-blue-500/20 text-6xl font-black italic select-none">EDIT</div>
      
      <h2 className="text-3xl font-black text-white mb-8 text-center uppercase italic tracking-tighter">
        Modificar <span className="text-blue-500">Guerrero</span>
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div>
          <label className={labelClass}>Nombre</label>
          <input name="name" value={formData.name} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Raza</label>
          <select name="posicion" value={formData.posicion} onChange={handleChange} className={inputClass}>
            <option value="Atacante">Atacante</option>
            <option value="Libero">Libero</option>
            <option value="Armador">Armador</option>
            <option value="Bloqueador">Bloqueador</option>
            <option value="Universal">Universal</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className={inputClass} />
        </div>

        <div className="md:col-span-2 grid grid-cols-3 gap-4 bg-black/30 p-4 rounded-xl">
          <input type="number" name="attack" value={formData.attack} onChange={handleChange} placeholder="ATK" className={inputClass} />
          <input type="number" name="defense" value={formData.defense} onChange={handleChange} placeholder="DEF" className={inputClass} />
          <input type="number" name="lifepoint" value={formData.lifepoint} onChange={handleChange} placeholder="VIT" className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>URL de la Imagen</label>
          <input name="pinctureUrl" value={formData.pinctureUrl} onChange={handleChange} className={inputClass} />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button type="button" onClick={onCancelar} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl uppercase hover:bg-gray-700 transition-all">
            Cancelar
          </button>
          <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl uppercase hover:bg-blue-700 shadow-lg shadow-blue-900/40 transition-all">
            Actualizar Datos
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEditarCarta;