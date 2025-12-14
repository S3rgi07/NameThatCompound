// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, getRandomCompound, normalizeText } from './data/compounds';
import './App.css';

// --- VERSIÓN ACTUAL ---
const CURRENT_VERSION = '1.2';
const CHANGELOG = [
  "✨ ¡Bienvenido a la versión 1.2!",
  "🧪 Base de datos expandida: Sales Ácidas y de Amonio.",
  "👑 Nuevos logros de Realeza.",
  "☁️ Sistema de guardado en la nube (Cross-Saving).",
  "🐇 Mejoras visuales en el menú y la mascota."
];

// --- AUDIO ---
const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  
  if (type === 'correct') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.2);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'unlock') {
    osc.type = 'square'; osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now); osc.stop(now + 0.5);
  }
};

// --- LOGROS BASE ---
const BASE_ACHIEVEMENTS = [
  { id: 's1', icon: '🌱', title: 'Novato', desc: '10 puntos en una partida.' },
  { id: 's3', icon: '🌳', title: 'Estudioso', desc: '100 puntos en una partida.' },
  { id: 's5', icon: '🍎', title: 'Experto', desc: '500 puntos en una partida.' },
  { id: 's8', icon: '🥇', title: 'Oro', desc: '5,000 puntos en una partida.' },
  { id: 's10', icon: '👑', title: 'Leyenda', desc: '20,000 puntos en una partida.' },
  { id: 'k1', icon: '🕯️', title: 'Chispa', desc: 'Racha de 5 seguidas.' },
  { id: 'k2', icon: '🔥', title: 'Fuego', desc: 'Racha de 10 seguidas.' },
  { id: 'k5', icon: '🚀', title: 'Cohete', desc: 'Racha de 30 seguidas.' },
  { id: 'k9', icon: '🌌', title: 'Galaxia', desc: 'Racha de 100 seguidas.' },
];

// --- GENERADOR DE LOGROS DE REALEZA ---
const generateRoyaltyAchievements = () => {
  const royalty = [];
  Object.keys(CATEGORIES).forEach(cat => {
    // Nivel 1: Escudero (10 aciertos)
    royalty.push({ 
      id: `r_${cat}_1`, icon: '🛡️', catKey: cat, threshold: 10,
      title: `Escudero de ${CATEGORIES[cat].split(' ')[0]}`, // Ej: Escudero de Óxidos
      desc: `Acierta 10 compuestos de ${CATEGORIES[cat]}.`
    });
    // Nivel 2: Caballero (50 aciertos)
    royalty.push({ 
      id: `r_${cat}_2`, icon: '⚔️', catKey: cat, threshold: 50,
      title: `Caballero de ${CATEGORIES[cat].split(' ')[0]}`,
      desc: `Acierta 50 compuestos de ${CATEGORIES[cat]}.`
    });
    // Nivel 3: Rey/Reina (100 aciertos)
    royalty.push({ 
      id: `r_${cat}_3`, icon: '👑', catKey: cat, threshold: 100,
      title: `Monarca de ${CATEGORIES[cat].split(' ')[0]}`,
      desc: `Acierta 100 compuestos de ${CATEGORIES[cat]}.`
    });
  });
  return royalty;
};

const ROYALTY_LIST = generateRoyaltyAchievements();
const ALL_ACHIEVEMENTS = [...BASE_ACHIEVEMENTS, ...ROYALTY_LIST];

