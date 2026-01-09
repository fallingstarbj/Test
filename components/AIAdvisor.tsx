
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../geminiService';
import { ChatMessage } from '../types';

const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: '你好，我是你的专属辅导员。无论工作中遇到什么烦心事，或者只是想找人说说话，我都在这里。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', content: response || "抱歉，我刚刚在思考别的事情，能请你再说一遍吗？" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "网络稍微有点波折，请稍后再试哦。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col animate-fade-in relative">
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 py-4 space-y-4"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-green-100 text-green-600'
              }`}>
                <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
              </div>
              <div className={`p-4 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-[1.5rem] rounded-br-none' 
                  : 'bg-white text-slate-700 rounded-[1.5rem] rounded-bl-none border border-green-50'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start pl-8">
            <div className="flex space-x-1 p-3 bg-white border border-green-50 rounded-2xl shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Input (Floating style) */}
      <div className="pt-4 pb-2">
        <div className="bg-white p-2 rounded-[2rem] border border-green-100 shadow-xl flex items-center space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="和我说说话吧..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-3 resize-none max-h-24 min-h-[48px]"
            rows={1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isLoading ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'
            }`}
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
