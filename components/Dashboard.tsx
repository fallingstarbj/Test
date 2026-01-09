
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AssessmentResult } from '../types';

interface DashboardProps {
  onStartAssessment: () => void;
  onGoToTherapy: (sceneId: string) => void;
  history?: (AssessmentResult & { name: string, recommendedSceneId?: string, guidance?: string[] })[];
}

const Dashboard: React.FC<DashboardProps> = ({ onStartAssessment, onGoToTherapy, history = [] }) => {
  const hasData = history.length > 0;
  // 获取最后一条记录作为最新报告
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
      <div className="px-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">你好，铁路战友</h2>
        <p className="text-slate-500 text-sm font-medium">今天身心状态如何？</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          <div className="space-y-1">
             <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">Current Wellness Index</p>
             <h3 className="text-6xl font-black">{latestReport ? latestReport.score : '--'} <span className="text-xl opacity-50">/ 30</span></h3>
          </div>
          <button 
            onClick={onStartAssessment}
            className="bg-white text-emerald-600 px-10 py-4 rounded-[1.5rem] font-black text-sm shadow-xl active:scale-95 transition-transform"
          >
            立即身心自测
          </button>
        </div>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-green-50 shadow-sm flex flex-col items-center space-y-2">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-calendar-check"></i>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">本月签到</span>
          <span className="text-lg font-black text-slate-800">{history.length} 次</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-green-50 shadow-sm flex flex-col items-center space-y-2">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-wind"></i>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">身心建议</span>
          <span className="text-lg font-black text-slate-800">{latestReport?.guidance?.length || 0} 条</span>
        </div>
      </div>

      {/* Latest Analysis Section */}
      <div className="bg-white p-6 rounded-[2rem] border border-green-50 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-800 flex items-center">
            <i className="fas fa-chart-line mr-3 text-emerald-500"></i>
            身心分析报告
          </h3>
          <span className="text-[10px] text-slate-400 font-black uppercase">{latestReport?.date.split(' ')[0] || '暂无数据'}</span>
        </div>
        
        {latestReport ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border text-center font-black text-sm ${getLevelColor(latestReport.level)}`}>
               状态评级：{latestReport.level}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <i className="fas fa-quote-left mr-2"></i>专家诊断
                </p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{latestReport.recommendation}"
                </p>
              </div>

              {latestReport.guidance && latestReport.guidance.length > 0 && (
                <div className="space-y-3 pt-2">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <i className="fas fa-shield-heart mr-2"></i>即刻行动指南
                  </p>
                  <div className="space-y-2">
                    {latestReport.guidance.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-slate-600 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {latestReport.recommendedSceneId && (
               <button 
                 onClick={() => onGoToTherapy(latestReport.recommendedSceneId!)}
                 className="w-full bg-emerald-50 text-emerald-700 py-4 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 active:bg-emerald-100 transition-colors"
               >
                 <i className="fas fa-sparkles"></i>
                 <span>进入专属 AI 疗愈空间</span>
               </button>
            )}
          </div>
        ) : (
          <div className="text-center py-10 space-y-4">
             <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
               <i className="fas fa-seedling text-3xl text-emerald-200"></i>
             </div>
             <p className="text-slate-400 text-xs font-medium px-8">完成首次身心测评后，这里将展示您的深度分析报告与专属减压指南</p>
          </div>
        )}
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-[2rem] border border-green-50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-black text-slate-800">压力趋势</h3>
           <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">得分越大压力越高</span>
           </div>
        </div>
        {hasData ? (
          <div className="h-48 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[0, 30]} axisLine={false} tickLine={false} hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-emerald-50 rounded-[2rem]">
            <p className="text-slate-300 text-xs font-black uppercase tracking-widest">No Data Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