// --- MASCOTA ---
const PastelRabbit = ({ mood }) => {
  const skin = "#FFFFFF"; const blush = "#FFB7C5"; 
  const earsInner = "#FFD1DC"; const features = "#4A4A4A";
  return (
    <svg viewBox="0 0 200 200" className={`mascot-svg ${mood === 'happy' ? 'bounce' : ''}`}>
      <g>
        <ellipse cx="75" cy="70" rx="20" ry="50" fill={skin} />
        <ellipse cx="75" cy="70" rx="10" ry="35" fill={earsInner} />
        <ellipse cx="125" cy="70" rx="20" ry="50" fill={skin} />
        <ellipse cx="125" cy="70" rx="10" ry="35" fill={earsInner} />
      </g>
      <circle cx="100" cy="120" r="70" fill={skin} />
      <g transform="translate(0, 10)">
        <circle cx="65" cy="110" r={mood === 'sad' ? 5 : 7} fill={features} />
        <circle cx="135" cy="110" r={mood === 'sad' ? 5 : 7} fill={features} />
        <ellipse cx="55" cy="125" rx="12" ry="7" fill={blush} opacity="0.6" />
        <ellipse cx="145" cy="125" rx="12" ry="7" fill={blush} opacity="0.6" />
        {mood === 'happy' ? (
           <path d="M92,118 Q100,126 108,118" fill="none" stroke={features} strokeWidth="3" strokeLinecap="round"/>
        ) : mood === 'sad' ? <circle cx="100" cy="122" r="2" fill={features} /> : 
           <path d="M94,118 Q100,123 106,118" fill="none" stroke={features} strokeWidth="3" strokeLinecap="round"/>
        }
      </g>
    </svg>
  );
};

// --- MODALES ---

const ChangelogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <h2 style={{color: '#6b8ba5'}}>¡Novedades v{CURRENT_VERSION}!</h2>
      <ul className="changelog-list">
        {CHANGELOG.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <button className="btn btn-blue" onClick={onClose}>¡Genial!</button>
    </div>
  );
};

const TransferModal = ({ isOpen, onClose, data, onImport }) => {
  const [importText, setImportText] = useState("");
  const [msg, setMsg] = useState(null);

  if (!isOpen) return null;

  // Generar código de exportación (Base64 del JSON)
  const exportCode = btoa(JSON.stringify(data));

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode);
    setMsg("¡Código copiado! Pégalo en otro dispositivo.");
    setTimeout(() => setMsg(null), 3000);
  };

  const handleImport = () => {
    try {
      const decoded = atob(importText);
      const parsed = JSON.parse(decoded);
      // Validar estructura básica
      if (parsed.achievements && parsed.stats) {
        onImport(parsed);
        setMsg("¡Datos cargados correctamente!");
        setTimeout(() => { setMsg(null); onClose(); }, 1500);
      } else {
        throw new Error("Formato inválido");
      }
    } catch (e) {
      setMsg("Error: Código inválido.");
    }
  };

  return (
    <div className="modal-overlay">
      <h2>Cross-Saving ☁️</h2>
      <p style={{fontSize:'0.8rem', color:'#888'}}>Transfiere tu progreso entre dispositivos</p>
      
      <div style={{width:'100%', marginBottom:'15px'}}>
        <label style={{fontWeight:'bold', fontSize:'0.9rem'}}>Tu Código (Copiar):</label>
        <textarea className="code-export" readOnly value={exportCode} onClick={(e) => e.target.select()} />
        <button className="btn btn-yellow" onClick={handleCopy}>Copiar Código</button>
      </div>

      <div style={{width:'100%', borderTop:'1px solid #eee', paddingTop:'15px'}}>
        <label style={{fontWeight:'bold', fontSize:'0.9rem'}}>Cargar Código (Pegar):</label>
        <textarea 
          className="code-export" 
          placeholder="Pega aquí el código de otro dispositivo..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <button className="btn" onClick={handleImport}>Restaurar Progreso</button>
      </div>

      {msg && <p style={{color: 'var(--pastel-pink-dark)', fontWeight:'bold'}}>{msg}</p>}
      <button className="btn-icon" onClick={onClose} style={{marginTop:'10px'}}>Cerrar</button>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, settings, toggleCategory }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <h2>Configuración</h2>
      <p style={{fontSize: '0.9rem', color: '#888'}}>Filtrar Compuestos:</p>
      <div className="settings-grid">
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <label key={key} className="toggle-label">
            <input type="checkbox" checked={settings.categories.includes(key)} onChange={() => toggleCategory(key)} />
            {label}
          </label>
        ))}
      </div>
      <button className="btn" onClick={onClose}>Listo</button>
    </div>
  );
};

