import './../App.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import type { CartaProps } from '../tipos/tiposCarta';
import FormularioCrearCarta from './FormularioCrearCarta';
import FormularioEditarCarta from './FormularioEditarCarta';
import MazoDeCartas from './MazoDeCartas';
import ModalCartaDetalle from './ModalCartaDetalle';
import ConfirmacionBorrado from './ConfirmacionBorrado';
import DiseñoCartaIA from './DiseñoCartaIA';

// 
import { PantallaBatalla } from './PantallaBatalla';

const personajesIniciales: CartaProps[] = [
  {
    id: 1, idCard: 1, attack: 270, name: "Shōyō Hinata", defense: 100, lifepoint: 100,
    description: "Atacante central de Karasuno. Conocido por su agilidad y saltos sobrehumanos.",
    pictureUrl: "https://i.redd.it/p9ovxh9mtcw51.jpg", posicion: "Atacante", numero: 10
  },
  {
    id: 2, idCard: 2, attack: 60, name: "Yū Nishinoya", defense: 450, lifepoint: 100,
    description: "Libero de Karasuno. El guardián del equipo con reflejos increíbles.",
    pictureUrl: "https://i.pinimg.com/originals/57/50/f8/5750f89c92db4b576a4b73be419d17bf.jpg", posicion: "Libero", numero: 4
  },
  {
    id: 3, idCard: 3, attack: 280, name: "Tobio Kageyama", defense: 380, lifepoint: 100,
    description: "Armador genio de Karasuno. Destaca por su precisión técnica inigualable.",
    pictureUrl: "https://i.pinimg.com/736x/a2/d8/10/a2d810489524f93d25da8f6e45a50b5f.jpg", posicion: "Armador", numero: 9
  }
];

interface AppProps {
  vista: 'inicio' | 'crear' | 'detalle' | 'editar' | 'desafio' | 'disenar-ia'; 
  cartas: CartaProps[];
  setCartas: Function
}

