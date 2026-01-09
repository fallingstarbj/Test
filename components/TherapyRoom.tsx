
import React, { useState, useRef, useEffect } from 'react';
import { THERAPY_SCENES } from '../constants';
import { TherapyScene } from '../types';
import ZenGame from './ZenGame';

interface TherapyRoomProps {
  initialSceneId?: string | null;
  onSceneStarted?: () => void;
}

enum TherapyMode {
  CATEGORY_SELECT = 'category_select',
  VIDEO_LIST = 'video_list',
  VIDEO_PLAYER = 'video_player',
  GAME_MODE = 'game_mode'
}

const TherapyRoom: React.FC<TherapyRoomProps> = ({ initialSceneId, onSceneStarted }) => {
  const [mode, setMode] = useState<TherapyMode>(TherapyMode.CATEGORY_SELECT);
  const [selectedScene, setSelectedScene] = useState<TherapyScene | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (mode === TherapyMode.VIDEO_PLAYER && selectedScene) {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
      }
    }
  }, [mode, selectedScene]);

  useEffect(() => {
    if (initialSceneId) {
      const scene = THERAPY_SCENES.find(s => s.id === initialSceneId);
      if (scene) {
        setSelectedScene(scene);
        setMode(TherapyMode.VIDEO_PLAYER);
        onSceneStarted?.();
      }
    }
  }, [initialSceneId, onSceneStarted]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    }
  };

  // 渲染 SVG 动画场景
  const renderSvgScene = (id: string) => {
    switch (id) {
      case 'forest':
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <rect width="400" height="600" fill="#f0fdf4" />
            <g className="animate-sway origin-bottom">
              <path d="M200 500 L200 200" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <path d="M200 350 L250 300" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              <path d="M200 400 L150 350" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              <circle cx="200" cy="200" r="40" fill="#34d399" fillOpacity="0.4" />
            </g>
            <g className="animate-sway-delayed origin-bottom translate-x-20 scale-90 opacity-60">
              <path d="M120 500 L120 300" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="120" cy="300" r="30" fill="#10b981" fillOpacity="0.3" />
            </g>
            <g className="animate-sway-slow origin-bottom translate-x-[-80px] scale-110">
              <path d="M280 500 L280 250" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="280" cy="250" r="50" fill="#059669" fillOpacity="0.2" />
            </g>
            {[...Array(8)].map((_, i) => (
              <circle key={i} r="2" fill="#10b981" fillOpacity="0.5" className="animate-float-dots">
                <animateTransform attributeName="transform" type="translate" 
                  from={`${Math.random()*400} 600`} to={`${Math.random()*400} -50`} 
                  dur={`${5 + Math.random()*5}s`} repeatCount="indefinite" begin={`${i*0.5}s`} />
              </circle>
            ))}
          </svg>
        );
      case 'ocean':
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <rect width="400" height="600" fill="#f0f9ff" />
            <path d="M0 300 Q100 250 200 300 T400 300 V600 H0 Z" fill="#7dd3fc" fillOpacity="0.4" className="animate-wave" />
            <path d="M0 350 Q100 400 200 350 T400 350 V600 H0 Z" fill="#38bdf8" fillOpacity="0.3" className="animate-wave-slow" />
            <path d="M0 400 Q100 370 200 400 T400 400 V600 H0 Z" fill="#0ea5e9" fillOpacity="0.2" className="animate-wave-fast" />
            <circle cx="200" cy="150" r="60" fill="#fbbf24" fillOpacity="0.1" className="animate-pulse" />
          </svg>
        );
      case 'zen':
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <rect width="400" height="600" fill="#fdfcf0" />
            <circle cx="200" cy="300" r="120" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 8" className="animate-spin-slow" />
            <circle cx="200" cy="300" r="100" fill="none" stroke="#059669" strokeWidth="12" strokeOpacity="0.1" className="animate-breathe" />
            <path d="M140 300 L260 300" stroke="#059669" strokeWidth="1" opacity="0.2" />
            <text x="200" y="305" textAnchor="middle" fontSize="12" fill="#059669" className="font-bold tracking-widest opacity-40">BREATHE</text>
          </svg>
        );
      default:
        return null;
    }
  };

  if (mode === TherapyMode.VIDEO_PLAYER && selectedScene) {
    return (
      <div className="space-y-4 animate-fade-in flex flex-col h-[calc(100vh-220px)]">
        <div className="flex justify-between items-center px-1">
          <button onClick={() => setMode(TherapyMode.VIDEO_LIST)} className="text-slate-400 font-bold text-sm flex items-center space-x-1">
            <i className="fas fa-chevron-left"></i>
            <span>返回列表</span>
          </button>
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {selectedScene.title}
          </div>
        </div>

        <div className="relative flex-1 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-green-50">
          <audio ref={audioRef} src={selectedScene.audioUrl} loop />
          
          <div className="w-full h-full">
             {renderSvgScene(selectedScene.id)}
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-2 pointer-events-none bg-gradient-to-t from-white/40 to-transparent">
            <h3 className="text-2xl font-black text-slate-800">{selectedScene.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">{selectedScene.description}</p>
          </div>

          <div className="absolute top-6 right-6">
             <button 
               onClick={toggleAudio}
               className={`w-12 h-12 shadow-lg ${isAudioPlaying ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600'} rounded-2xl flex items-center justify-center transition-all active:scale-95`}
             >
               <i className={`fas ${isAudioPlaying ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
             </button>
          </div>
        </div>

        <style>{`
          @keyframes sway {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(0.9); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.3; }
          }
          @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50px); }
          }
          .animate-sway { animation: sway 4s ease-in-out infinite; }
          .animate-sway-delayed { animation: sway 5s ease-in-out infinite 1s; }
          .animate-sway-slow { animation: sway 7s ease-in-out infinite 0.5s; }
          .animate-wave { animation: wave 10s linear infinite alternate; }
          .animate-wave-slow { animation: wave 15s linear infinite alternate-reverse; }
          .animate-wave-fast { animation: wave 7s linear infinite alternate; }
          .animate-breathe { animation: breathe 6s ease-in-out infinite; transform-origin: center; }
          .animate-spin-slow { animation: spin 20s linear infinite; transform-origin: center; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (mode === TherapyMode.CATEGORY_SELECT) {
    return (
      <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-220px)] overflow-y-auto pb-6">
        <div className="space-y-2 text-center py-4 flex-shrink-0">
          <h3 className="text-3xl font-black text-slate-800">疗愈中心</h3>
          <p className="text-slate-500 text-sm font-medium px-4">在繁忙的工作间隙，给灵魂一次绿色的深呼吸</p>
        </div>
        <div className="grid grid-cols-1 gap-4 px-1">
          <button onClick={() => setMode(TherapyMode.VIDEO_LIST)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-50 flex items-center space-x-6 group active:bg-green-50 transition-colors">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
               <i className="fas fa-mountain"></i>
             </div>
             <div className="text-left">
               <h4 className="text-lg font-black text-slate-800">视觉意象</h4>
               <p className="text-slate-400 text-xs">动态艺术与自然白噪音</p>
             </div>
             <i className="fas fa-chevron-right ml-auto text-slate-200"></i>
          </button>
          <button onClick={() => setMode(TherapyMode.GAME_MODE)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-green-50 flex items-center space-x-6 group active:bg-green-50 transition-colors">
             <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
               <i className="fas fa-gamepad"></i>
             </div>
             <div className="text-left">
               <h4 className="text-lg font-black text-slate-800">指尖减压</h4>
               <p className="text-slate-400 text-xs">互动小游戏，揉碎焦虑</p>
             </div>
             <i className="fas fa-chevron-right ml-auto text-slate-200"></i>
          </button>
        </div>
      </div>
    );
  }

  if (mode === TherapyMode.VIDEO_LIST) {
    return (
      <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-220px)]">
        <div className="flex items-center space-x-3 mb-2 flex-shrink-0">
           <button onClick={() => setMode(TherapyMode.CATEGORY_SELECT)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
             <i className="fas fa-chevron-left"></i>
           </button>
           <h3 className="text-xl font-black text-slate-800">选择疗愈场景</h3>
        </div>
        <div className="flex-1 overflow-y-auto space-y-6 pb-10 px-1 custom-scrollbar">
          {THERAPY_SCENES.map((scene) => (
            <button 
              key={scene.id} 
              onClick={() => { setSelectedScene(scene); setMode(TherapyMode.VIDEO_PLAYER); }} 
              className="w-full bg-white rounded-[2rem] overflow-hidden shadow-sm border border-green-50 group active:scale-95 transition-transform"
            >
              <div className="h-44 bg-emerald-50 flex items-center justify-center relative">
                 <i className={`fas ${scene.icon} text-6xl text-emerald-100 group-hover:text-emerald-500 transition-colors`}></i>
              </div>
              <div className="p-6 text-left">
                <h4 className="text-lg font-black text-slate-800">{scene.title}</h4>
                <p className="text-slate-400 text-xs mt-1">{scene.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === TherapyMode.GAME_MODE) {
    return <ZenGame onBack={() => setMode(TherapyMode.CATEGORY_SELECT)} />;
  }

  return null;
};

export default TherapyRoom;