const PauseModal = ({ isOpen, onResume, onExit }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <h2>Pausa</h2>
      <div style={{width: '100%'}}>
        <button className="btn" onClick={onResume}>Continuar</button>
        <button className="btn btn-secondary" onClick={onExit} style={{marginTop: '15px'}}>Salir al Menú</button>
      </div>
    </div>
  );
};

const ReminderModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="heart-big">💖</div>
      <h2 style={{color: '#ff6b81', fontSize: '2rem'}}>Te amo mucho<br/>mi amor</h2>
      <p style={{marginTop: '20px', color: '#aaa'}}>(Toca para cerrar)</p>
    </div>
  );
};

const AchievementsModal = ({ isOpen, onClose, achievements }) => {
  const [selected, setSelected] = useState(null);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      {selected && (
        <div className="achievement-detail-popup">
          <div style={{fontSize: '3rem'}}>{selected.icon}</div>
          <h3 style={{margin: '10px 0', color: '#bfa15f'}}>{selected.title}</h3>
          <p>{selected.desc}</p>
          <button className="btn btn-yellow" style={{marginTop: '15px', padding: '10px'}} onClick={() => setSelected(null)}>Entendido</button>
        </div>
      )}
      <h2>Tus Logros</h2>
      <p style={{fontSize: '0.9rem', color: '#888'}}>{achievements.length} / {ALL_ACHIEVEMENTS.length} Desbloqueados</p>
      <div className="achievements-grid">
        {ALL_ACHIEVEMENTS.map(ach => {
          const isUnlocked = achievements.includes(ach.id);
          return (
            <div key={ach.id} className={`achievement-item ${isUnlocked ? 'unlocked' : ''}`} onClick={() => setSelected(ach)}>
              <div className="achievement-icon">{ach.icon}</div>
            </div>
          );
        })}
      </div>
      <button className="btn" onClick={onClose}>Cerrar</button>
    </div>
  );
};

// --- PANTALLAS ---
const MainMenu = ({ onStart, onOpenSettings, onOpenAchievements, onOpenReminder, onOpenTransfer }) => (
  <div className="card">
    <PastelRabbit mood="normal" />
    <h1>NameThatCompound</h1>
    <p className="subtitle" style={{marginBottom: '20px'}}>¿Lista para practicar?</p>
    
    <button className="btn" onClick={() => onStart('PRACTICE')}>🌱 Práctica Libre</button>
    <button className="btn btn-secondary" onClick={() => onStart('TIMED')}>⏱️ Contrarreloj</button>
    <button className="btn btn-yellow" onClick={onOpenAchievements}>🏆 Ver Logros</button>

    <div style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap:'wrap'}}>
      <button className="btn-icon" onClick={onOpenSettings}>⚙️ Configurar</button>
      <button className="btn-icon" onClick={onOpenReminder} style={{borderColor: '#ffb7c5', color: '#ffb7c5'}}>💌 Recordatorio</button>
      <button className="btn-icon" onClick={onOpenTransfer}>☁️ Guardar</button>
    </div>
  </div>
);

