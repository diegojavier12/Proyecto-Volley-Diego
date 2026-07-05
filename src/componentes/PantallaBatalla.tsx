import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación corregida apuntando exactamente a tu carpeta /src/tipos/tiposCarta.tsx
import type { CartaProps } from '../tipos/tiposCarta';

interface BatallaProps {
  cartas: CartaProps[];
}

interface LogTurno {
  id: number;
  mensaje: string;
  tipo: 'ataque' | 'defensa' | 'sistema' | 'agua';
}

export const PantallaBatalla: React.FC<BatallaProps> = ({ cartas }) => {
  const navigate = useNavigate();

  // --- ESTADOS DE JUGADORES (EQUIPO PROPIO Y ENEMIGO) ---
  const [j1_Arriba, setJ1Arriba] = useState<CartaProps | null>(null);
  const [j1_Abajo, setJ1Abajo] = useState<CartaProps | null>(null);
  const [j2_Arriba, setJ2Arriba] = useState<CartaProps | null>(null);
  const [j2_Abajo, setJ2Abajo] = useState<CartaProps | null>(null);

  // --- ESTADOS DINÁMICOS DE COMBATE (VIDA, DEFENSA, FUERZA ACTUAL) ---
  const [stats, setStats] = useState({
    j1A_lp: 100, j1A_def: 100, j1A_atk: 100,
    j1B_lp: 100, j1B_def: 100, j1B_atk: 100,
    j2A_lp: 100, j2A_def: 100, j2A_atk: 100,
    j2B_lp: 100, j2B_def: 100, j2B_atk: 100,
  });

  // --- CONTROL DE PARTIDO ---
  const [cargando, setCargando] = useState(true);
  const [esTurnoJugador, setEsTurnoJugador] = useState(true);
  const [jugadorAtacanteSeleccionado, setJugadorAtacanteSeleccionado] = useState<'A' | 'B'>('A');
  const [ganador, setGanador] = useState<string | null>(null);
  const [historialLogs, setHistorialLogs] = useState<LogTurno[]>([]);
  
  // --- MODAL TIME OUT Y AGUA ---
  const [mostrarTimeOut, setMostrarTimeOut] = useState(false);
  const [aguaUsadaJugador, setAguaUsadaJugador] = useState(false);

  // --- ASIGNACIÓN DE JUGADORES E IA ---
  useEffect(() => {
    if (cartas.length === 2) {
      const userCard1 = cartas[0];
      const userCard2 = cartas[1];

      // Simulamos rivales estáticos o reutilizados para el desafío rápido basándonos en la alineación elegida
      const rival1 = userCard2;
      const rival2 = userCard1;

      setJ1Arriba(userCard1 || null);
      setJ1Abajo(userCard2 || null);
      setJ2Arriba(rival1 || null);
      setJ2Abajo(rival2 || null);

      setStats({
        j1A_lp: userCard1?.lifepoint || 100, j1A_def: userCard1?.defense || 100, j1A_atk: userCard1?.attack || 100,
        j1B_lp: userCard2?.lifepoint || 100, j1B_def: userCard2?.defense || 100, j1B_atk: userCard2?.attack || 100,
        j2A_lp: rival1?.lifepoint || 100, j2A_def: rival1?.defense || 100, j2A_atk: rival1?.attack || 100,
        j2B_lp: rival2?.lifepoint || 100, j2B_def: rival2?.defense || 100, j2B_atk: rival2?.attack || 100,
      });

      setHistorialLogs([{
        id: Date.now(),
        mensaje: "¡Silbatazo inicial! Las escuadras entran a la cancha gris de juego.",
        tipo: 'sistema'
      }]);
      setCargando(false);
    }
  }, [cartas]);

  // --- DETECTAR FIN DEL JUEGO ---
  useEffect(() => {
    if (!cargando) {
      const equipoJugadorMuerto = stats.j1A_lp <= 0 && stats.j1B_lp <= 0;
      const equipoRivalMuerto = stats.j2A_lp <= 0 && stats.j2B_lp <= 0;

      if (equipoJugadorMuerto && equipoRivalMuerto) {
        setGanador("¡Colisión destructiva! Empate técnico en la red.");
      } else if (equipoJugadorMuerto) {
        setGanador("¡Derrota! El equipo enemigo dominó el torneo.");
      } else if (equipoRivalMuerto) {
        setGanador("¡Victoria Absoluta! Tu duo dinámico se lleva el partido.");
      }
    }
  }, [stats, cargando]);

  // --- MECÁNICA: CÁLCULO DE PORCENTAJES EN RANGOS DE FUERZA/DEFENSA ---
  const obtenerModificadorAtaque = (atkBase: number) => {
    if (atkBase <= 130) return 1.10; // +10%
    if (atkBase >= 141 && atkBase <= 170) return 1.20; // +20%
    return 1.30; // 171 a más (+30%)
  };

  const obtenerModificadorDefensa = (defBase: number) => {
    if (defBase <= 130) return 1.10; // +10%
    if (defBase >= 141 && defBase <= 170) return 1.20; // +20%
    return 1.30; // 171 a más (+30%)
  };

  // --- ACCIÓN: REHIDRATACIÓN CON AGUA ---
  const darAguaEquipo = () => {
    if (aguaUsadaJugador || ganador) return;
    
    setStats(prev => ({
      ...prev,
      j1A_def: prev.j1A_lp > 0 && prev.j1A_def < 80 ? 80 : prev.j1A_def,
      j1B_def: prev.j1B_lp > 0 && prev.j1B_def < 80 ? 80 : prev.j1B_def,
    }));

    setAguaUsadaJugador(true);
    setHistorialLogs(prev => [
      { id: Date.now(), mensaje: "🥤 ¡Tiempo Técnico! Les das agua a tus jugadores. Su defensa crítica se recupera a 80.", tipo: 'agua' },
      ...prev
    ]);
  };

  // --- LÓGICA DE TURNOS (ATAQUE / SELECCIÓN DE OBJETIVO) ---
  const ejecutarRemate = (objetivo: 'A' | 'B') => {
    if (!esTurnoJugador || ganador) return;

    const atacanteKey = jugadorAtacanteSeleccionado === 'A' ? j1_Arriba : j1_Abajo;
    const atacanteAtkActual = jugadorAtacanteSeleccionado === 'A' ? stats.j1A_atk : stats.j1B_atk;
    const atacanteLpActual = jugadorAtacanteSeleccionado === 'A' ? stats.j1A_lp : stats.j1B_lp;
    
    const defensorKey = objetivo === 'A' ? j2_Arriba : j2_Abajo;
    let defLp = objetivo === 'A' ? stats.j2A_lp : stats.j2B_lp;
    let defShield = objetivo === 'A' ? stats.j2A_def : stats.j2B_def;
    const defBase = defensorKey?.defense || 100;

    if (!atacanteKey || atacanteLpActual <= 0 || !defensorKey || defLp <= 0) return;

    const factorAtk = obtenerModificadorAtaque(atacanteKey.attack);
    const factorDef = obtenerModificadorDefensa(defBase);
    
    let dañoRemate = Math.floor(atacanteAtkActual * factorAtk * (Math.random() * (1.2 - 0.9) + 0.9));

    let nuevoDefShield = defShield;
    let nuevoDefLp = defLp;
    let nuevoDefAtk = objetivo === 'A' ? stats.j2A_atk : stats.j2B_atk;
    let logMsg = "";

    if (defShield > 0) {
      const dañoMitigado = Math.floor(dañoRemate / factorDef);
      if (defShield >= dañoMitigado) {
        nuevoDefShield -= dañoMitigado;
        logMsg = `🏐 ¡${atacanteKey.name} clavó un remate! ${defensorKey.name} resistió con su bloqueo, perdiendo ${dañoMitigado} de defensa.`;
      } else {
        const excedente = dañoMitigado - defShield;
        nuevoDefShield = 0;
        nuevoDefLp = Math.max(0, defLp - excedente);
        logMsg = `💥 ¡Defensa corrompida! El remate de ${atacanteKey.name} rompió el bloqueo de ${defensorKey.name}, quitándole ${excedente} de vida.`;
      }
    } else {
      nuevoDefLp = Math.max(0, defLp - dañoRemate);
      logMsg = `🩸 ¡Impacto Directo! Sin defensa, ${defensorKey.name} recibe el pelotazo de ${atacanteKey.name} perdiendo ${dañoRemate} LP.`;
    }

    if (nuevoDefLp < defLp && defensorKey) {
      const ratioVida = nuevoDefLp / defensorKey.lifepoint;
      nuevoDefAtk = Math.floor(defensorKey.attack * ratioVida);
      logMsg += ` 📉 El cansancio físico agota a ${defensorKey.name}, su fuerza de ataque baja a ${nuevoDefAtk}.`;
    }

    setStats(prev => ({
      ...prev,
      ...(objetivo === 'A' 
        ? { j2A_lp: nuevoDefLp, j2A_def: nuevoDefShield, j2A_atk: nuevoDefAtk }
        : { j2B_lp: nuevoDefLp, j2B_def: nuevoDefShield, j2B_atk: nuevoDefAtk }
      )
    }));

    setHistorialLogs(prev => [{ id: Date.now(), mensaje: logMsg, tipo: 'ataque' }, ...prev]);
    setEsTurnoJugador(false);

    setTimeout(() => ejecucionTurnoIA(), 1800);
  };

  const ejecucionTurnoIA = () => {
    if (ganador) return;

    const iaAtacaDesde = (stats.j2A_lp > 0 && Math.random() > 0.5) || stats.j2B_lp <= 0 ? 'A' : 'B';
    const iaKey = iaAtacaDesde === 'A' ? j2_Arriba : j2_Abajo;
    const iaAtkActual = iaAtacaDesde === 'A' ? stats.j2A_atk : stats.j2B_atk;

    const objetivoJugador = (stats.j1A_lp > 0 && Math.random() > 0.5) || stats.j1B_lp <= 0 ? 'A' : 'B';
    const jKey = objetivoJugador === 'A' ? j1_Arriba : j1_Abajo;
    let jLp = objetivoJugador === 'A' ? stats.j1A_lp : stats.j1B_lp;
    let jDef = objetivoJugador === 'A' ? stats.j1A_def : stats.j1B_def;

    if (!iaKey || !jKey || jLp <= 0) {
      setEsTurnoJugador(true);
      return;
    }

    const factorAtk = obtenerModificadorAtaque(iaKey.attack);
    const factorDef = obtenerModificadorDefensa(jKey.defense);
    let dañoIA = Math.floor(iaAtkActual * factorAtk * (Math.random() * (1.2 - 0.9) + 0.9));

    let nuevoJLp = jLp;
    let nuevoJDef = jDef;
    let nuevoJAtk = objetivoJugador === 'A' ? stats.j1A_atk : stats.j1B_atk;
    let logMsg = "";

    if (jDef > 0) {
      const dañoMitigado = Math.floor(dañoIA / factorDef);
      if (jDef >= dañoMitigado) {
        nuevoJDef -= dañoMitigado;
        logMsg = `🛡️ ¡El enemigo ${iaKey.name} ataca! ${jKey.name} arma una recepción sólida perdiendo ${dañoMitigado} de defensa.`;
      } else {
        const excedente = dañoMitigado - jDef;
        nuevoJDef = 0;
        nuevoJLp = Math.max(0, jLp - excedente);
        logMsg = `⚠️ ¡Defensa vulnerada! El remate de ${iaKey.name} quiebra la recepción de ${jKey.name} causándole ${excedente} de daño real.`;
      }
    } else {
      nuevoJLp = Math.max(0, jLp - dañoIA);
      logMsg = `🚨 ¡Balonazo directo! El ataque de ${iaKey.name} impacta sobre la humanidad de ${jKey.name}, restando ${dañoIA} LP.`;
    }

    if (nuevoJLp < jLp) {
      const ratioVida = nuevoJLp / jKey.lifepoint;
      nuevoJAtk = Math.floor(jKey.attack * ratioVida);
      logMsg += ` 📉 El cansancio ralentiza a ${jKey.name}, su ataque decrece a ${nuevoJAtk}.`;
    }

    setStats(prev => ({
      ...prev,
      ...(objetivoJugador === 'A'
        ? { j1A_lp: nuevoJLp, j1A_def: nuevoJDef, j1A_atk: nuevoJAtk }
        : { j1B_lp: nuevoJLp, j1B_def: nuevoJDef, j1B_atk: nuevoJAtk }
      )
    }));

    setHistorialLogs(prev => [{ id: Date.now(), mensaje: logMsg, tipo: 'defensa' }, ...prev]);
    setEsTurnoJugador(true);
  };

  if (cargando) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white font-bold tracking-widest uppercase animate-pulse">Armando la Cancha de Voleibol...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4 flex flex-col items-center justify-between font-sans relative overflow-x-hidden">
      
      {/* HEADER CONTROLES */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-neutral-900/90 p-4 border-b-2 border-orange-500 rounded-xl shadow-lg z-10">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-orange-600 transition-all text-xs font-black uppercase rounded-lg border border-neutral-600"
        >
          ⬅️ Regresar
        </button>
        <h1 className="text-xl md:text-2xl font-black italic tracking-wider text-center uppercase">Campo de Batalla: <span className="text-orange-500">Desafío</span></h1>
        <button 
          onClick={() => setMostrarTimeOut(true)} 
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 transition-all text-xs font-black uppercase rounded-lg shadow-md"
        >
          ⏱️ Time Out
        </button>
      </div>

      {/* CANCHA DE TRABAJO */}
      <div className="w-full max-w-5xl bg-neutral-700 border-4 border-neutral-400 rounded-3xl my-4 p-4 md:p-8 shadow-2xl relative grid grid-cols-2 gap-4 items-center min-h-[500px]">
        <div className="absolute inset-0 border-[6px] border-white/20 pointer-events-none m-4 rounded-xl"></div>
        
        {/* RED CENTRAL */}
        <div className="absolute top-0 bottom-0 left-1/2 w-2 pointer-events-none z-20 shadow-xl" style={{ backgroundImage: 'linear-gradient(to bottom, #fff 50%, #000 50%)', backgroundSize: '10px 25px', transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-neutral-900 border-2 border-orange-500 text-[10px] font-black px-2 py-0.5 rounded uppercase shadow">RED</div>
        </div>

        {/* LADO IZQUIERDO: JUGADORES */}
        <div className="flex flex-col gap-6 justify-center items-center z-10">
          <div className="text-center font-black text-xs uppercase tracking-widest text-orange-400 bg-neutral-900/60 px-3 py-1 rounded-full">Tu Escuadra</div>
          
          {j1_Arriba && (
            <div 
              onClick={() => stats.j1A_lp > 0 && setJugadorAtacanteSeleccionado('A')}
              className={`w-40 p-3 bg-neutral-900 border-2 rounded-xl transition-all relative cursor-pointer shadow-md ${stats.j1A_lp <= 0 ? 'opacity-30 saturate-0 border-red-800' : jugadorAtacanteSeleccionado === 'A' ? 'border-orange-500 scale-105 shadow-orange-500/50' : 'border-neutral-600 hover:border-orange-400'}`}
            >
              <div className="text-center font-bold text-xs truncate text-orange-400">{j1_Arriba.name}</div>
              <div className="text-[10px] bg-orange-600/20 text-orange-300 rounded text-center my-1 uppercase font-semibold">{j1_Arriba.posicion}</div>
              <img src={j1_Arriba.pictureUrl} alt={j1_Arriba.name} className="w-full h-24 object-cover rounded-lg bg-neutral-800 border border-neutral-700 mb-2"/>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Vida:</span><span className="font-bold text-green-400">{stats.j1A_lp}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-green-500 h-full transition-all" style={{ width: `${(stats.j1A_lp / j1_Arriba.lifepoint) * 100}%` }}></div></div>
                <div className="flex justify-between"><span>Def:</span><span className="font-bold text-blue-400">{stats.j1A_def}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(100, (stats.j1A_def / j1_Arriba.defense) * 100)}%` }}></div></div>
                <div className="flex justify-between"><span>Atk actual:</span><span className="font-bold text-amber-500">{stats.j1A_atk}</span></div>
              </div>
            </div>
          )}

          {j1_Abajo && (
            <div 
              onClick={() => stats.j1B_lp > 0 && setJugadorAtacanteSeleccionado('B')}
              className={`w-40 p-3 bg-neutral-900 border-2 rounded-xl transition-all relative cursor-pointer shadow-md ${stats.j1B_lp <= 0 ? 'opacity-30 saturate-0 border-red-800' : jugadorAtacanteSeleccionado === 'B' ? 'border-orange-500 scale-105 shadow-orange-500/50' : 'border-neutral-600 hover:border-orange-400'}`}
            >
              <div className="text-center font-bold text-xs truncate text-orange-400">{j1_Abajo.name}</div>
              <div className="text-[10px] bg-orange-600/20 text-orange-300 rounded text-center my-1 uppercase font-semibold">{j1_Abajo.posicion}</div>
              <img src={j1_Abajo.pictureUrl} alt={j1_Abajo.name} className="w-full h-24 object-cover rounded-lg bg-neutral-800 border border-neutral-700 mb-2"/>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Vida:</span><span className="font-bold text-green-400">{stats.j1B_lp}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-green-500 h-full transition-all" style={{ width: `${(stats.j1B_lp / j1_Abajo.lifepoint) * 100}%` }}></div></div>
                <div className="flex justify-between"><span>Def:</span><span className="font-bold text-blue-400">{stats.j1B_def}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(100, (stats.j1B_def / j1_Abajo.defense) * 100)}%` }}></div></div>
                <div className="flex justify-between"><span>Atk actual:</span><span className="font-bold text-amber-500">{stats.j1B_atk}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* LADO DERECHO: RIVAL (IA) */}
        <div className="flex flex-col gap-6 justify-center items-center z-10">
          <div className="text-center font-black text-xs uppercase tracking-widest text-red-400 bg-neutral-900/60 px-3 py-1 rounded-full">Rival (IA)</div>
          
          {j2_Arriba && (
            <div 
              onClick={() => stats.j2A_lp > 0 && esTurnoJugador && ejecutarRemate('A')}
              className={`w-40 p-3 bg-neutral-900 border-2 rounded-xl transition-all relative shadow-md ${stats.j2A_lp <= 0 ? 'opacity-30 saturate-0 border-red-900' : esTurnoJugador ? 'border-red-600/50 hover:border-red-500 cursor-crosshair hover:scale-105' : 'border-neutral-700'}`}
            >
              {stats.j2A_lp > 0 && esTurnoJugador && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black p-1 rounded-full animate-bounce">🎯 TARGET</div>}
              <div className="text-center font-bold text-xs truncate text-red-400">{j2_Arriba.name}</div>
              <div className="text-[10px] bg-red-600/20 text-red-300 rounded text-center my-1 uppercase font-semibold">{j2_Arriba.posicion}</div>
              <img src={j2_Arriba.pictureUrl} alt={j2_Arriba.name} className="w-full h-24 object-cover rounded-lg bg-neutral-800 border border-neutral-700 mb-2"/>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Vida:</span><span className="font-bold text-red-400">{stats.j2A_lp}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-red-500 h-full transition-all" style={{ width: `${(stats.j2A_lp / j2_Arriba.lifepoint) * 100}%` }}></div></div>
                <div className="flex justify-between"><span>Def:</span><span className="font-bold text-blue-400">{stats.j2A_def}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-400 h-full transition-all" style={{ width: `${Math.min(100, (stats.j2A_def / j2_Arriba.defense) * 100)}%` }}></div></div>
              </div>
            </div>
          )}

          {j2_Abajo && (
            <div 
              onClick={() => stats.j2B_lp > 0 && esTurnoJugador && ejecutarRemate('B')}
              className={`w-40 p-3 bg-neutral-900 border-2 rounded-xl transition-all relative shadow-md ${stats.j2B_lp <= 0 ? 'opacity-30 saturate-0 border-red-900' : esTurnoJugador ? 'border-red-600/50 hover:border-red-500 cursor-crosshair hover:scale-105' : 'border-neutral-700'}`}
            >
              {stats.j2B_lp > 0 && esTurnoJugador && <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-black p-1 rounded-full animate-bounce">🎯 TARGET</div>}
              <div className="text-center font-bold text-xs truncate text-red-400">{j2_Abajo.name}</div>
              <div className="text-[10px] bg-red-600/20 text-red-300 rounded text-center my-1 uppercase font-semibold">{j2_Abajo.posicion}</div>
              <img src={j2_Abajo.pictureUrl} alt={j2_Abajo.name} className="w-full h-24 object-cover rounded-lg bg-neutral-800 border border-neutral-700 mb-2"/>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Vida:</span><span className="font-bold text-red-400">{stats.j2B_lp}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-red-500 h-full transition-all" style={{ width: `${(stats.j2B_lp / j2_Abajo.lifepoint) * 100}%` }}></div></div>
                <div className="flex justify-between"><span>Def:</span><span className="font-bold text-blue-400">{stats.j2B_def}</span></div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-400 h-full transition-all" style={{ width: `${Math.min(100, (stats.j2B_def / j2_Abajo.defense) * 100)}%` }}></div></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN PANEL DE ACCIONES E HISTORIAL */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="bg-neutral-900 p-4 border border-neutral-700 rounded-2xl flex flex-col justify-center gap-3 shadow-lg">
          <div className="text-center font-bold text-xs uppercase text-neutral-400 tracking-wider">Acciones de Partido</div>
          <button 
            onClick={darAguaEquipo}
            disabled={!!aguaUsadaJugador || !!ganador}
            className={`w-full py-3 font-black uppercase text-xs rounded-xl border tracking-wider transition-all ${aguaUsadaJugador ? 'bg-neutral-800 border-neutral-700 text-neutral-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-md'}`}
          >
            🥤 Rehidratar Equipo {aguaUsadaJugador ? '(Usado)' : '(Mínimo Def a 80)'}
          </button>
          <div className="p-2.5 bg-neutral-800 rounded-xl text-center border border-neutral-700">
            <span className="text-[11px] block uppercase font-bold text-neutral-400 mb-1">Estado:</span>
            {ganador ? (
              <span className="text-sm font-black text-orange-500 uppercase italic">{ganador}</span>
            ) : esTurnoJugador ? (
              <span className="text-sm font-black text-green-400 uppercase">🏐 Tu Turno: Selecciona un Objetivo</span>
            ) : (
              <span className="text-sm font-black text-red-400 uppercase animate-pulse">🛑 Turno Enemigo...</span>
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-neutral-900 border-2 border-neutral-800 p-4 rounded-2xl flex flex-col shadow-lg">
          <h3 className="text-xs uppercase font-black text-orange-400 tracking-wider mb-2 pb-1 border-b border-neutral-800">Historial del Campo de Batalla</h3>
          <div className="flex-1 max-h-30 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {historialLogs.map((log) => {
              let borderCol = "border-neutral-700 bg-neutral-800/50 text-neutral-300";
              if (log.tipo === 'ataque') borderCol = "border-green-600/50 bg-green-950/20 text-green-300";
              if (log.tipo === 'defensa') borderCol = "border-red-600/50 bg-red-950/20 text-red-300";
              if (log.tipo === 'agua') borderCol = "border-blue-600 bg-blue-950/30 text-blue-200 font-bold";
              return <div key={log.id} className={`p-2 rounded-lg border text-[11px] ${borderCol}`}>{log.mensaje}</div>;
            })}
          </div>
        </div>
      </div>

      {/* ANUNCIO LUMINOSO Y BRILLANTE DE FIN DEL JUEGO / VICTORIA */}
      {ganador && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#111622] border-4 border-orange-500 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_60px_rgba(249,115,22,0.45)] transform scale-100 transition-all border-double">
            
            {/* Destello de fondo brillante */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

            {/* Balón luminoso animado */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-t from-orange-600 to-amber-400 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-bounce">
                <span className="text-4xl">🏐</span>
              </div>
            </div>

            {/* Letrero estilo Arcade / Campeonato */}
            <div className="mb-4">
              <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 border-y-4 border-black inline-block px-8 py-3 rounded-2xl transform -rotate-1 shadow-[0_5px_0_#000] border-inline">
                {ganador.includes("Victoria") ? "VICTORY" : "MATCH OVER"}
              </h2>
            </div>

            <p className="text-gray-200 font-black text-sm uppercase tracking-wider my-6 px-2 drop-shadow-sm">
              {ganador}
            </p>

            <div className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-6 animate-pulse">
              ✨ ¡El balón nunca cayó de tu lado! ✨
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs border-b-4 border-green-800 active:border-b-0 transition-all shadow-lg shadow-emerald-950/50"
              >
                🔥 Volver a Jugar
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white font-black py-3 rounded-xl uppercase tracking-wider text-xs border border-neutral-700 transition-all"
              >
                Regresar al Mazo
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {mostrarTimeOut && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border-2 border-orange-500 p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-2xl font-black italic uppercase tracking-wider text-orange-500 mb-2">⏱️ TIME OUT</h2>
            <p className="text-neutral-400 text-xs mb-6">El entrenador detiene el partido. Diseña tu estrategia o decide retirarte.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setMostrarTimeOut(false)} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs rounded-xl">Continuar Partido</button>
              <button onClick={() => { setMostrarTimeOut(false); window.location.reload(); }} className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-black uppercase text-xs rounded-xl border border-neutral-700">Reiniciar Encuentro</button>
              <button onClick={() => navigate('/')} className="w-full py-3 bg-red-950 hover:bg-red-900 text-red-400 font-black uppercase text-xs rounded-xl border border-red-900">Rendirse y Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantallaBatalla;