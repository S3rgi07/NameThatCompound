// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, getRandomCompound, normalizeText } from './data/compounds';
import './App.css';

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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'wrong') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.2);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
  }
};

// --- LISTA DE LOGROS ---
const ACHIEVEMENTS_LIST = [
  { id: 's1', icon: '🌱', title: 'Novato', desc: 'Consigue 10 puntos en una partida.' },
  { id: 's2', icon: '🌿', title: 'Aprendiz', desc: 'Consigue 50 puntos en una partida.' },
  { id: 's3', icon: '🌳', title: 'Estudioso', desc: 'Consigue 100 puntos en una partida.' },
  { id: 's4', icon: '🍏', title: 'Cosecha', desc: 'Consigue 200 puntos en una partida.' },
  { id: 's5', icon: '🍎', title: 'Experto', desc: 'Consigue 500 puntos en una partida.' },
  { id: 's6', icon: '🥉', title: 'Bronce', desc: 'Consigue 1,000 puntos en una partida.' },
  { id: 's7', icon: '🥈', title: 'Plata', desc: 'Consigue 2,000 puntos en una partida.' },
  { id: 's8', icon: '🥇', title: 'Oro', desc: 'Consigue 5,000 puntos en una partida.' },
  { id: 's9', icon: '💎', title: 'Diamante', desc: 'Consigue 10,000 puntos en una partida.' },
  { id: 's10', icon: '👑', title: 'Leyenda', desc: 'Consigue 20,000 puntos en una partida.' },
  
  { id: 'k1', icon: '🕯️', title: 'Chispa', desc: 'Logra una racha de 5 respuestas seguidas.' },
  { id: 'k2', icon: '🔥', title: 'Fuego', desc: 'Logra una racha de 10 respuestas seguidas.' },
  { id: 'k3', icon: '🧨', title: 'Explosión', desc: 'Logra una racha de 15 respuestas seguidas.' },
  { id: 'k4', icon: '💥', title: 'Boom', desc: 'Logra una racha de 20 respuestas seguidas.' },
  { id: 'k5', icon: '🚀', title: 'Cohete', desc: 'Logra una racha de 30 respuestas seguidas.' },
  { id: 'k6', icon: '🛸', title: 'OVNI', desc: 'Logra una racha de 40 respuestas seguidas.' },
  { id: 'k7', icon: '🌙', title: 'Luna', desc: 'Logra una racha de 50 respuestas seguidas.' },
  { id: 'k8', icon: '☀️', title: 'Sol', desc: 'Logra una racha de 75 respuestas seguidas.' },
  { id: 'k9', icon: '🌌', title: 'Galaxia', desc: 'Logra una racha de 100 respuestas seguidas.' },
  { id: 'k10', icon: '⚛️', title: 'Átomo', desc: 'Logra una racha de 150 respuestas seguidas.' },
];

// --- MASCOTA ---
const PastelRabbit = ({ mood }) => {
  const skin = "#FFFFFF";
  const blush = "#FFB7C5"; 
  const earsInner = "#FFD1DC";
  const features = "#4A4A4A";

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
        ) : mood === 'sad' ? (
           <circle cx="100" cy="122" r="2" fill={features} />
        ) : (
           <path d="M94,118 Q100,123 106,118" fill="none" stroke={features} strokeWidth="3" strokeLinecap="round"/>
        )}
      </g>
    </svg>
  );
};

// --- MODALES ---

// Modal de Configuración
const SettingsModal = ({ isOpen, onClose, settings, toggleCategory }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <h2>Configuración</h2>
      <p style={{fontSize: '0.9rem', color: '#888'}}>Filtrar Compuestos:</p>
      <div className="settings-grid">
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <label key={key} className="toggle-label">
            <input 
              type="checkbox" 
              checked={settings.categories.includes(key)}
              onChange={() => toggleCategory(key)}
            />
            {label}
          </label>
        ))}
      </div>
      <button className="btn" onClick={onClose}>Listo</button>
    </div>
  );
};

// Modal de Pausa
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

// Modal de Recordatorio
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