const GameScreen = ({ mode, categories, onEnd, updateStats, onExitToMenu }) => {
  const [compound, setCompound] = useState(() => getRandomCompound(categories));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'TIMED' ? 60 : null);
  const [feedback, setFeedback] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (mode !== 'TIMED' || timeLeft === null || isPaused) return;
    if (timeLeft <= 0) { onEnd(score); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, mode, onEnd, isPaused, score]);

  useEffect(() => {
    if(!isPaused && !feedback && inputRef.current) inputRef.current.focus();
  }, [isPaused, feedback, compound]);

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback || isPaused) return;
    const isCorrect = compound.answers.map(normalizeText).includes(normalizeText(input));
    
    if (isCorrect) {
      const points = 10 + (streak * 2);
      setScore(s => s + points);
      setStreak(s => s + 1);
      setFeedback({ type: 'correct', msg: '¡Bien hecho!' });
      playSound('correct');
      if (mode === 'TIMED') setTimeLeft(t => t + 3);
      
      // Actualizar estadísticas globales (para logros)
      // Buscamos la Key de categoría inversa (Nombre -> Key)
      const catKey = Object.keys(CATEGORIES).find(key => CATEGORIES[key] === compound.type);
      updateStats(score + points, streak + 1, catKey);

    } else {
      setStreak(0);
      setFeedback({ type: 'wrong', msg: `Era: ${compound.answers[0]}` });
      playSound('wrong');
      if (mode === 'TIMED') setTimeLeft(t => Math.max(0, t - 5));
    }
    setTimeout(() => {
      setFeedback(null); setInput('');
      setCompound(getRandomCompound(categories));
    }, 2000);
  };

  return (
    <div className="card">
      <button className="pause-btn" onClick={() => setIsPaused(true)}>⏸</button>
      <PauseModal isOpen={isPaused} onResume={() => setIsPaused(false)} onExit={onExitToMenu} />
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#888', fontWeight: 'bold', paddingLeft: '40px'}}>
        <span>Pts: {score}</span>
        {mode === 'TIMED' && <span style={{color: timeLeft < 10 ? '#ff8fa3' : 'inherit'}}>⏱️ {timeLeft}s</span>}
        <span>Racha: {streak}</span>
      </div>
      <PastelRabbit mood={feedback?.type === 'correct' ? 'happy' : feedback?.type === 'wrong' ? 'sad' : 'normal'} />
      <div className="formula-display">{compound.formula}</div>
      <div style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '15px'}}>{compound.type}</div>
      <form onSubmit={checkAnswer}>
        <input type="text" ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Nombre del compuesto..." disabled={!!feedback || isPaused} autoComplete="off"/>
        <button className="btn" disabled={!!feedback || !input || isPaused}>{feedback ? feedback.msg : 'Comprobar'}</button>
      </form>
    </div>
  );
};

const GameOverScreen = ({ score, onRestart }) => (
  <div className="card">
    <PastelRabbit mood="happy" />
    <h1 style={{color: '#ffb7c5'}}>¡Terminado!</h1>
    <p>Conseguiste</p>
    <div style={{fontSize: '3.5rem', color: '#6b5b5b', fontWeight: 'bold', margin: '10px 0'}}>{score}</div>
    <p style={{marginBottom: '20px'}}>Puntos</p>
    <button className="btn" onClick={onRestart}>Volver al Menú</button>
  </div>
);

