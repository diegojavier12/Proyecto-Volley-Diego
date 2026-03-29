import './../App.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import type { CartaProps } from '../tipos/tiposCarta';
import FormularioCrearCarta from './FormularioCrearCarta';
import FormularioEditarCarta from './FormularioEditarCarta';
import MazoDeCartas from './MazoDeCartas';
import ModalCartaDetalle from './ModalCartaDetalle';
import ConfirmacionBorrado from './ConfirmacionBorrado';

const personajesIniciales: CartaProps[] = [
  {
    id: 1, idCard: 1, attack: 270, name: "Shōyō Hinata", defense: 100, lifepoint: 100,
    description: "Atacante central de Karasuno. Conocido por su agilidad y saltos sobrehumanos.",
    pinctureUrl: "https://i.redd.it/p9ovxh9mtcw51.jpg", posicion: "Atacante", numero: 10
  },
  {
    id: 2, idCard: 2, attack: 60, name: "Yū Nishinoya", defense: 450, lifepoint: 100,
    description: "Libero de Karasuno. El guardián del equipo con reflejos increíbles.",
    pinctureUrl: "https://i.pinimg.com/originals/57/50/f8/5750f89c92db4b576a4b73be419d17bf.jpg", posicion: "Libero", numero: 4
  },
  {
    id: 3, idCard: 3, attack: 280, name: "Tobio Kageyama", defense: 380, lifepoint: 100,
    description: "Armador genio de Karasuno. Destaca por su precisión técnica inigualable.",
    pinctureUrl: "https://i.pinimg.com/736x/a2/d8/10/a2d810489524f93d25da8f6e45a50b5f.jpg", posicion: "Armador", numero: 9
  }
];

interface AppProps {
  vista: 'inicio' | 'crear' | 'detalle' | 'editar';
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

  return (
    <div className="min-h-screen bg-[#A1887F] text-white font-sans">
      <nav className="bg-gray-900 border-b-4 border-[#FF7E00] p-4 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-[#FF7E00] italic uppercase tracking-tighter drop-shadow-md">
            El Vuelo de Haikyuu: <span className="text-white">Cartas de la Cancha</span>
          </Link>
          <div className="flex gap-6">
            <Link to="/" className={`font-bold uppercase ${vista === 'inicio' ? 'text-[#FF7E00]' : 'text-gray-400'}`}>Cancha</Link>
            <Link to="/forja" className={`font-bold uppercase ${vista === 'crear' ? 'text-[#FF7E00]' : 'text-gray-400'}`}>Entrenamiento</Link>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {vista === 'crear' && <FormularioCrearCarta onNuevaCarta={(n) => { setCartas([n, ...cartas]); navigate('/'); }} />}
        {vista === 'editar' && selectedCard && (
          <FormularioEditarCarta cartaActual={selectedCard} onCancelar={() => navigate('/')} onGuardar={(e) => {
            setCartas(cartas.map(c => c.id === e.id ? e : c));
            navigate('/');
          }} />
        )}
        {(vista === 'inicio' || vista === 'detalle') && (
          <MazoDeCartas cartas={cartas} onCardClick={(c) => navigate(`/carta/${c.id}`)} onDelete={(id) => { setIdParaBorrar(id); setMostrarConfirmacion(true); }} onEdit={(c) => navigate(`/editar/${c.id}`)} />
        )}
      </main>

      {selectedCard && vista === 'detalle' && <ModalCartaDetalle carta={selectedCard} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); navigate('/'); }} />}
      <ConfirmacionBorrado abierto={mostrarConfirmacion} onConfirmar={() => { setCartas(cartas.filter(c => c.id !== idParaBorrar)); setMostrarConfirmacion(false); }} onCancelar={() => setMostrarConfirmacion(false)} />
    </div>
  );
}
export default Appv2;