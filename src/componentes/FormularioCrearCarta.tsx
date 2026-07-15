import React, { useState } from 'react';
import type { CartaProps } from '../tipos/tiposCarta';

const FormularioCrearCarta: React.FC<{ onNuevaCarta: (c: CartaProps) => void }> = ({ onNuevaCarta }) => {
  const [form, setForm] = useState({ name: '', description: '', attack: 0, defense: 0, lifepoint: 100, posicion: 'Atacante', pictureUrl: '' });
  
 
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!form.name.trim() || !form.description.trim() || !form.pictureUrl.trim() || form.attack <= 0 || form.defense <= 0) {
      setErrorMensaje("¡Error! Debes rellenar todos los campos y asignar valores de combate superiores a 0 antes de enviar al jugador a la cancha.");
      return; 
    }

    
    setErrorMensaje(null);

    const nueva = { ...form, id: Date.now(), idCard: Date.now() };
    onNuevaCarta(nueva as CartaProps);

    await fetch("https://educapi-v2.onrender.com/card", {
      method: 'POST',
      headers: { "usersecretpasskey": "Dieg804808RO", "Content-type": "application/json" },
      body: JSON.stringify({
        name: form.name, description: form.description, attack: form.attack,
        defense: form.defense, lifePoints: form.lifepoint, pictureUrl: form.pictureUrl,
        attributes: { posicion: form.posicion }
      })
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 border-2 border-[#FF7E00] rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-black text-white mb-8 text-center uppercase italic">Nuevo <span className="text-[#FF7E00]">Jugador</span></h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input placeholder="Nombre" onChange={e => setForm({...form, name: e.target.value})} className="p-2.5 bg-gray-800 text-white rounded-lg outline-none border border-gray-700 focus:border-[#FF7E00]" />
        
        <select onChange={e => setForm({...form, posicion: e.target.value})} className="p-2.5 bg-gray-800 text-white rounded-lg border border-gray-700">
          <option value="Atacante">Atacante</option>
          <option value="Armador">Armador</option>
          <option value="Libero">Libero</option>
          <option value="Bloqueador">Bloqueador</option>
        </select>
        
        <textarea placeholder="Habilidades..." onChange={e => setForm({...form, description: e.target.value})} className="md:col-span-2 p-2.5 bg-gray-800 text-white rounded-lg border border-gray-700" />
        
        <input type="number" placeholder="ATK" onChange={e => setForm({...form, attack: parseInt(e.target.value) || 0})} className="p-2.5 bg-gray-800 text-white rounded-lg border border-gray-700" />
        
        <input type="number" placeholder="DEF" onChange={e => setForm({...form, defense: parseInt(e.target.value) || 0})} className="p-2.5 bg-gray-800 text-white rounded-lg border border-gray-700" />
        
        <input placeholder="URL Imagen" onChange={e => setForm({...form, pictureUrl: e.target.value})} className="md:col-span-2 p-2.5 bg-gray-800 text-white rounded-lg border border-gray-700" />
        
        <button type="submit" className="md:col-span-2 py-4 bg-[#FF7E00] text-white font-black rounded-xl uppercase hover:bg-[#e67200] transition-all shadow-lg">
          Entrar a la Cancha
        </button>

        { }
        {errorMensaje && (
          <div className="md:col-span-2 mt-2 p-3 bg-red-950/80 border border-red-600 rounded-xl text-red-400 font-bold text-sm text-center animate-pulse shadow-md">
            {errorMensaje}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioCrearCarta;