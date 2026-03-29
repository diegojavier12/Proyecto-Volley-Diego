import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import type { CartaProps } from './tipos/tiposCarta';
import Appv2 from './componentes/Appv2';

function App() {
  const [cartas, setCartas] = useState<CartaProps[]>([]);
  
  const getCartas = async () => {
    let urlAPI = "https://educapi-v2.onrender.com/card";
    try {
      const respuesta = await fetch(urlAPI, {
        method: 'GET',
        headers: { usersecretpasskey: "Dieg804808RO" }
      });
      const objeto = await respuesta.json();
      // Si la API devuelve datos, podrías mapearlos aquí
      console.log("Datos de API:", objeto.data);
    } catch (error) {
      console.error("Error al conectar con la API", error);
    }
  };
  
  useEffect(() => {
    getCartas();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Appv2 vista="inicio" cartas={cartas} setCartas={setCartas} />} />
      <Route path="/forja" element={<Appv2 vista="crear" cartas={cartas} setCartas={setCartas}/>} />
      <Route path="/carta/:id" element={<Appv2 vista="detalle" cartas={cartas} setCartas={setCartas}/>} />
      <Route path="/editar/:id" element={<Appv2 vista="editar" cartas={cartas} setCartas={setCartas}/>} />
    </Routes>
  );
}

export default App;