// --- APP PRINCIPAL ---
function App() {
  const [view, setView] = useState('MENU');
  const [mode, setMode] = useState('PRACTICE');
  const [score, setScore] = useState(0);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  // --- ESTADOS PERSISTENTES ---
  // 1. Logros Desbloqueados (IDs)
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('ntc_achievements')) || []);
  
  // 2. Estadísticas para Realeza (Aciertos por Categoría)
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('ntc_stats')) || {});

  // 3. Configuración
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ntc_settings');
    return saved ? JSON.parse(saved) : { categories: Object.keys(CATEGORIES) };
  });

  // Guardar en localStorage cuando cambian
  useEffect(() => localStorage.setItem('ntc_achievements', JSON.stringify(achievements)), [achievements]);
  useEffect(() => localStorage.setItem('ntc_stats', JSON.stringify(stats)), [stats]);
  useEffect(() => localStorage.setItem('ntc_settings', JSON.stringify(settings)), [settings]);

  // Verificar Versión para Changelog
  useEffect(() => {
    const savedVersion = localStorage.getItem('ntc_version');
    if (savedVersion !== CURRENT_VERSION) {
      setShowChangelog(true);
      localStorage.setItem('ntc_version', CURRENT_VERSION);
    }
  }, []);

  const toggleCategory = (key) => {
    const newCats = settings.categories.includes(key) ? settings.categories.filter(c => c !== key) : [...settings.categories, key];
    if (newCats.length > 0) setSettings({ ...settings, categories: newCats });
  };

  // Lógica Central de Progreso
  const updateStats = (currentScore, currentStreak, catKey) => {
    // Actualizar cuenta de categoría
    const newStats = { ...stats };
    if (catKey) {
      newStats[catKey] = (newStats[catKey] || 0) + 1;
      setStats(newStats);
    }

    // Verificar TODOS los logros
    const newUnlocked = [];
    
    // 1. Logros Base (Score/Streak)
    BASE_ACHIEVEMENTS.forEach(ach => {
      if (!achievements.includes(ach.id)) {
        if (ach.id.startsWith('s') && currentScore >= parseInt(ach.desc.match(/\d+/)[0].replace(',',''))) newUnlocked.push(ach.id);
        if (ach.id.startsWith('k') && currentStreak >= parseInt(ach.desc.match(/\d+/)[0])) newUnlocked.push(ach.id);
      }
    });

    // 2. Logros de Realeza (Categoría)
    ROYALTY_LIST.forEach(ach => {
      if (!achievements.includes(ach.id) && catKey === ach.catKey) {
        if (newStats[catKey] >= ach.threshold) newUnlocked.push(ach.id);
      }
    });

    if (newUnlocked.length > 0) {
      setAchievements(prev => [...prev, ...newUnlocked]);
      playSound('unlock');
    }
  };

  // Importar datos desde Cross-Saving
  const handleImportData = (data) => {
    if (data.achievements) setAchievements(data.achievements);
    if (data.stats) setStats(data.stats);
    if (data.settings) setSettings(data.settings);
  };

  // Datos completos para exportar
  const fullPlayerData = { achievements, stats, settings };

  const handleStart = (selectedMode) => { setMode(selectedMode); setScore(0); setView('GAME'); };

  return (
    <>
      <div className="forest-bg"></div>
      <div className="container">
        {view === 'MENU' && (
          <>
            <MainMenu 
              onStart={handleStart} 
              onOpenSettings={() => setShowSettings(true)}
              onOpenAchievements={() => setShowAchievements(true)}
              onOpenReminder={() => setShowReminder(true)}
              onOpenTransfer={() => setShowTransfer(true)}
              // Ya no pasamos onOpenChangelog aquí adentro
            />
            
            {/* --- AQUÍ ESTÁ EL CAMBIO: TEXTO DEBAJO DE LA VENTANA --- */}
            <div className="version-text" onClick={() => setShowChangelog(true)}>
              Versión {CURRENT_VERSION} (Ver novedades)
            </div>
            {/* ------------------------------------------------------- */}

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} toggleCategory={toggleCategory}/>
            <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} achievements={achievements}/>
            <ReminderModal isOpen={showReminder} onClose={() => setShowReminder(false)}/>
            <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} data={fullPlayerData} onImport={handleImportData}/>
            <ChangelogModal isOpen={showChangelog} onClose={() => setShowChangelog(false)}/>
          </>
        )}
        
        {view === 'GAME' && (
          <GameScreen 
            mode={mode} categories={settings.categories} 
            onEnd={(finalScore) => { setScore(finalScore); setView('OVER'); }}
            updateStats={updateStats}
            onExitToMenu={() => setView('MENU')}
          />
        )}
        
        {view === 'OVER' && <GameOverScreen score={score} onRestart={() => setView('MENU')} />}
      </div>
    </>
  );
}

export default App;