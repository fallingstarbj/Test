
import React, { useState } from 'react';
import { QUESTIONS, THERAPY_SCENES } from '../constants';
import { analyzeAssessment } from '../geminiService';

interface AssessmentProps {
  onComplete: (score: number, recommendedSceneId?: string, analysis?: string) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [recommendedSceneId, setRecommendedSceneId] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const handleSelect = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishAssessment(newAnswers);
    }
  };

  const finishAssessment = async (finalAnswers: number[]) => {
    setLoading(true);
    const score = finalAnswers.reduce((a, b) => a + b, 0);
    setTotalScore(score);
    try {
      const result = await analyzeAssessment(score, QUESTIONS);
      setAnalysis(result.analysis || "测评完成。");
      setRecommendedSceneId(result.recommendedSceneId || "forest");
    } catch (error) {
      setAnalysis("测评已完成，您的分数为：" + score);
      setRecommendedSceneId("forest");
    }
    setLoading(false);
  };

  if (analysis) {
    const recommendedScene = THERAPY_SCENES.find(s => s.id === recommendedSceneId);
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-green-50 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto">
            <i className="fas fa-check"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800">测评已完成</h3>
          <p className="text-slate-500 text-sm">身心健康度得分：<span className="text-emerald-600 font-black text-xl">{totalScore}</span> / 30</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
               <i className="fas fa-quote-left mr-2"></i>AI 专家建议
             </h4>
             <p className="text-sm text-slate-600 leading-relaxed italic">"{analysis}"</p>
          </div>

          <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80 mb-1 tracking-wider">为您推荐</p>
              <h4 className="text-lg font-black">{recommendedScene?.title || '深度放松'}</h4>
              <p className="text-xs opacity-90">{recommendedScene?.description}</p>
            </div>
            <button 
              onClick={() => onComplete(totalScore, recommendedSceneId || 'forest', analysis || undefined)}
              className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-black text-sm active:scale-95 transition-transform"
            >
              进入疗愈场景
            </button>
          </div>
        </div>

        <button 
          onClick={() => onComplete(totalScore, undefined, analysis || undefined)}
          className="w-full text-slate-400 font-bold text-xs py-2"
        >
          暂时跳过
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="space-y-8 animate-fade-in max-w-lg mx-auto">
      {/* Small Steps Header */}
      <div className="flex justify-between items-end px-2">
        <div className="space-y-1">
          <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">Question {currentStep + 1}</span>
          <h3 className="text-lg font-bold text-slate-800">身心测评</h3>
        </div>
        <span className="text-slate-300 font-bold text-sm">{currentStep + 1} / {QUESTIONS.length}</span>
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mx-auto">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-green-50 space-y-8 min-h-[400px] flex flex-col">
        <h3 className="text-xl font-black text-slate-800 leading-tight">{question.text}</h3>
        
        <div className="flex-1 space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(option.score)}
              disabled={loading}
              className="w-full text-left px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50 active:scale-98 transition-all flex items-center space-x-4 group"
            >
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-slate-700 font-bold text-sm group-hover:text-emerald-700">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-green-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-10">
           <div className="bg-white p-8 rounded-3xl shadow-2xl text-center space-y-4 max-w-xs">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-800 font-black text-lg">AI 正在生成建议</p>
              <p className="text-slate-400 text-xs leading-relaxed">请稍候，辅导员正在根据您的回答制定专属解压计划...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;