function Appv2({vista, cartas, setCartas} : AppProps) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CartaProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idParaBorrar, setIdParaBorrar] = useState<number | null>(null);


  const [seleccionadas, setSeleccionadas] = useState<CartaProps[]>([]);

  const [partidoIniciado, setPartidoIniciado] = useState(false);

  const handleToggleSeleccion = (carta: CartaProps) => {
    const existe = seleccionadas.some((c) => c.id === carta.id);
    if (existe) {
      setSeleccionadas(seleccionadas.filter((c) => c.id !== carta.id));
    } else {
    
      if (seleccionadas.length >= 2) {
        alert("¡Tu dúo titular ya está completo! Deselecciona uno si quieres cambiar la estrategia del desafío.");
        return;
      }
      setSeleccionadas([...seleccionadas, carta]);
    }
  };

  useEffect(() => {
    const guardadas = localStorage.getItem('cartas_haikyuu');
    if (guardadas) {
      const lista = JSON.parse(guardadas);
      setCartas(lista);
      if (id) {
        const encontrada = lista.find((c: CartaProps) => c.id === Number(id));
        if (encontrada) {
          setSelectedCard(encontrada);
          if (vista === 'detalle') setIsModalOpen(true);
        }
      }
    } else {
      setCartas(personajesIniciales);
    }
  }, [id, vista]);

  useEffect(() => {
    localStorage.setItem('cartas_haikyuu', JSON.stringify(cartas));
  }, [cartas]);

  if (vista === 'desafio' && partidoIniciado && seleccionadas.length === 2) {
    return <PantallaBatalla cartas={seleccionadas} />;
  }

  return (
    <div className="min-h-screen bg-[#A1887F] text-white font-sans">
      <nav className="bg-gray-900 border-b-4 border-[#FF7E00] p-4 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" onClick={() => setPartidoIniciado(false)} className="text-2xl font-black text-[#FF7E00] italic uppercase tracking-tighter drop-shadow-md">
            El Vuelo de Haikyuu: <span className="text-white">Cartas de la Cancha</span>
          </Link>
          <div className="flex gap-6 font-bold uppercase text-xs sm:text-sm tracking-wider">
            <Link to="/" onClick={() => setPartidoIniciado(false)} className={vista === 'inicio' ? 'text-[#FF7E00]' : 'text-gray-400 hover:text-white transition-colors'}>Cancha</Link>
            <Link to="/forja" onClick={() => setPartidoIniciado(false)} className={vista === 'crear' ? 'text-[#FF7E00]' : 'text-gray-400 hover:text-white transition-colors'}>Entrenamiento</Link>
            <Link to="/disenar-ia" onClick={() => setPartidoIniciado(false)} className={vista === 'disenar-ia' ? 'text-[#FF7E00]' : 'text-gray-400 hover:text-white transition-colors'}>Diseño IA</Link>
            <Link to="/desafio" className={vista === 'desafio' ? 'text-[#FF7E00]' : 'text-gray-400 hover:text-white transition-colors'}>Desafío</Link>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        { }
        {vista === 'crear' && <FormularioCrearCarta onNuevaCarta={(n) => { setCartas([n, ...cartas]); navigate('/'); }} />}
        {vista === 'editar' && selectedCard && (
          <FormularioEditarCarta cartaActual={selectedCard} onCancelar={() => navigate('/')} onGuardar={(e) => {
            setCartas(cartas.map(c => c.id === e.id ? e : c));
            navigate('/');
          }} />
        )}
        
        { }
        {vista === 'disenar-ia' && (
          <DiseñoCartaIA onCartaCreada={(nuevaCarta) => {
            setCartas([nuevaCarta, ...cartas]);
          }} />
        )}

        { }
        {(vista === 'inicio' || vista === 'detalle') && (
          <MazoDeCartas 
            cartas={cartas} 
            onCardClick={(c) => navigate(`/carta/${c.id}`)} 
            onDelete={(id) => { setIdParaBorrar(id); setMostrarConfirmacion(true); }} 
            onEdit={(c) => navigate(`/editar/${c.id}`)} 
            seleccionadas={seleccionadas}           
            onToggleSeleccion={handleToggleSeleccion} 
          />
        )}

        { }
        {vista === 'desafio' && !partidoIniciado && (
          <div className="p-8 bg-gray-900 border-2 border-orange-500 rounded-2xl shadow-2xl text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-orange-500 uppercase italic mb-4">Modo Desafío: Preparar Escuadra</h2>
            <p className="text-gray-300 mb-6">
              Para entrar a la duela gris necesitas seleccionar exactamente <span className="font-bold text-orange-500">2 jugadores</span> desde tu colección principal.
            </p>
            
            <div className="bg-black/30 p-4 rounded-xl border border-gray-800 mb-6 inline-block">
              <span className="text-sm text-gray-400 uppercase tracking-widest block mb-1">Alineación Actual</span>
              <span className="text-2xl font-black text-white">{seleccionadas.length} <span className="text-gray-600">/</span> 2</span>
            </div>

            {seleccionadas.length !== 2 ? (
              <div className="p-6 bg-orange-950/20 border border-orange-800/40 rounded-xl mb-6">
                <p className="text-sm text-orange-300 font-semibold mb-4">⚠️ No tienes los jugadores reglamentarios para abrir el partido.</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Go a la Cancha a Seleccionar
                </button>
              </div>
            ) : (
              <div className="mb-8">
                <button 
                  onClick={() => setPartidoIniciado(true)} 
                  className="w-full sm:w-auto px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-black text-base uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:scale-105 border-b-4 border-green-800"
                >
                  🔥 ¡Iniciar Saque Inicial!
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {seleccionadas.map(jugador => (
                <div key={jugador.id} className="p-4 bg-neutral-800 rounded-xl border border-gray-700 flex flex-col items-center relative shadow">
                  <button 
                    onClick={() => handleToggleSeleccion(jugador)}
                    className="absolute top-2 right-2 text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-2 py-0.5 rounded font-bold transition-all"
                  >
                    Quitar
                  </button>
                  <img src={jugador.pictureUrl} alt={jugador.name} className="h-20 w-20 object-cover rounded-full border-2 border-orange-500 mb-2 shadow"/>
                  <span className="font-black text-sm text-orange-400">{jugador.name}</span>
                  <span className="text-[11px] bg-neutral-900 px-2 py-0.5 rounded text-gray-400 font-mono mt-1">ATK: {jugador.attack} | DEF: {jugador.defense}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedCard && vista === 'detalle' && <ModalCartaDetalle carta={selectedCard} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); navigate('/'); }} />}
      <ConfirmacionBorrado abierto={mostrarConfirmacion} onConfirmar={() => { setCartas(cartas.filter(c => c.id !== idParaBorrar)); setMostrarConfirmacion(false); }} onCancelar={() => setMostrarConfirmacion(false)} />
    </div>
  );
}

export default Appv2;