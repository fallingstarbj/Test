
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AssessmentResult } from '../types';

interface DashboardProps {
  onStartAssessment: () => void;
  onGoToTherapy: (sceneId: string) => void;
  history?: (AssessmentResult & { name: string, recommendedSceneId?: string })[];
}

const Dashboard: React.FC<DashboardProps> = ({ onStartAssessment, onGoToTherapy, history = [] }) => {
  const hasData = history.length > 0;
  const latestReport = hasData ? history[history.length - 1] : null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case '优': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case '良': return 'text-green-600 bg-green-50 border-green-100';
      case '轻度压力': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case '中度压力': return 'text-orange-600 bg-orange-50 border-orange-100';
      case '高压': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Welcome Message */}
      <div className="px-2">
        <h2 className="text-2xl font-black text-slate-800">你好，李师傅</h2>
        <p className="text-slate-500 text-sm font-medium">今天也是守护安全的一天</p>
      </div>

      {/* Score Explanation Summary (Simplified for Mobile) */}
      <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="space-y-1">
             <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">当前身心指数</p>
             <h3 className="text-5xl font-black">{latestReport ? latestReport.score : '--'} <span className="text-lg opacity-60">/ 30</span></h3>
          </div>
          <button 
            onClick={onStartAssessment}
            className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform"
          >
            开始今日自测
          </button>
        </div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-green-50 shadow-sm flex flex-col items-center space-y-2">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase">本周签到</span>
          <span className="text-lg font-black text-slate-800">5天</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-green-50 shadow-sm flex flex-col items-center space-y-2">
          <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-spa"></i>
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase">疗愈时长</span>
          <span className="text-lg font-black text-slate-800">120min</span>
        </div>
      </div>

      {/* Latest Report Detail Card */}
      <div className="bg-white p-6 rounded-[2rem] border border-green-50 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <i className="fas fa-notes-medical mr-3 text-green-500"></i>
            最新测评分析
          </h3>
          <span className="text-[10px] text-slate-400 font-bold">{latestReport?.date.split(' ')[0] || '暂无'}</span>
        </div>
        
        {latestReport ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border text-center ${getLevelColor(latestReport.level)}`}>
               <p className="text-sm font-bold">状态评级：{latestReport.level}</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              "{latestReport.recommendation}"
            </p>
            {latestReport.recommendedSceneId && (
               <button 
                 onClick={() => onGoToTherapy(latestReport.recommendedSceneId!)}
                 className="w-full bg-green-50 text-green-700 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 active:bg-green-100"
               >
                 <i className="fas fa-magic"></i>
                 <span>开启专属疗愈推荐</span>
               </button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
             <i className="fas fa-seedling text-4xl text-green-100 mb-2"></i>
             <p className="text-slate-400 text-xs">完成测评后，AI 将为您提供深度分析</p>
          </div>
        )}
      </div>

      {/* Trend Chart (Condensed for Mobile) */}
      <div className="bg-white p-6 rounded-[2rem] border border-green-50 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">压力波动趋势</h3>
        {hasData ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 30]} hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-green-50 rounded-2xl">
            <p className="text-slate-300 text-xs font-medium">暂无波动数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
