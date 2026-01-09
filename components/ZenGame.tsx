
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

const COLORS = [
  'bg-emerald-400/60', 'bg-teal-400/60', 'bg-green-400/60', 
  'bg-lime-400/60', 'bg-cyan-400/60', 'bg-purple-300/60'
];

interface ZenGameProps {
  onBack: () => void;
}

const ZenGame: React.FC<ZenGameProps> = ({ onBack }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popCount, setPopCount] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playPopSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(900, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.12);
  };

  const createBubble = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    const size = 60 + Math.random() * 100;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return { id, x, y, size, color, popped: false };
  }, []);

  useEffect(() => {
    const initial = Array.from({ length: 10 }).map(() => createBubble());
    setBubbles(initial);
  }, [createBubble]);

  const handlePop = (id: number) => {
    initAudio();
    playPopSound();
    setBubbles(prev => prev.map(b => (b.id === id ? { ...b, popped: true } : b)));
    setPopCount(prev => prev + 1);
    setTimeout(() => {
      setBubbles(prev => {
        const filtered = prev.filter(b => b.id !== id);
        return [...filtered, createBubble()];
      });
    }, 400);
  };

  return (
    <div className="space-y-4 animate-fade-in flex flex-col h-[calc(100vh-220px)]">
      <div className="flex justify-between items-center px-1">
        <button onClick={onBack} className="text-slate-400 font-bold text-sm flex items-center space-x-1">
          <i className="fas fa-chevron-left"></i>
          <span>退出游戏</span>
        </button>
        <div className="bg-white px-4 py-1 rounded-full shadow-sm border border-green-50">
           <span className="text-emerald-600 font-black">{popCount}</span>
           <span className="text-slate-400 text-[10px] ml-2 font-bold uppercase tracking-widest">POPPED</span>
        </div>
      </div>

      <div className="flex-1 relative bg-white rounded-[2.5rem] border-2 border-green-50 shadow-inner overflow-hidden cursor-pointer select-none">
        <div className="absolute top-6 left-0 right-0 text-center pointer-events-none z-10">
           <h4 className="text-slate-800 font-black text-xl">泡泡实验室</h4>
           <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">点击泡泡以触达宁静</p>
        </div>

        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            onClick={() => !bubble.popped && handlePop(bubble.id)}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              transition: 'all 0.35s'
            }}
            className={`absolute rounded-full shadow-sm flex items-center justify-center transform active:scale-90 ${bubble.color} 
              ${bubble.popped ? 'opacity-0 scale-[1.5] blur-xl pointer-events-none' : 'opacity-100 scale-100 animate-float'}`}
          >
            {!bubble.popped && <div className="absolute top-[20%] left-[20%] w-[25%] h-[25%] bg-white/40 rounded-full"></div>}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(4px, -8px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ZenGame;
