import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartaProps } from '../tipos/tiposCarta';
import ComponenteCarta from './ComponenteCarta';

interface DiseñarCartaIAProps {
  onCartaCreada: (nuevaCarta: CartaProps) => void;
}

const DiseñarCartaIA: React.FC<DiseñarCartaIAProps> = ({ onCartaCreada }) => {
  const navigate = useNavigate();
  const [cardPrompt, setCardPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartaGenerada, setCartaGenerada] = useState<CartaProps | null>(null);

  // Contexto del proyecto adaptado 100% a las posiciones de tu archivo tiposCarta.tsx
  const globalContext = "Temática Anime Haikyuu, club de voleibol Karasuno u otros equipos rivales de la serie. Ataque entre 10 y 500, defensa entre 10 y 500. Posiciones estrictas en base a: Atacante, Armador, Libero, Bloqueador, Universal.";

  const manejarGeneracion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setCartaGenerada(null);

    try {
      const response = await fetch('https://educapi-v2.onrender.com/ai/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'usersecretpasskey': 'Dieg804808RO', // Tu llave secreta exacta
        },
        body: JSON.stringify({
          globalContext: globalContext,
          cardPrompt: cardPrompt
        })
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("La IA de Haikyuu no está disponible en este momento. ¡Inténtalo de nuevo!");
        }
        throw new Error("Error al invocar el espíritu de la cancha. Revisa tu conexión.");
      }

      const data = await response.json();

      // Normalizamos y validamos la posición que devuelva la IA para que coincida con tus tipos
      let posicionMapeada: 'Atacante' | 'Armador' | 'Libero' | 'Bloqueador' | 'Universal' = 'Atacante';
      const posAI = data.attributes?.element || '';
      if (['Atacante', 'Armador', 'Libero', 'Bloqueador', 'Universal'].includes(posAI)) {
        posicionMapeada = posAI as 'Atacante' | 'Armador' | 'Libero' | 'Bloqueador' | 'Universal';
      }

      // Mapeo preciso respetando rigurosamente tu interfaz de tiposCarta.tsx
      const nuevaCarta: CartaProps = {
        id: data.idCard || Date.now(),
        idCard: data.idCard,
        name: data.name || 'Jugador Misterioso',
        description: data.description || 'Sin descripción disponible.',
        attack: Number(data.attack) || 100,
        defense: Number(data.defense) || 100,
        lifepoint: data.lifePoints || 100, // Propiedad 'lifepoint' corregida
        pictureUrl: data.pictureUrl || 'https://via.placeholder.com/150',
        posicion: posicionMapeada,
        numero: Math.floor(Math.random() * 12) + 1 // Asigna un número de camiseta automático
      };

      setCartaGenerada(nuevaCarta);
      onCartaCreada(nuevaCarta);

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al conectar con el nexo de la IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6 flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.98), rgba(9, 9, 11, 0.98))' }}
    >
      <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 text-center">
        DISEÑAR CARTA <span className="text-orange-500 animate-pulse">CON IA</span>
      </h1>
      <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-10 text-center max-w-xl">
        Describe a tu jugador ideal y deja que la IA cree sus estadísticas y su ilustración de voleibol.
      </p>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full max-w-5xl">
        
        {/* Formulario Prompt */}
        <div className="w-full max-w-lg bg-[#161d26] border-2 border-neutral-800 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={manejarGeneracion} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-orange-500 mb-2">
                Atributos y Concepto del Jugador
              </label>
              <textarea
                value={cardPrompt}
                onChange={(e) => setCardPrompt(e.target.value)}
                placeholder="Ej. Un bloqueador central de Karasuno sumamente alto, con lentes de deporte, mirada calculadora y un aura gélida al detener el balón..."
                disabled={loading}
                rows={4}
                className="w-full bg-black/40 border border-neutral-700 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900 rounded-xl text-xs font-bold text-red-400 flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !cardPrompt.trim()}
              className={`w-full font-black py-4 px-6 rounded-xl uppercase text-xs tracking-widest transition-all ${
                loading || !cardPrompt.trim()
                  ? 'bg-neutral-800 text-gray-600 cursor-not-allowed border border-neutral-700'
                  : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 border border-orange-500'
              }`}
            >
              {loading ? 'Generando Jugador...' : '☄️ Invocar Jugador'}
            </button>
          </form>
        </div>

        {/* Panel de visualización de la carta generada */}
        <div className="w-full max-w-sm min-h-[400px] flex flex-col items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider animate-pulse">
                Reconfigurando Ilustración y Atributos...
              </p>
            </div>
          )}

          {!loading && !cartaGenerada && (
            <div className="border-2 border-dashed border-neutral-800 rounded-2xl p-8 text-center text-gray-600 max-w-xs">
              <p className="text-xs font-bold uppercase tracking-wider">
                Tu jugador estrella aparecerá en esta zone tras la invocación exitosa.
              </p>
            </div>
          )}

          {!loading && cartaGenerada && (
            <div className="flex flex-col items-center animate-fade-in">
              <p className="text-[10px] bg-green-950/60 border border-green-800 text-green-400 font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                ¡Invocación Exitosa!
              </p>
              
              {/* Esparcimos las propiedades individuales de la carta para que encajen con ComponenteCarta */}
              <ComponenteCarta
                estaSeleccionada={false}
                {...cartaGenerada}
                onToggleSeleccion={() => {}}
                onCardClick={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <button
          onClick={() => navigate('/')}
          disabled={loading}
          className="bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white font-black py-3 px-8 rounded-xl text-xs uppercase tracking-widest border border-neutral-800 transition-colors"
        >
          Volver a la Cancha
        </button>
      </div>
    </div>
  );
};

export default DiseñarCartaIA;