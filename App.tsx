
import React, { useState } from 'react';
import { AppTab, AssessmentResult } from './types';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import TherapyRoom from './components/TherapyRoom';
import AIAdvisor from './components/AIAdvisor';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [assessmentHistory, setAssessmentHistory] = useState<(AssessmentResult & { name: string, recommendedSceneId?: string })[]>([]);
  const [autoStartSceneId, setAutoStartSceneId] = useState<string | null>(null);

  const handleAssessmentComplete = (score: number, recommendedSceneId?: string, analysis?: string) => {
    let level: AssessmentResult['level'] = '优';
    if (score >= 25) level = '高压';
    else if (score >= 20) level = '中度压力';
    else if (score >= 12) level = '轻度压力';
    else if (score >= 6) level = '良';

    const newEntry = {
      name: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      date: new Date().toLocaleString('zh-CN'),
      score: score,
      level: level,
      recommendation: analysis || '测评完成，建议多接触自然，保持规律作息。',
      recommendedSceneId: recommendedSceneId
    };
    
    setAssessmentHistory(prev => [...prev, newEntry]);
    
    if (recommendedSceneId) {
      setAutoStartSceneId(recommendedSceneId);
      setActiveTab(AppTab.THERAPY);
    } else {
      setActiveTab(AppTab.DASHBOARD);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard 
          history={assessmentHistory} 
          onStartAssessment={() => setActiveTab(AppTab.ASSESSMENT)} 
          onGoToTherapy={(sceneId) => {
            setAutoStartSceneId(sceneId);
            setActiveTab(AppTab.THERAPY);
          }}
        />;
      case AppTab.ASSESSMENT:
        return <Assessment onComplete={handleAssessmentComplete} />;
      case AppTab.THERAPY:
        return <TherapyRoom initialSceneId={autoStartSceneId} onSceneStarted={() => setAutoStartSceneId(null)} />;
      case AppTab.COUNSELOR:
        return <AIAdvisor />;
      default:
        return <Dashboard history={assessmentHistory} onStartAssessment={() => setActiveTab(AppTab.ASSESSMENT)} onGoToTherapy={() => {}} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0fdf4]">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-green-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <i className="fas fa-train text-lg"></i>
          </div>
          <span className="text-xl font-black text-green-900 tracking-tight">铁道心语</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <i className="fas fa-bell"></i>
          </button>
          <img src="https://picsum.photos/seed/rail/80/80" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-green-200" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 mb-24 overflow-x-hidden">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-green-50 px-2 py-3 flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        {[
          { id: AppTab.DASHBOARD, icon: 'fa-home', label: '首页' },
          { id: AppTab.ASSESSMENT, icon: 'fa-heartbeat', label: '测评' },
          { id: AppTab.THERAPY, icon: 'fa-spa', label: '疗愈' },
          { id: AppTab.COUNSELOR, icon: 'fa-comment-dots', label: '对话' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 relative px-4 py-1 ${
              activeTab === item.id ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            <div className={`text-xl transition-transform ${activeTab === item.id ? 'scale-110 -translate-y-1' : ''}`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
            {activeTab === item.id && (
              <span className="absolute -top-1 w-1 h-1 bg-green-600 rounded-full"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