// Modal de Logros
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
          <button 
            className="btn btn-yellow" 
            style={{marginTop: '15px', padding: '10px'}}
            onClick={() => setSelected(null)}
          >
            Entendido
          </button>
        </div>
      )}

      <h2>Tus Logros</h2>
      <p style={{fontSize: '0.9rem', color: '#888'}}>
        {achievements.length} / 20 Desbloqueados
      </p>
      
      <div className="achievements-grid">
        {ACHIEVEMENTS_LIST.map(ach => {
          const isUnlocked = achievements.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              className={`achievement-item ${isUnlocked ? 'unlocked' : ''}`}
              onClick={() => setSelected(ach)}
            >
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
const MainMenu = ({ onStart, onOpenSettings, onOpenAchievements, onOpenReminder }) => (
  <div className="card">
    <PastelRabbit mood="normal" />
    <h1>NameThatCompound</h1>
    <p className="subtitle" style={{marginBottom: '30px'}}>¿Lista para practicar?</p>
    
    <button className="btn" onClick={() => onStart('PRACTICE')}>
      🌱 Práctica Libre
    </button>
    <button className="btn btn-secondary" onClick={() => onStart('TIMED')}>
      ⏱️ Contrarreloj
    </button>
    <button className="btn btn-yellow" onClick={onOpenAchievements}>
      🏆 Ver Logros
    </button>

    <div style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center'}}>
      <button className="btn-icon" onClick={onOpenSettings}>
        ⚙️ Configurar
      </button>
      <button className="btn-icon" onClick={onOpenReminder} style={{borderColor: '#ffb7c5', color: '#ffb7c5'}}>
        💌 Recordatorio
      </button>
    </div>
  </div>
);

const GameScreen = ({ mode, categories, onEnd, unlockAchievement, onExitToMenu }) => {
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

  const checkAchievements = (newScore, newStreak) => {
    const list = [];
    if (newScore >= 10) list.push('s1');
    if (newScore >= 50) list.push('s2');
    if (newScore >= 100) list.push('s3');
    if (newScore >= 200) list.push('s4');
    if (newScore >= 500) list.push('s5');
    if (newScore >= 1000) list.push('s6');
    if (newScore >= 2000) list.push('s7');
    if (newScore >= 5000) list.push('s8');
    if (newScore >= 10000) list.push('s9');
    if (newScore >= 20000) list.push('s10');

    if (newStreak >= 5) list.push('k1');
    if (newStreak >= 10) list.push('k2');
    if (newStreak >= 15) list.push('k3');
    if (newStreak >= 20) list.push('k4');
    if (newStreak >= 30) list.push('k5');
    if (newStreak >= 40) list.push('k6');
    if (newStreak >= 50) list.push('k7');
    if (newStreak >= 75) list.push('k8');
    if (newStreak >= 100) list.push('k9');
    if (newStreak >= 150) list.push('k10');

    list.forEach(id => unlockAchievement(id));
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (feedback || isPaused) return;
    const isCorrect = compound.answers.map(normalizeText).includes(normalizeText(input));
    
    if (isCorrect) {
      const points = 10 + (streak * 2);
      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore); setStreak(newStreak);
      setFeedback({ type: 'correct', msg: '¡Bien hecho!' });
      playSound('correct');
      if (mode === 'TIMED') setTimeLeft(t => t + 3);
      checkAchievements(newScore, newStreak);
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
        <input 
          type="text"
          ref={inputRef} value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nombre del compuesto..."
          disabled={!!feedback || isPaused} autoComplete="off"
        />
        <button className="btn" disabled={!!feedback || !input || isPaused}>
          {feedback ? feedback.msg : 'Comprobar'}
        </button>
      </form>
    </div>
  );
};

const GameOverScreen = ({ score, onRestart }) => (
  <div className="card">
    <PastelRabbit mood="happy" />
    <h1 style={{color: '#ffb7c5'}}>¡Juego Terminado!</h1>
    <p>Conseguiste</p>
    <div style={{fontSize: '3.5rem', color: '#6b5b5b', fontWeight: 'bold', margin: '10px 0'}}>{score}</div>
    <p style={{marginBottom: '20px'}}>Puntos</p>
    <button className="btn" onClick={onRestart}>Volver al Menú</button>
  </div>
);

// --- APP ---
function App() {
  const [view, setView] = useState('MENU');
  const [mode, setMode] = useState('PRACTICE');
  const [score, setScore] = useState(0);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  
  const [achievements, setAchievements] = useState(() => 
    JSON.parse(localStorage.getItem('ntc_achievements')) || []
  );
  
  const [settings, setSettings] = useState({ categories: Object.keys(CATEGORIES) });

  const toggleCategory = (key) => {
    const newCats = settings.categories.includes(key)
      ? settings.categories.filter(c => c !== key)
      : [...settings.categories, key];
    if (newCats.length > 0) setSettings({ ...settings, categories: newCats });
  };

  const unlockAchievement = (id) => {
    if (!achievements.includes(id)) {
      const newAch = [...achievements, id];
      setAchievements(newAch);
      localStorage.setItem('ntc_achievements', JSON.stringify(newAch));
    }
  };

  const handleStart = (selectedMode) => {
    setMode(selectedMode); setScore(0); setView('GAME');
  };

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
            />
            <SettingsModal 
              isOpen={showSettings} 
              onClose={() => setShowSettings(false)} 
              settings={settings} toggleCategory={toggleCategory}
            />
            <AchievementsModal 
              isOpen={showAchievements} 
              onClose={() => setShowAchievements(false)} 
              achievements={achievements}
            />
            <ReminderModal 
              isOpen={showReminder} 
              onClose={() => setShowReminder(false)} 
            />
          </>
        )}

        {view === 'GAME' && (
          <GameScreen 
            mode={mode} categories={settings.categories} 
            onEnd={(finalScore) => { setScore(finalScore); setView('OVER'); }}
            onExitToMenu={() => setView('MENU')}
            unlockAchievement={unlockAchievement}
          />
        )}

        {view === 'OVER' && (
          <GameOverScreen score={score} onRestart={() => setView('MENU')} />
        )}
      </div>
    </>
  );
}

export default App;