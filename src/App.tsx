import React, {useState} from "react";
import CardDetail from "./components/card";
import "./App.css";
type Card = {
    numero: number;
    nombre: string;
    tipo: string;
    ataque: number;
    defensa: number;
    descripcion: string;
    imagen: string;
    vida: number;
};

type FormFields = Partial<Card> & { descripcion: string; tipo: string };

const CloseIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function App() {
    const initialCards: Card[] = [
        {
            ataque: 270,
            nombre: "Shōyō Hinata",
            defensa: 100,
            descripcion: "Atacante central (middle blocker) de Karasuno, a pesar de su corta estatura. Es el protagonista de la serie y es conocido por su increíble agilidad, saltos sobrehumanos y su determinación inquebrantable.", // DESCRIPCIÓN COMPLETA
            imagen: "https://i.redd.it/p9ovxh9mtcw51.jpg",
            numero: 1,
            tipo: "Atacante y Salto",
            vida: 100,
        },
        {
            ataque: 60,
            nombre: "Yū Nishinoya",
            defensa: 450,
            descripcion: "Libero del equipo de voleibol de Karasuno. Es famoso por sus increíbles reflejos, su velocidad y su habilidad para salvar cualquier balón (guardián de Karasuno). Es una persona muy energética y ruidosa.", // DESCRIPCIÓN COMPLETA
            imagen: "https://i.pinimg.com/originals/57/50/f8/5750f89c92db4b576a4b73be419d17bf.jpg",
            numero: 2,
            tipo: "Defensor y Rapidez",
            vida: 100,
        },
        {
            ataque: 280,
            nombre: "Tobio Kageyama",
            defensa: 380,
            descripcion: "Armador/colocador genio de Karasuno. Inicialmente conocido como el Rey de la Cancha por su actitud autoritaria, destaca por su precisión técnica inigualable y su fuerte potencial atlético. Forma un dúo increíble con Hinata, creando ataques rápidos y revolucionarios.", // DESCRIPCIÓN COMPLETA
            imagen: "https://i.pinimg.com/736x/a2/d8/10/a2d810489524f93d25da8f6e45a50b5f.jpg",
            numero: 3,
            tipo: "Armador Y Sacador",
            vida: 100,
        },
    ];

    const [cards, setCards] = useState<Card[]>(initialCards);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormFields>({ nombre: '', ataque: undefined, defensa: undefined, vida: undefined, descripcion: '', imagen: '', tipo: '', numero: undefined, });
    const [error, setError] = useState('');
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const toggleFormModal = (open: boolean, cardToEdit: Card | null = null) => {
        setIsModalOpen(open);
        setError('');
        
        if (open) {
            setEditingCard(cardToEdit);
            if (cardToEdit) {
                setFormData(cardToEdit as FormFields);
            } else {
                setFormData({ nombre: '', ataque: undefined, defensa: undefined, vida: undefined, descripcion: '', imagen: '', tipo: '', numero: undefined });
            }
        } else {
            setEditingCard(null);
        }
    };
    
    const getNextCardNumber = () => cards.length > 0 ? Math.max(...cards.map(c => c.numero)) + 1 : 1;

    const isValidUrl = (url: string) => {
        try { new URL(url); return true; } catch (e) { return false; }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: ['ataque', 'defensa', 'vida'].includes(name) ? parseInt(value) || (value === '' ? '' : prev[name as keyof FormFields]) : value,
        } as FormFields));
        setError('');
    };
    
    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();

        const { nombre, ataque, defensa, vida, descripcion, imagen, tipo } = formData;
        
        if (!nombre || ataque === undefined || defensa === undefined || vida === undefined || !descripcion || !imagen || !tipo) {
            setError("Por favor, rellene todos los campos.");
            return;
        }

        if (!isValidUrl(imagen)) {
            setError("El campo 'URL Imagen' debe ser un URL válido.");
            return;
        }

        const newCard: Card = {
            nombre, tipo, descripcion, imagen,
            ataque: Number(ataque), defensa: Number(defensa), vida: Number(vida),
            numero: editingCard ? editingCard.numero : getNextCardNumber(), 
        };

        setCards(prevCards => editingCard 
            ? prevCards.map(card => card.numero === newCard.numero ? newCard : card) 
            : [...prevCards, newCard]
        );

        toggleFormModal(false);
    };

    const handleCardAction = {
        onCardClick: setSelectedCard,
        onEditClick: (card: Card) => { toggleFormModal(true, card); setSelectedCard(null); },
        onDeleteClick: (numero: number) => {
            setCards(prevCards => prevCards.filter(card => card.numero !== numero));
            if (selectedCard && selectedCard.numero === numero) setSelectedCard(null);
        },
    };
    
    const CardForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => toggleFormModal(false)}>
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 relative flex flex-wrap lg:flex-nowrap space-x-0 lg:space-x-8"
                onClick={e => e.stopPropagation()} 
            >
                <button className="absolute top-4 right-4 p-2 rounded-full bg-[#FF7E00] text-white hover:bg-[#FF9800] transition-colors shadow-lg z-10" onClick={() => toggleFormModal(false)} title="Cerrar">
                    <CloseIcon />
                </button>

                <form onSubmit={handleSaveCard} className="flex-1 space-y-4 w-full lg:w-1/2">
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
                                onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-[#FF7E00] focus:border-[#FF7E00] transition-shadow duration-200 text-gray-800"
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md mt-4 shadow-md text-sm font-medium">
                            **Por favor rellene los campos**: {error}
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
    
    const CardDetailModal = () => (

        <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-40 p-4" onClick={() => setSelectedCard(null)}>
                {selectedCard && (
                    <CardDetail
                        {...selectedCard}
                        {...handleCardAction}
                        isFlipped={true}
                        isModalView={true} 
                    />
                )}
        </div>
    );


    return (
        <div className="min-h-screen bg-[#A1887F] flex flex-col items-center p-8">
            {}
            <header className="w-full max-w-5xl mb-12 text-center bg-[#3E2723] p-4 rounded-b-xl shadow-lg">
                <h1 className="text-4xl font-extrabold text-[#FFB300] tracking-wider font-serif">
                    ¡El Vuelo de Haikyuu: Cartas de la Cancha!
                </h1>
                <hr className="w-4/5 mx-auto mt-3 border-t-2 border-[#FFB300] opacity-70" />
            </header>

            {}
            <div className="flex flex-wrap justify-end max-w-5xl w-full flex-row-reverse">
                {cards.map((card) => (
                    <CardDetail
                        key={card.numero}
                        {...card}
                        {...handleCardAction}
                        isFlipped={false} 
                        isModalView={false} 
                    />
                ))}
            </div>
            
            {}
            <div className="w-full mt-10 flex justify-center">
                <button
                    onClick={() => toggleFormModal(true)}
                    className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-full text-lg transition duration-200 ease-in-out shadow-2xl border-2 border-[#FF7E00]"
                >
                    Agregar Nueva Carta
                </button>
            </div>
            
            {}
            {isModalOpen && <CardForm />}
            {selectedCard && <CardDetailModal />}

        </div>
    );
}
export default App;
